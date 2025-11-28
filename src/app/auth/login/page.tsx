'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ email, password });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen flex bg-[#231F20] text-white overflow-hidden relative selection:bg-[#00AEFF]/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#005290]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00AEFF]/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-[#231F20]/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl"
        >
          {/* Logo and Header */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-6 group relative w-40 h-12">
              <Image
                src="/Logo2.png"
                alt="ProTalent Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
            <p className="text-slate-400">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-[#00AEFF] transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-[#231F20]/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#00AEFF] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-[#231F20]/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-500 hover:text-slate-300 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#00AEFF] focus:ring-[#00AEFF] border-slate-700 rounded bg-[#231F20]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                  Recordarme
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-[#00AEFF] hover:text-[#00AEFF]/80 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00AEFF] to-[#005290] text-white py-3 px-4 rounded-xl font-bold hover:from-[#00AEFF]/90 hover:to-[#005290]/90 focus:outline-none focus:ring-2 focus:ring-[#00AEFF] focus:ring-offset-2 focus:ring-offset-[#231F20] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00AEFF]/20 hover:shadow-[#00AEFF]/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#231F20] text-slate-500">O continúa con</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white text-[#231F20] py-3 px-4 rounded-xl font-bold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#231F20] transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-400">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="font-bold text-[#00AEFF] hover:text-[#00AEFF]/80 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding/Image */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#005290]/40 via-[#231F20]/40 to-[#231F20]/90 z-10" />
        {/* You can add a background image here if available */}
        {/* <Image src="/path/to/image.jpg" alt="Background" fill className="object-cover opacity-50" /> */}

        <div className="relative z-20 max-w-lg text-white space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Conecta con el <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEFF] to-[#005290]">
                Futuro Profesional
              </span>
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              ProTalent une a los mejores estudiantes con empresas líderes.
              Gestiona tu carrera con herramientas de vanguardia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 gap-6 pt-8"
          >
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#00AEFF] mb-1">100%</div>
              <div className="text-sm text-slate-400">Verificado</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-3xl font-bold text-[#005290] mb-1">24/7</div>
              <div className="text-sm text-slate-400">Soporte</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}