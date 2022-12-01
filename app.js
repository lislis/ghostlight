require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino');
const pinoHttp = require('pino-http')();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const indexRoute = require('./routes/index.js');

const WS_PORT = process.env['WS_PORT'];

app.io = io;
app.state = {};
app.state.rumbleAll = false;
app.state.blackout = false;

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
app.use('/api', indexRoute);

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
    app.state.devices.push({ socketID: socket.id,
                             light: false,
                             rumble: false });
    logger.info(`[socket.io] device connected socketID: ${socket.id}`);

    socket.on('disconnect', () => {
        const index = app.state.devices.findIndex(x => x.socketID === socket.id);
        app.state.devices.splice(index, 1);
        logger.info('[socket.io] device disconnected', socket.id);
    });

    socket.on('hasSwitchedOn', (data) => {
        //io.emit('started-typing', data);
        logger.info('[socket.io] device has switched on: ', data, socket.id);
    });

    socket.on('hasSwitchedOff', (data) => {
        //    io.emit('stopped-typing', data);
        logger.info('[socket.io] device has switched off: ', data,  socket.id);
    });

    socket.on('hasRumbleOn', (data) => {
        //io.emit('started-typing', data);
        logger.info('[socket.io] device has rumble on: ', data, socket.id);
    });

    socket.on('hasRumbleOff', (data) => {
        //    io.emit('stopped-typing', data);
        logger.info('[socket.io] device has rumble off: ', data,  socket.id);
    });
});

module.exports = app;
