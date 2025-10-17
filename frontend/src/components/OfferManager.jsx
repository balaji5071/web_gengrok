import React, { useState, useEffect } from 'react';

function OfferManager() {
    const [offers, setOffers] = useState([]);
    const [title, setTitle] = useState('');
    const [discount, setDiscount] = useState('');
    const [pkg, setPkg] = useState('standard');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchOffers = () => {
        setIsLoading(true);
        setError('');
        console.log('Fetching offers from backend...');
        fetch('https://web-gengrok.onrender.com/api/offers')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch offers');
                return res.json();
            })
            .then(data => {
                console.log('Received offers:', data);
                setOffers(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching offers:', error);
                setError('Failed to load offers. Please try again.');
                setIsLoading(false);
            });
    };

    useEffect(fetchOffers, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const newOffer = { title, discountPercentage: Number(discount), applicablePackage: pkg };
        console.log('Creating offer:', newOffer);

        fetch('https://web-gengrok.onrender.com/api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOffer),
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to create offer');
            return res.json();
        })
        .then(() => {
            console.log('Offer created successfully');
            alert('Offer created successfully!');
            // Reset form and refresh list
            setTitle(''); setDiscount(''); setPkg('standard');
            fetchOffers();
        })
        .catch(error => {
            console.error('Error creating offer:', error);
            setError('Failed to create offer. Please try again.');
            setIsLoading(false);
        });
    };
    
    const handleDelete = (offerId) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            setIsLoading(true);
            setError('');
            console.log('Deleting offer:', offerId);
            
            fetch(`https://web-gengrok.onrender.com/api/offers/${offerId}`, { method: 'DELETE' })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to delete offer');
                    return res.json();
                })
                .then(() => {
                    console.log('Offer deleted successfully');
                    alert('Offer deleted successfully!');
                    fetchOffers();
                })
                .catch(error => {
                    console.error('Error deleting offer:', error);
                    setError('Failed to delete offer. Please try again.');
                    setIsLoading(false);
                });
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Manage Offers</h2>
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Offer Form */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Create New Offer</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="Offer Title (e.g., Summer Sale)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded"/>
                        <input type="number" placeholder="Discount % (e.g., 20)" value={discount} onChange={e => setDiscount(e.target.value)} required min="1" max="99" className="w-full p-2 border rounded"/>
                        <select value={pkg} onChange={e => setPkg(e.target.value)} className="w-full p-2 border rounded">
                            <option value="basic">Basic Package</option>
                            <option value="standard">Standard Package</option>
                            <option value="pro">Pro Package</option>
                        </select>
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Creating...' : 'Create Offer'}
                        </button>
                    </form>
                </div>
                {/* Existing Offers List */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Current Offers</h3>
                    {isLoading && <p className="text-gray-500">Loading offers...</p>}
                    <div className="space-y-3">
                        {offers.length > 0 ? offers.map(offer => (
                            <div key={offer._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="font-semibold">{offer.title} - {offer.discountPercentage}% off</p>
                                    <p className="text-sm text-gray-500">
                                        Applies to: {offer.applicablePackage.charAt(0).toUpperCase() + offer.applicablePackage.slice(1)}
                                    </p>
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