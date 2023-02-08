const express = require('express');
const router = express.Router();

router.get('/devices', (req, res, next) => {
    return res.json({ message: 'success',
                      data: req.app.state.devices });
});

router.get('/devices/:id', (req, res, next) => {
    const id = req.params.id;
    let device = req.app.state.devices.find(x => x.socketID === id);

    if (device) {
        return res.json({ message: 'success',
                          data: device });
    } else {
        req.log.error(err);
        return next(err);
    }
});

router.get('/state/rumble', (req, res, next) => {
    return res.json({ message: 'success',
                      data: req.app.state.rumbleAll});
});

router.get('/state/blackout', (req, res, next) => {
    return res.json({ message: 'success',
                      data: req.app.state.blackout });
});


router.post('/rumble', (req, res, next) => {
    let message = { message: null, type: 'rumble', all: true };
    try {
        if (req.app.state.rumbleAll) {
            message.message = false;
        } else  {
            message.message = true;
        }
        req.app.state.rumbleAll = message.message;
        req.log.info(`[socket.io] rumble all ${message.message}`);
        req.app.io.emit('rumbleAll', message);
        return res.json({ message: 'success',
                          data: message });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

router.put('/rumble/:id', (req, res, next) => {
    let id = req.params.id;
    let message = { message: null, type: 'rumble', all: false };

    let device = req.app.state.devices.find(x => x.socketID === id);

    if (device) {
        message.id = device.socketID;
        if (device.rumble) {
            device.rumble = false;
            req.app.io.emit('hasRumbleOff', message);
        } else {
            device.rumble = true;
            req.app.io.emit('hasRumbleOn', message);
        }
        req.log.info('[socket.io] rumble device ${ device.socketID}');
        return res.json({message: 'success',
                         data: message });
    } else {
        req.log.error(err);
        return next(err);
    }
});

router.post('/blackout', (req, res, next) => {
    let message = { message: null, type: 'light', all: true };
    try {
        if (req.app.state.blackout) {
            message.message = false;
        } else  {
            message.message = true;
        }
        req.app.state.blackout = message.message;
        req.log.info(`[socket.io] blackout all ${message.message}`);
        req.app.io.emit('blackout', message);
        return res.json({ message: 'success',
                          data: message });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

module.exports = router;
