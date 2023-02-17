const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    return res.json({ message: 'success',
                      data: req.app.state.devices.filter(x => x.type === 'sensor') });
});

module.exports = router;
