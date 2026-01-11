import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, ScanFace } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useRef } from 'react';

export function Hero() {
    const { t } = useTranslation();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-brand-50/30">
            {/* Parallax Background Elements */}
            <motion.div
                style={{ y: yBackground }}
                className="absolute inset-0 w-full h-full pointer-events-none"
            >
                <div className="absolute top-20 left-10 w-72 h-72 bg-brand-300/20 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
            </motion.div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 pt-20">
                <motion.div
                    style={{ opacity: textOpacity }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-brand-100 shadow-sm mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-600">{t('hero.badge')}</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                        {t('hero.title')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 animate-gradient-x">
                            {t('hero.subtitle')}
                        </span>
                    </h1>

                    <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                        <Trans i18nKey="hero.description" components={{ 1: <span className="font-semibold text-brand-600" /> }} />
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/join"
                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg shadow-xl hover:bg-black hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                        >
                            {t('hero.cta')}
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button
                            onClick={() => document.getElementById('premise')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                        >
                            {t('hero.secondaryCta')}
                            <ScanFace className="ml-2 h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Trust/Feature Pills */}
                    <div className="mt-16 flex flex-wrap justify-center gap-4 opacity-70">
                        {['smartScanning', 'allergyShield', 'communityReviews', 'aiAnalysis'].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/50 border border-gray-100 text-sm font-medium text-gray-500">
                                <Sparkles className="w-3 h-3 text-brand-400" />
                                <span>{t(`hero.pills.${item}`)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
