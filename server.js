const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const staffRoutes = require('./routes/staff');
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/superadmin');
const commonRoutes = require('./routes/common');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/appointmentSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

app.use('/api/user', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/common', commonRoutes);


const createAdmin = async () => {
    const User = require('./models/User');
    const bcrypt = require('bcrypt');

    const username = 'admin';
    const password = 'admin123';

    const adminExists = await User.findOne({ username });
    if (!adminExists) {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({
            firstName: 'System',
            lastName: 'Admin',
            username,
            birthdate: new Date('1990-01-01'),
            phone: '0000000000',
            password: hashed,
            role: 'Admin',
        });
        console.log('Admin created with username: admin and password: admin123');
    }
};

const createSuperAdmin = async () => {
    const User = require('./models/User');
    const bcrypt = require('bcrypt');

    const username = 'superadmin';
    const password = 'super123';

    const superAdminExists = await User.findOne({ username });
    if (!superAdminExists) {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({
            firstName: 'Super',
            lastName: 'Admin',
            username,
            birthdate: new Date('1980-01-01'),
            phone: '1111111111',
            password: hashed,
            role: 'SuperAdmin',
        });
        console.log('SuperAdmin created with username: superadmin and password: super123');
    }
};
createSuperAdmin();



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));