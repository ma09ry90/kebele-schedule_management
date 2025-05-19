
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    });
}

function isSuperAdmin(req, res, next) {
    if (req.role !== 'SuperAdmin') {
        return res.status(403).json({ message: 'SuperAdmin role required' });
    }
    next();
}

function isAdmin(req, res, next) {
    if (req.role !== 'Admin') {
        return res.status(403).json({ message: 'Admin role required' });
    }
    next();
}

module.exports = { verifyToken, isSuperAdmin, isAdmin };
