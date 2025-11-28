'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Users, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#231F20] text-white overflow-hidden relative selection:bg-[#00AEFF]/30 font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#005290]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00AEFF]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-[#00AEFF]/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Navbar */}
      <nav className="relative z-50 container mx-auto px-6 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="relative w-40 h-12">
            <Image
              src="/Logo2.png"
              alt="ProTalent Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
            Iniciar Sesión
          </Link>
          <Link
            href="/auth/register"
            className="group relative px-5 py-2.5 bg-white text-[#231F20] text-sm font-bold rounded-full hover:bg-[#00AEFF]/10 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(0,174,255,0.5)] overflow-hidden"
          >
            <span className="relative z-10">Registrarse</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00AEFF] to-[#005290] opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:text-white" />
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-12 md:pt-24 pb-32 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#231F20]/80 border border-slate-800 backdrop-blur-md mb-8 hover:border-[#00AEFF]/50 transition-colors cursor-default"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AEFF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00AEFF]"></span>
          </span>
          <span className="text-xs font-medium text-[#00AEFF] tracking-wide uppercase">La plataforma #1 de gestión de talento</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1]"
        >
          El Futuro del <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEFF] via-[#005290] to-[#00AEFF] animate-gradient-x">
            Talento Profesional
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Conectamos a los estudiantes más brillantes con las empresas más innovadoras.
          Gestiona prácticas, convenios y oportunidades laborales con tecnología de punta.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
        >
          <Link href="/auth/register" className="w-full sm:w-auto group relative px-8 py-4 bg-gradient-to-r from-[#00AEFF] to-[#005290] rounded-full font-bold text-white shadow-lg shadow-[#00AEFF]/25 hover:shadow-[#00AEFF]/40 transition-all hover:scale-105 active:scale-95 overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center gap-2">
              Comenzar Ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link href="/auth/login" className="w-full sm:w-auto group px-8 py-4 bg-[#231F20]/50 border border-slate-700/50 rounded-full font-bold text-slate-300 hover:text-white hover:border-[#00AEFF] hover:bg-[#231F20] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm">
            <Users className="w-5 h-5" />
            Iniciar Sesión
          </Link>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-32 w-full max-w-6xl border-t border-slate-800 pt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              { title: "IA Avanzada", desc: "Matching inteligente entre perfiles y ofertas." },
              { title: "Seguimiento Real", desc: "Monitorea el estado de tus postulaciones." },
              { title: "Verificación", desc: "Empresas y estudiantes 100% verificados." },
              { title: "Networking", desc: "Conecta con mentores y profesionales." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-[#00AEFF] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white text-lg">{item.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}