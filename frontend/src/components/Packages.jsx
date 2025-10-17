import React, { useState, useEffect } from 'react';

// A reusable component for each individual pricing card
const PackageCard = ({ title, price, features, isPopular, offer, onChoosePlanClick }) => {
    const cardClasses = `bg-white p-8 rounded-xl shadow-md border flex flex-col items-center transition-transform duration-300 ${isPopular ? 'border-blue-500 transform scale-105' : 'border-slate-200'}`;
    const buttonClasses = `mt-auto font-semibold py-2 px-6 rounded-lg w-full ${isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`;

    // --- NEW: Price calculation logic ---
    let discountedPrice = null;
    if (offer) {
        const originalPrice = parseFloat(price.replace(/,/g, ''));
        discountedPrice = originalPrice * (1 - offer.discountPercentage / 100);
    }

    return (
        <div className="relative">
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                </div>
            )}
            {/* --- NEW: Offer Badge --- */}
            {offer && (
                 <div className="absolute top-2 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">
                    {offer.discountPercentage}% OFF
                </div>
            )}
            <div className={cardClasses}>
                <h3 className="text-2xl font-semibold text-slate-800">{title}</h3>

                {/* --- NEW: Price Display Logic --- */}
                <div className="my-4">
                    {discountedPrice !== null ? (
                        <div className="text-center">
                            <p className="text-2xl text-slate-400 line-through">₹{price}</p>
                            <p className="text-4xl font-bold text-red-600">₹{Math.round(discountedPrice).toLocaleString()}</p>
                        </div>
                    ) : (
                        <p className="text-4xl font-bold text-slate-900">₹{price}</p>
                    )}
                </div>

                <ul className="space-y-3 text-slate-600 w-full mb-6">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            {feature}
                        </li>
                    ))}
                </ul>
                <button onClick={onChoosePlanClick} className={buttonClasses}>Choose Plan</button>
            </div>
        </div>
    );
};

// The main component that holds all the package cards
function Packages({ onChoosePlanClick }) {
    // --- NEW: State for offers ---
    const [offers, setOffers] = useState([]);

    // --- NEW: Fetch active offers on component load ---
    useEffect(() => {
        fetch('http://localhost:5000/api/offers/active')
            .then(res => res.json())
            .then(data => setOffers(data))
            .catch(error => console.error("Failed to fetch offers:", error));
    }, []);

    const packageData = [
        { title: 'Basic', price: '499', features: ['Single Page', 'Responsive Design', 'Basic Styling', '3 Day Delivery', 'Contact Form'], isPopular: false },
        { title: 'Professional', price: '1,499', features: ['Multi-Page', 'Custom Design', 'SEO Optimized', '5 Day Delivery', 'Portfolio Gallery', 'Contact Form'], isPopular: true },
        { title: 'Premium', price: '3,499', features: ['Advanced Features', 'Custom Animations', 'Blog Integration', '7 Day Delivery', 'Admin Panel', 'Priority Support'], isPopular: false },
    ];

    return (
        <div className="py-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Choose Your Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {packageData.map((pkg, index) => {
                    // --- NEW: Find the relevant offer for this package ---
                    const relevantOffer = offers.find(o => o.applicablePackage === pkg.title);
                    return (
                        <PackageCard
                            key={index}
                            title={pkg.title}
                            price={pkg.price}
                            features={pkg.features}
                            isPopular={pkg.isPopular}
                            offer={relevantOffer} // Pass the found offer as a prop
                            onChoosePlanClick={onChoosePlanClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Packages; 