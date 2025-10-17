// backend/Offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "New Year Special"
    discountPercentage: { type: Number, required: true, min: 1, max: 99 },
    applicablePackage: { type: String, required: true, enum: ['Basic', 'Professional', 'Premium'] },
    isActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now }
});

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;