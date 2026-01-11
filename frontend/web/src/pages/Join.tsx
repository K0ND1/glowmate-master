import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertCircle, Copy, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Join() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [referralData, setReferralData] = useState<{ position: number, referralCode: string, points: number } | null>(null);
    const [searchParams] = useSearchParams();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setStatus('error');
            setMessage(t('join.errors.invalidEmail'));
            setLoading(false);
            return;
        }

        const referredBy = searchParams.get('ref');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://api.glowmate.tech';

            const response = await fetch(`${apiUrl}/v1/waitlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, referredBy }),
            });

            const data = await response.json();

            if (!response.ok && response.status !== 200) {
                throw new Error(data.message || t('join.errors.generic'));
            }

            setStatus('success');
            setMessage(t('join.success.title'));

            if (data.data) {
                setReferralData(data.data);
            }
            setEmail('');
        } catch (error: any) {
            console.error('Submission error:', error);
            setStatus('error');
            setMessage(error.message || t('join.errors.generic'));
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!referralData) return;
        const link = `${window.location.origin}/join?ref=${referralData.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Left Side - Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-brand-50/50 relative overflow-hidden">
                <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-brand-600 transition-colors">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Home
                </Link>

                <div className="max-w-md mx-auto w-full z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="h-16 w-16 bg-brand-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-200">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                            {t('join.title')} <span className="text-brand-600">{t('join.highlight')}</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {t('join.description')}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-700">
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span>{t('join.benefits.access')}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700">
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span>{t('join.benefits.community')}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-700">
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span>{t('join.benefits.support')}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-white">
                <div className="max-w-md mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('join.form.title')}</h2>

                        {status === 'success' && referralData ? (
                            <div className="bg-white border-2 border-brand-100 rounded-3xl p-8 text-center shadow-xl shadow-brand-100/50">
                                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                    <span className="text-4xl">🎉</span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('join.success.title')}</h3>
                                {/* <p className="text-gray-600 mb-8">{message}</p> */}

                                <div className="bg-brand-50 rounded-xl p-6 mb-8 transform transition-transform hover:scale-105 duration-300">
                                    <p className="text-sm text-brand-600 font-semibold uppercase tracking-wider mb-2">{t('join.success.position')}</p>
                                    <div className="text-5xl font-black text-brand-600">
                                        #{referralData.position}
                                    </div>
                                    <p className="text-sm text-brand-500 mt-2">{t('join.success.inLine')}</p>
                                </div>

                                <div className="text-left mb-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Users className="h-5 w-5 text-brand-600" />
                                        <span className="font-semibold text-gray-900">{t('join.success.invite')}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {t('join.success.shareDesc')} <span className="font-bold text-green-600">{t('join.success.points')}</span> {t('join.success.friend')}
                                    </p>

                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 font-mono truncate">
                                            {window.location.origin}/join?ref={referralData.referralCode}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="bg-brand-600 hover:bg-brand-700 text-white p-3 rounded-lg transition-colors flex items-center justify-center group"
                                            title="Copy link"
                                        >
                                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                                        </button>
                                    </div>
                                    {copied && <p className="text-xs text-green-600 mt-2 font-medium text-right animate-pulse">{t('join.success.copied')}</p>}
                                </div>

                                <button
                                    onClick={() => { setStatus('idle'); setReferralData(null); }}
                                    className="text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors"
                                >
                                    {t('join.success.registerAnother')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('join.form.emailLabel')}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                                        placeholder={t('join.form.emailPlaceholder')}
                                        disabled={loading}
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{message}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg shadow-brand-200 transition-all transform hover:-translate-y-0.5 ${loading
                                        ? 'bg-brand-400 cursor-not-allowed'
                                        : 'bg-brand-600 hover:bg-brand-700 hover:shadow-xl'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t('join.form.processing')}
                                        </span>
                                    ) : (
                                        t('join.form.submit')
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-6">
                                    {t('join.form.disclaimer')}
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
