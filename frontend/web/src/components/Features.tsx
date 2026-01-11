import { ScanBarcode, ShieldAlert, Users, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function Features() {
    const { t } = useTranslation();

    const features = [
        {
            icon: <ScanBarcode className="h-8 w-8 text-brand-600" />,
            title: t('features.scanning.title'),
            description: t('features.scanning.description'),
            color: 'bg-brand-100',
            delay: 0
        },
        {
            icon: <ShieldAlert className="h-8 w-8 text-red-600" />,
            title: t('features.allergies.title'),
            description: t('features.allergies.description'),
            color: 'bg-red-100',
            delay: 0.1
        },
        {
            icon: <Users className="h-8 w-8 text-blue-600" />,
            title: t('features.community.title'),
            description: t('features.community.description'),
            color: 'bg-blue-100',
            delay: 0.2
        },
        {
            icon: <BrainCircuit className="h-8 w-8 text-purple-600" />,
            title: t('features.ai.title'),
            description: t('features.ai.description'),
            color: 'bg-purple-100',
            delay: 0.3
        },
    ];

    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        {t('features.title')} <span className="text-brand-600">{t('features.subtitle')}</span>
                    </h2>
                    <p className="text-xl text-gray-600 font-light">
                        {t('features.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-100 group"
                        >
                            <div className={`h-14 w-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-light text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
