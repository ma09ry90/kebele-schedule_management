const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

router.get('/appointments', async (req, res) => {
    const appointments = await Appointment.find().populate('user', 'username');
    res.json(appointments);
});

router.put('/approve/:id', async (req, res) => {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ message: 'Appointment approved' });
});

module.exports = router;