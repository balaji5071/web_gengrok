import React, { useEffect, useState } from 'react';

// A reusable component for each individual pricing card
const PackageCard = ({ title, price, features, isPopular, offer, onChoosePlanClick }) => {
    // --- CHANGED: Added hover effects and tweaked transition for the whole card ---
    const cardClasses = `bg-white p-8 rounded-xl shadow-md border flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${isPopular ? 'border-blue-500 transform scale-105' : 'border-slate-200'}`;
    const buttonClasses = `mt-auto font-semibold py-2 px-6 rounded-lg w-full transition-all duration-300 transform hover:scale-105 ${isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`;

    let discountedPrice = null;
    if (offer) {
        const originalPrice = parseFloat(price.replace(/,/g, ''));
        discountedPrice = originalPrice * (1 - offer.discountPercentage / 100);
    }

    return (
        <div className="relative">
            {/* --- FIX: Give offer badge a higher z-index (e.g., z-20) and ensure Most Popular has z-10 --- */}
            {/* Offer Badge - ADDED z-20 */}
            {offer && (
                 <div className="absolute top-0 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 z-20"> {/* <-- ADDED z-20 */}
                    {offer.discountPercentage}% OFF
                </div>
            )}
            
            {/* Most Popular Badge - ADDED z-10 */}
            {isPopular && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full z-10"> {/* <-- ADDED z-10 */}
                    Most Popular
                </div>
            )}
            
            <div className={cardClasses}>
                <h3 className="text-2xl font-semibold text-slate-800">{title}</h3>

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
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        console.log('Fetching active offers for packages...');
        fetch('https://web-gengrok.onrender.com/api/offers/active')
            .then(res => res.json())
            .then(data => {
                console.log('Active offers received:', data);
                setOffers(data);
            })
            .catch(error => console.error("Failed to fetch offers:", error));
    }, []);

    const packageData = [
        { title: 'Basic', price: '499', features: ['Single Page', 'Responsive Design', 'Basic Styling', '3 Day Delivery', 'Contact Form'], isPopular: false, packageType: 'basic' },
        { title: 'Standard', price: '1,499', features: ['Multi-Page', 'Custom Design', 'SEO Optimized', '5 Day Delivery', 'Portfolio Gallery', 'Contact Form'], isPopular: true, packageType: 'standard' },
        { title: 'Pro', price: '3,499', features: ['Advanced Features', 'Custom Animations', 'Blog Integration', '7 Day Delivery', 'Admin Panel', 'Priority Support'], isPopular: false, packageType: 'pro' },
    ];

    return (
        <div className="py-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Choose Your Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {packageData.map((pkg, index) => {
                    // Match using lowercase packageType instead of capitalized title
                    const relevantOffer = offers.find(o => o.applicablePackage === pkg.packageType);
                    console.log(`Package: ${pkg.title} (${pkg.packageType}) - Offer found:`, relevantOffer);
                    return (
                        <PackageCard
                            key={index}
                            title={pkg.title}
                            price={pkg.price}
                            features={pkg.features}
                            isPopular={pkg.isPopular}
                            offer={relevantOffer}
                            onChoosePlanClick={onChoosePlanClick}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Packages;