const express = require('express');
const router = express.Router();

router.get('/devices', (req, res, next) => {
    return res.json({ message: 'success',
                      data: req.app.state.devices });
});

router.get('/other', (req, res, next) => {
    return res.json({ message: 'success',
                      data: req.app.state.other });
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
    let data = { active: req.app.state.rumbleAll, type: 'rumble', all: true };
    return res.json({ message: 'success',
                      data });
});

router.get('/state/blackout', (req, res, next) => {
    let data = { active: req.app.state.blackout, type: 'light', all: true };
    return res.json({ message: 'success',
                      data });
});


router.post('/rumble', (req, res, next) => {
    let data = { active: null, type: 'rumble', all: true };
    try {
        if (req.app.state.rumbleAll) {
            data.active = false;
        } else  {
            data.active = true;
        }
        req.app.state.rumbleAll = data.active;
        req.log.info(`[socket.io] rumble all ${data.active}`);
        req.app.io.emit('rumbleAll', data);
        return res.json({ message: 'success',
                          data });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

router.put('/rumble/:id', (req, res, next) => {
    let id = req.params.id;
    let data = { active: null, type: 'rumble', all: false, id: null };
    let device = req.app.state.devices.find(x => x.socketID === id);

    try {
        data.id = device.socketID;
        if (device.rumble) {
            device.rumble = false;
            req.app.io.emit('hasRumbleOff', data);
        } else {
            device.rumble = true;
            req.app.io.emit('hasRumbleOn', data);
        }
        req.log.info('[socket.io] rumble device ${ device.socketID}');
        return res.json({message: 'success',
                         data });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

router.post('/blackout', (req, res, next) => {
    let data = { active: null, type: 'light', all: true };
    try {
        if (req.app.state.blackout) {
            data.active = false;
        } else  {
            data.active = true;
        }
        req.app.state.blackout = data.active;
        req.log.info(`[socket.io] blackout all ${data.active}`);
        req.app.io.emit('blackout', data);
        return res.json({ message: 'success',
                          data });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

router.put('/light/:id', (req, res, next) => {
    let id = req.params.id;
    let data = { active: null, type: 'light', all: false, id: null };
    let device = req.app.state.devices.find(x => x.socketID === id);

    try {
        data.id = device.socketID;
        if (device.light) {
            device.light = false;
            req.app.io.emit('hasLightOff', data);
        } else {
            device.rumble = true;
            req.app.io.emit('hasLightOn', data);
        }
        req.log.info('[socket.io] light device ${ device.socketID}');
        return res.json({message: 'success',
                         data });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

router.post('/randomLights', (req, res, next) => {
    let data = { active: true, all: false, type: 'light', ids: [] };
    try {
        req.app.state.devices.map(x => x.light = false);
        // @todo
        // pick random amount of devices and set them to .light = true

        req.log.info(`[socket.io] picked random devices to light up ${data.ids}`);
        // with this event every client should check if their id is in the array
        req.app.io.emit('randomLightsOn', data);
        return res.json({ message: 'success',
                          data });
    } catch(err) {
        req.log.error(err);
        return next(err);
    }
});

module.exports = router;
