// src/App.jsx
import React, { useRef } from 'react';
import { Routes, Route } from 'react-router-dom'; // 1. Import Routes and Route
import Header from './components/Header';
import Hero from './components/Hero';
import Packages from './components/Packages';
import OrderForm from './components/OrderForm';
import ProjectBoard from './components/ProjectBoard';
import Footer from './components/Footer';
import AdminDashboard from './pages/AdminDashboard'; // 2. Import the new page

// Create a new component for the main landing page
const HomePage = () => {
    const formRef = useRef(null);
    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <>
            <Header onGetStartedClick={handleScrollToForm} />
            <main className="container mx-auto px-4 flex-grow">
                <Hero onOrderClick={handleScrollToForm} />
                <Packages onChoosePlanClick={handleScrollToForm} />
                <ProjectBoard />
                <div ref={formRef}>
                    <OrderForm />
                </div>
            </main>
            <Footer />
        </>
    );
};

// Main App component now handles routing
function App() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/genadmingrok" element={<AdminDashboard />} />
        </Routes>
    </div>
  );
}

export default App;