import React, { useState, useEffect } from 'react';

function OfferManager() {
    const [offers, setOffers] = useState([]);
    const [title, setTitle] = useState('');
    const [discount, setDiscount] = useState('');
    const [pkg, setPkg] = useState('Professional');

    const fetchOffers = () => {
        fetch('http://localhost:5000/api/offers')
            .then(res => res.json())
            .then(data => setOffers(data));
    };

    useEffect(fetchOffers, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newOffer = { title, discountPercentage: Number(discount), applicablePackage: pkg };

        fetch('http://localhost:5000/api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOffer),
        })
        .then(() => {
            // Reset form and refresh list
            setTitle(''); setDiscount(''); setPkg('Professional');
            fetchOffers();
        });
    };
    
    const handleDelete = (offerId) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            fetch(`http://localhost:5000/api/offers/${offerId}`, { method: 'DELETE' })
                .then(fetchOffers);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Manage Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Offer Form */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Create New Offer</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Offer Title (e.g., Summer Sale)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded"/>
                        <input type="number" placeholder="Discount % (e.g., 20)" value={discount} onChange={e => setDiscount(e.target.value)} required min="1" max="99" className="w-full p-2 border rounded"/>
                        <select value={pkg} onChange={e => setPkg(e.target.value)} className="w-full p-2 border rounded">
                            <option value="Basic">Basic Package</option>
                            <option value="Professional">Professional Package</option>
                            <option value="Premium">Premium Package</option>
                        </select>
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Create Offer</button>
                    </form>
                </div>
                {/* Existing Offers List */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Current Offers</h3>
                    <div className="space-y-3">
                        {offers.length > 0 ? offers.map(offer => (
                            <div key={offer._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="font-semibold">{offer.title} - {offer.discountPercentage}% off</p>
                                    <p className="text-sm text-gray-500">Applies to: {offer.applicablePackage}</p>
                                </div>
                                <button onClick={() => handleDelete(offer._id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                            </div>
                        )) : <p>No active offers.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OfferManager;