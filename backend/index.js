// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load variables from .env
const Order = require('./Order');
const app = express();
const PORT = process.env.PORT ;
const Offer = require('./Offer');
// --- Middlewares ---
// Allow requests specifically from your frontend domain
app.use(cors({
    origin: 'https://www.gengrok.me'
}));
app.use(express.json()); // Allow server to accept JSON in the request body

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Connection error:', err));

// --- A simple test route ---
app.get('/', (req, res) => {
    res.send('StudentSites API is running!');
});
// --- Order placement route ---
app.post('/api/orders', async (req, res) => {
    try {
        // Add `referral` to the destructuring
        const { name, email, phone, websiteType, package, referral, preferences } = req.body;

        const newOrder = new Order({
            name,
            email,
            phone,
            websiteType,
            package,
            referral, // <-- ADD `referral` here
            preferences
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order received successfully!' });

    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params; // Get the order ID from the URL
        const { status } = req.body; // Get the new status from the request body

        // Check if the status is valid
        if (!['Pending', 'Accepted', 'Rejected', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true } // This option returns the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.status(200).json(updatedOrder);

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error while updating status.' });
    }
});
app.get('/api/orders/all', async (req, res) => {
    try {
        // Query the database to find all documents in the Order collection
        // .sort({ orderDate: -1 }) will show the newest orders first
        const orders = await Order.find({}).sort({ orderDate: -1 });

        // Send the array of orders back as a JSON response
        res.status(200).json(orders);

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders.' });
    }
});
// In backend/index.js

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Order.find({ 
            status: { $in: ['Accepted', 'Completed'] } 
        })
        .sort({ orderDate: -1 })
        .select('_id name websiteType status'); // <-- The change is here

        res.status(200).json(projects);
    } catch (error)
    {
        res.status(500).json({ message: 'Server error while fetching projects.' });
    }
});

app.get('/api/offers', async (req, res) => {
    try {
        const offers = await Offer.find({}).sort({ createdDate: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching offers.' });
    }
});
// In backend/index.js

// ... (your other offer routes are here) ...

// GET route for the public to see active offers
app.get('/api/offers/active', async (req, res) => {
    try {
        const activeOffers = await Offer.find({ isActive: true });
        res.status(200).json(activeOffers);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching active offers.' });
    }
});
// POST route to create a new offer
app.post('/api/offers', async (req, res) => {
    try {
        const { title, discountPercentage, applicablePackage } = req.body;
        const newOffer = new Offer({ title, discountPercentage, applicablePackage });
        await newOffer.save();
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating offer.' });
    }
});

// DELETE route to remove an offer
app.delete('/api/offers/:id', async (req, res) => {
    try {
        const deletedOffer = await Offer.findByIdAndDelete(req.params.id);
        if (!deletedOffer) {
            return res.status(404).json({ message: 'Offer not found.' });
        }
        res.status(200).json({ message: 'Offer deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting offer.' });
    }
});
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});