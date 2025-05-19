
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/create-staff', verifyToken, isAdmin, async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ message: 'Username already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const newStaff = new User({
            ...req.body,
            password: hashed,
            role: 'Staff',
        });
        await newStaff.save();
        res.status(201).json({ message: 'Staff created' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create staff' });
    }
});

module.exports = router;
