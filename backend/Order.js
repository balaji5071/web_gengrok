const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    websiteType: { type: String, required: true },
    package: {
        type: String,
        required: true,
        enum: ['basic', 'standard', 'pro']
    },
    referral: { type: String }, // <-- ADDED THIS LINE
    preferences: { type: String },
    status: { type: String, default: 'Pending' },
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;