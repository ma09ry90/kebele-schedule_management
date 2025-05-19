
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { verifyToken, isSuperAdmin } = require('../middleware/auth');

router.post('/create-admin', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await User.findOne({ username });
        if (exists) return res.status(400).json({ message: 'Username already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            ...req.body,
            password: hashed,
            role: 'Admin',
        });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create admin' });
    }
});

module.exports = router;
