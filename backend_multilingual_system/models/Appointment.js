const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);