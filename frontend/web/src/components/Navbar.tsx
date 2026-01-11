import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
                scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-gray-100 py-4' : 'bg-transparent py-6'
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/icon.png" alt="GlowMate" className="h-8 w-8 rounded-xl" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                                {t('navbar.brand')}
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            to="/join"
                            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-brand-200 hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {t('navbar.getStarted')}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
