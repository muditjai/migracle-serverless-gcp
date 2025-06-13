import React from 'react';
import { createRoot } from 'react-dom/client';
import UseCases from './components/UseCases';
import CustomerPersonas from './components/CustomerPersonas';
import Features from './components/Features';
import CTA from './components/CTA';
import ContactModal from './components/ContactModal';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Mission from './components/Mission';

document.addEventListener('DOMContentLoaded', () => {
    // React component initialization
    
    const heroContainer = document.getElementById('heroRoot');
    if (heroContainer) {
        const root = createRoot(heroContainer);
        root.render(<Hero />);
    }
    
    const missionContainer = document.getElementById('missionRoot');
    if (missionContainer) {
        const root = createRoot(missionContainer);
        root.render(<Mission />);
    }    

    const headerContainer = document.getElementById('headerRoot');
    if (headerContainer) {
        const root = createRoot(headerContainer);
        root.render(<Header />);
    }
    
    const useCasesContainer = document.getElementById('useCasesRoot');
    if (useCasesContainer) {
        const root = createRoot(useCasesContainer);
        root.render(<UseCases />);
    }

    const personasContainer = document.getElementById('customerPersonasRoot');
    if (personasContainer) {
        const root = createRoot(personasContainer);
        root.render(<CustomerPersonas />);
    }

    const featuresContainer = document.getElementById('featuresRoot');
    if (featuresContainer) {
        const root = createRoot(featuresContainer);
        root.render(<Features />);
    }
    
    const ctaContainer = document.getElementById('ctaRoot');
    if (ctaContainer) {
        const root = createRoot(ctaContainer);
        root.render(<CTA />);
    }

    const footerContainer = document.getElementById('footerRoot');
    if (footerContainer) {
        const root = createRoot(footerContainer);
        root.render(<Footer />);
    }
    
    const modalContainer = document.getElementById('modalRoot');
    if (modalContainer) {
        const root = createRoot(modalContainer);
        root.render(<ContactModal />);
    }
});
