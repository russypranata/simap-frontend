'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    HeroSection,
    RolesSection,
    FeaturesSection,
    RelatedAppsSection,
    LandingHeader,
    LandingFooter,
    ScrollToTopButton,
} from '../components';

/**
 * WelcomeScreen - Main landing page component
 * 
 * This component serves as the entry point for the application,
 * displaying information about SIMAP and providing login functionality.
 * 
 * Features:
 * - Hero section with call-to-action
 * - User roles overview
 * - Features showcase
 * - Related applications
 * - About section
 * - Navigation to login page
 */
export const WelcomeScreen: React.FC = () => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll event for header and scroll-to-top button
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle login - navigate to login page
    const handleLoginClick = () => {
        router.push('/login');
    };

    // Handle navigation to sections
    const handleNavigate = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    // Main landing page
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20 selection:text-primary">
            <LandingHeader
                scrolled={scrolled}
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                onLoginClick={handleLoginClick}
                onNavigate={handleNavigate}
            />

            <main>
                <HeroSection onLoginClick={handleLoginClick} />
                <RolesSection />
                <FeaturesSection />
                <RelatedAppsSection />
            </main>

            <LandingFooter onLoginClick={handleLoginClick} />

            <ScrollToTopButton visible={scrolled} />
        </div>
    );
};
