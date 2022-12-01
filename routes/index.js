const express = require('express');
const router = express.Router();

router.get('/devices', (req, res, next) => {
    res.json(req.app.state.devices);
});

router.post('/rumble', (req, res, next) => {
    let message = { message: null };
    try {
        if (req.app.state.rumbleAll) {
            message.message = false;
        } else  {
            message.message = false;
        }
        req.app.state.rumbleAll = message.message;
        req.log.info(`[socket.io] rumble all ${message.message}`);
        req.app.io.emit('rumbleAll', message);
        res.json({ message: 'success',
                   data: req.app.state });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

router.put('/rumble/:id', (req, res, next) => {
    // find one in state
    // emit message
});

router.post('/blackout', (req, res, next) => {
    let message = { message: null };
    try {
        if (req.app.state.blackout) {
            message.message = false;
        } else  {
            message.message = true;
        }
        req.app.state.blackout = message.message;
        req.log.info(`[socket.io] blackout all ${message.message}`);
        req.app.io.emit('blackout', message);
        res.json({ message: 'success',
                   data: req.app.state });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});
