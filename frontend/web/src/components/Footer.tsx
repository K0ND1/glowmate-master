import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-white border-t border-gray-100 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-12 text-center">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-4 block">
                        {t('navbar.brand')}
                    </Link>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                        {t('footer.tagline')}
                    </p>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} GlowMate. {t('footer.rights')}</p>
                    <div className="flex items-center mt-4 md:mt-0">
                        <span>{t('footer.madeWith')} <span className="text-red-500">♥</span> {t('footer.by')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
