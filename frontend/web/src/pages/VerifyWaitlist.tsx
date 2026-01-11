import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VerifyWaitlist = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const verify = async () => {
            try {
                // Use VITE_API_URL or fallback. Since we are in docker, it might be localhost/api
                const apiUrl = import.meta.env.VITE_API_URL || 'https://api.glowmate.tech';
                const res = await fetch(`${apiUrl}/v1/waitlist/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                if (res.ok) {
                    setStatus('success');
                } else {
                    const data = await res.json().catch(() => ({ message: res.statusText }));
                    setErrorMessage(data.message || 'Verification failed');
                    setStatus('error');
                }
            } catch (err: any) {
                setErrorMessage(err.message || 'Network error');
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-6">
                    <span className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                        {t('navbar.brand')}
                    </span>
                </Link>
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 text-center">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center">
                            <Loader className="h-12 w-12 text-brand-600 animate-spin mb-4" />
                            <h2 className="text-xl font-medium text-gray-900">Verifying...</h2>
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="flex flex-col items-center">
                            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verified!</h2>
                            <p className="text-gray-600 mb-6">Your spot on the waitlist is now secured.</p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200"
                            >
                                Back to Home <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="flex flex-col items-center">
                            <XCircle className="h-16 w-16 text-red-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                            <p className="text-gray-600 mb-6">{errorMessage || "The link might be invalid or expired."}</p>
                            <Link
                                to="/"
                                className="text-brand-600 hover:text-brand-500 font-medium"
                            >
                                Return Home
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
