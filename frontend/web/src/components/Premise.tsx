import { motion } from 'framer-motion';
import { User, Sparkles, ScanLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Premise() {
    const { t } = useTranslation();

    // Mapping steps to match the hardcoded icons/colors with translation content
    const stepsConfig = [
        {
            icon: <User className="w-8 h-8 text-brand-600" />,
            color: "bg-brand-50"
        },
        {
            icon: <Sparkles className="w-8 h-8 text-purple-600" />,
            color: "bg-purple-50"
        },
        {
            icon: <ScanLine className="w-8 h-8 text-blue-600" />,
            color: "bg-blue-50"
        }
    ];

    const steps = stepsConfig.map((config, index) => ({
        ...config,
        title: t(`premise.steps.${index + 1}.title`),
        description: t(`premise.steps.${index + 1}.description`)
    }));

    return (
        <section id="premise" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        {t('premise.title')} <span className="text-brand-600">{t('premise.subtitle')}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t('premise.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative z-10"
                        >
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow text-center h-full group">
                                <div className={`w-16 h-16 ${step.color} rounded-2xl mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed font-light">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
