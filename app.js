require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino');
const pinoHttp = require('pino-http')();
const WebSocket = require("ws");
const {parse, stringify, toJSON, fromJSON} = require('flatted');

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

const msgAll = (msgIndex, msgRecip, msgName, msgType) => {
    app.state[msgIndex] = !app.state[msgIndex];

    app.state.devices
        .filter(x => x.type === msgRecip)
        .forEach(x => {
            x.ws.send(`${msgType}-${app.state[msgIndex]}`);
        });
    app.state.devices
        .filter(x => x.type === 'webclient')
        .map(x => x.ws.send(JSON.stringify({subject: msgIndex,
                                            body: { active: app.state[msgIndex],
                                                    all: true,
                                                    type: msgType
                                                  }})));
};

websocketServer.on('close', function close() {
    clearInterval(interval);
});

websocketServer.on("connection", (ws, req) => {
    logger.info('[ws] connection', ws);

    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('error', logger.error);

    const ip = req.socket.remoteAddress;

    ws.on('message', (data) => {
        logger.info(`[ws][incoming] ${data}`);

        let msg = '' + data; // data is a buffer
        console.log(data);

        if (msg.includes('this-is-light')) {
            let deviceID = msg.split('___')[1];
            // we send a version without ws to the webclient
            // to avoid circular structures for JSON parsing
            let bodyClient = { ip, deviceID, type: 'light',
                               light: false, rumble: false, switch: false };
            let body = { ip, deviceID, ws, type: 'light',
                               light: false, rumble: false, switch: false };
            logger.info(`[ws] light detected ${deviceID}`);
            app.state.devices.push(body);
            ws.send('server-says-ACK');

            let newLightPayload = JSON.stringify({subject: 'new-light', body: bodyClient});
            app.state.devices
                .filter(x => x.type === 'webclient')
                .map(x => x.ws.send(newLightPayload));

        } else if(msg.includes('this-is-webclient')) {
            let deviceID = msg.split('___')[1];
            let body = { ip, deviceID, ws, type: 'webclient' };
            logger.info(`[ws] webclient detected ${deviceID}`);
            app.state.devices.push(body);
            ws.send('server-says-ACK');

        } else {
            let response = JSON.parse(data);

            switch(response.subject) {

            case 'requestBlackoutAll':
                msgAll('blackout', 'light', 'blackout', 'light');
                break;
            case 'requestRumbleAll':
                msgAll('rumbleAll', 'light', 'rumble', 'rumble');
                break;
            case 'requestRandomLightup':
                console.log("[ws] random lights function not yet implemented, please manually select lights")
                break;
            default:
                logger.info(`[ws] Did not know message ${response.subject}`);
            }
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

module.exports = app;
