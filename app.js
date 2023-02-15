require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino');
const pinoHttp = require('pino-http')();
const WebSocket = require("ws");

const app = express();
const server = require('http').createServer(app);
//const WS_PORT = process.env['WS_PORT'];
const websocketServer = new WebSocket.Server({ server, clientTracking: true });

const indexRoute = require('./routes/index.js');
const sensorsRoute = require('./routes/sensors.js');

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    mixin() {
        return { app: '[server]' }
    }
});

app.state = {};
app.state.rumbleAll = false;
app.state.blackout = false;
app.state.devices = [];
app.state.sensors = [];
app.state.other = [];

function heartbeat() {
    this.isAlive = true;
}

const interval = setInterval(function ping() {
    websocketServer.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

websocketServer.on('close', function close() {
    clearInterval(interval);
});

websocketServer.on("connection", (ws, req) => {
    logger.info('[ws] connection', ws);

    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('error', logger.error);

    const ip = req.socket.remoteAddress;

    let data = { subject: 'register-pls', body: { ip } };
    ws.send(JSON.stringify(data));

    ws.on('message', (data) => {
        logger.info(`[ws][message] ${data}`);

        let response = JSON.parse(data);

        switch(response.subject) {
        case 'registration':
            if (response.body.type === 'webclient') {
                let index = app.state.other.findIndex(x => x.ip === response.body.ip);
                if (index !== -1) {
                    app.state.other.splice(index, 1);
                    logger.info(`[ws] already registered ${response.body.ip}, replacing`);
                }
                app.state.other.push(response.body);
                //ws.send()
                // send welcome so the webclient can add stuff
                logger.info(`[ws] registering ${response.body.ip} as ${response.body.type}`);
            }
            break;
        case 'requestBlackoutAll':
            app.state.blackout = !app.state.blackout;
            websocketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ subject: 'blackout',
                                                 body: { active: app.state.blackout }}));
                }
            });
            break;
        case 'requestRumbleAll':
            app.state.rumbleAll = !app.state.rumbleAll;
            websocketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ subject: 'rumbleAll',
                                                 body: { active: app.state.rumbleAll }}));
                }
            });
            break;
        case 'requestRandomLightup':
            let devices = app.state.devices
                .filter(x => true); // actual filter

            let payload = JSON.stringify({ subject: 'lightup',
                                           body: { active: true,
                                                   devices }});
            ws.send(payload);

            let a = Array.from(websocketServer.clients);
            a.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(payload);
                }
            });
            break;
        default:
            logger.info(`[ws] Did not know message ${response.subject}`);
        }
    });

    //ws.on('disconnect')
});


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(pinoHttp);
app.use(bodyParser.json({ limit: '1mb'}));
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static('frontend/dist'));
app.use(express.static('public'));
app.use('/api', indexRoute);
app.use('/api/sensors', sensorsRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
          ? 'Pipe ' + port
          : 'Port ' + port;

    switch (error.code) {
    case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
          ? 'pipe ' + addr
          : 'port ' + addr.port;
    logger.info('[express] Listening on ' + bind);
}




// Socket IO
/*
  logger.info(`[socket.io] websocket listen on ${WS_PORT}`);
  server.listen(WS_PORT);

  app.io.on('connection', (socket) => {
  logger.info(`[socket.io] device connected socketID: ${socket.id}`);

  socket.emit('TEST', { key: 'foo', value: 'bar' });

  socket.on('ping', () => {
  console.log('[socket.io] heya');
  });

  socket.on('register', (data) => {
  logger.info('[socket.io]', data);


  logger.info(`[socket.io] socketID ${data.socketID} registered as ${data.id}, ${data.type}`);
  if (data.type === 'flashlight') {
  app.state.devices.push({ socketID: socket.id,
  deviceID: data.id,
  light: false,
  rumble: false,
  switch: false });
  } else if (data.type == 'sensor') {
  app.state.sensors.push({ socketID: socket.id,
  deviceID: data.id,
  value: null,
  threshold: null });
  } else {
  app.state.other.push({ socketID: socket.id, type: data.type });
  }

  });

  socket.on('disconnect', () => {
  let index = app.state.devices.findIndex(x => x.socketID === socket.id);
  if (index) {
  app.state.devices.splice(index, 1);
  logger.info('[socket.io] device disconnected', socket.id);
  //return;
  }
  index = app.state.sensors.findIndex(x => x.socketID === socket.id);
  if (index) {
  app.state.sensors.splice(index, 1);
  logger.info('[socket.io] device disconnected', socket.id);
  //return;
  }
  index = app.state.other.findIndex(x => x.socketID === socket.id);
  if (index) {
  app.state.other.splice(index, 1);
  logger.info('[socket.io] other disconnected', socket.id);
  //return;
  }

  // other ids
  });

  socket.on('changeDevice', (data) => {
  logger.info(`[socket.io] webclient tells ${data.socketID} to change ${data.type}`, data);
  const device = app.state.devices.find(x => x.deviceID === data.deviceID);
  device[data.type] = !device[data.type];
  socket.broadcast.emit('changeDevice', { socketID: device.socketID,
  deviceID: device.deviceID,
  type: data.type,
  value: device[data.type] });

  //comes from webclient
  // broadcast to devices
  });

  socket.on('changeSensorTheshold', (data) => {
  // tbd
  // comes form webclient
  // broadcast to sensors
  });

  socket.on('sensorValueChanged', (data) => {
  // tbd
  // comes from sensor
  // display to webclient
  });

  socket.on('makeBlackout', (_data) => {
  socket.broadcast.emit('blackout');
  });

  socket.on('hasSwitchedOn', (data) => {
  logger.info('[socket.io] user has device has switched on: ', data, socket.id);
  const device = app.state.devices.find(x => x.socketID === socket.id);
  device.switch = true;
  });

  socket.on('hasSwitchedOff', (data) => {
  logger.info('[socket.io] user has device has switched off: ', data,  socket.id);
  const device = app.state.devices.find(x => x.socketID === socket.id);
  device.switch = false;
  });

  });
*/

module.exports = app;
