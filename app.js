require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino');
const pinoHttp = require('pino-http')();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:4000", "http://localhost:5173" ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const indexRoute = require('./routes/index.js');
const sensorsRoute = require('./routes/sensors.js');

const WS_PORT = process.env['WS_PORT'];

app.io = io;
app.state = {};
app.state.rumbleAll = false;
app.state.blackout = false;
app.state.devices = [];
app.state.sensors = [];
app.state.other = [];

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    mixin() {
        return { app: '[server]' }
    }
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


// Socket IO
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

module.exports = app;
