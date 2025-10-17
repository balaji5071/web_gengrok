import React, { useState } from 'react';

function OrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    websiteType: '',
    package: '',
    referral: '', // This part was correct
    preferences: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://web-gengrok.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error.');
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('Thank you for your order! We will be in touch shortly.');
      
      // --- FIX #2: Add `referral` to the form reset ---
      setFormData({ name: '', email: '', phone: '', websiteType: '', package: '', referral: '', preferences: '' });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit order. Please check the console for details.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto my-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Place Your Order</h2>
      <p className="text-center text-gray-500 mb-8">Fill out the details below and we'll get started on your website.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... (Name, Email, Phone, Website Type, and Package fields are here) ... */}
        
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        
        {/* Phone Number Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="123-456-7890" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Website Type Select */}
        <div>
          <label htmlFor="websiteType" className="block text-sm font-medium text-gray-700 mb-1">Website Type *</label>
          <select id="websiteType" name="websiteType" value={formData.websiteType} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="" disabled>Select a type...</option>
            <option value="Portfolio">Portfolio Website</option>
            <option value="Resume">Resume Website</option>
            <option value="Project">Project Website</option>
            <option value="Blog">Blog Website</option>
          </select>
        </div>

        {/* Package Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Your Package *</label>
          <div className="flex items-center justify-around space-x-4">
            <label className="flex items-center space-x-2"><input type="radio" name="package" value="basic" checked={formData.package === 'basic'} onChange={handleChange} required className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" /><span>Basic</span></label>
            <label className="flex items-center space-x-2"><input type="radio" name="package" value="standard" checked={formData.package === 'standard'} onChange={handleChange} required className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" /><span>Standard</span></label>
            <label className="flex items-center space-x-2"><input type="radio" name="package" value="pro" checked={formData.package === 'pro'} onChange={handleChange} required className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" /><span>Pro</span></label>
          </div>
        </div>
        
        {/* --- FIX #1: Add the referral input field here --- */}
        <div>
          <label htmlFor="referral" className="block text-sm font-medium text-gray-700 mb-1">Referral (Optional)</label>
          <input
            type="text"
            id="referral"
            name="referral"
            value={formData.referral}
            onChange={handleChange}
            placeholder="e.g., a friend's name or a code"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Preferences Textarea */}
        <div>
          <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">Preferences & Notes</label>
          <textarea id="preferences" name="preferences" rows="4" value={formData.preferences} onChange={handleChange} placeholder="Tell us about your design preferences, color schemes, content you want to include, etc." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity duration-300">
          Submit Order
        </button>
      </form>
    </div>
  );
}

export default OrderForm;