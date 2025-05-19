const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

router.post('/register', async (req, res) => {
    try {
        const { username } = req.body;
        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ message: 'Username already exists' });

        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Registration error', error: err });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, 'secret');
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Login error' });
    }
});

router.post('/appointments', async (req, res) => {
    try {
        const { userId, date } = req.body;
        const appointmentDate = new Date(date);

        const buffer = 30 * 60 * 1000;
        const conflict = await Appointment.findOne({
            date: {
                $gte: new Date(appointmentDate.getTime() - buffer),
                $lte: new Date(appointmentDate.getTime() + buffer),
            }
        });

        if (conflict) {
            return res.status(400).json({ message: 'Time slot is taken or too close to another' });
        }

        const newAppt = new Appointment({ user: userId, date: appointmentDate });
        await newAppt.save();
        res.status(201).json({ message: 'Appointment booked' });
    } catch (err) {
        res.status(500).json({ message: 'Booking failed' });
    }
});

module.exports = router;