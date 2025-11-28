'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simular llamada a API
            // await api.post('/auth/forgot-password', { email });
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitted(true);
            toast.success('Se ha enviado un correo de recuperación');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al enviar el correo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo and Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4">
                            <span className="text-2xl font-bold text-white">PT</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h1>
                        <p className="mt-2 text-gray-600">
                            {!isSubmitted
                                ? 'Ingresa tu correo electrónico para recibir instrucciones'
                                : 'Revisa tu bandeja de entrada'}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar Instrucciones</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-8 space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm">
                                Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                                Por favor revisa tu correo (y la carpeta de spam si es necesario).
                            </div>

                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                            >
                                Intentar con otro correo
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 items-center justify-center p-12">
                <div className="max-w-md text-white space-y-6">
                    <h2 className="text-4xl font-bold">
                        Recupera el acceso a tu cuenta
                    </h2>
                    <p className="text-lg text-blue-100">
                        No te preocupes, es seguro y rápido. Te ayudaremos a volver a conectar con las mejores oportunidades.
                    </p>
                </div>
            </div>
        </div>
    );
}
