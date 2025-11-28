'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';
import Image from 'next/image';
import {
  Eye, EyeOff, Loader2, User, Mail, Lock, Building, GraduationCap, Users,
  ArrowRight, ArrowLeft, Check, CheckCircle2
} from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { useRegister } from '@/hooks/useAuth';
import { ROUTES, USER_ROLES } from '@/constants';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const selectedRole = watch('rol');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        rol: data.rol,
        ...(data.carrera && { carrera: data.carrera }),
        ...(data.universidad && { universidad: data.universidad }),
        ...(data.nombreEmpresa && { nombreEmpresa: data.nombreEmpresa }),
        ...(data.nombreInstitucion && { nombreInstitucion: data.nombreInstitucion }),
      };

      await registerMutation.mutateAsync(registerData);
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ['email', 'password', 'confirmPassword'];
    } else if (step === 2) {
      fieldsToValidate = ['nombre', 'apellido', 'rol'];
    } else if (step === 3) {
      if (selectedRole === USER_ROLES.EMPRESA) {
        fieldsToValidate = ['nombreEmpresa'];
      } else if (selectedRole === USER_ROLES.INSTITUCION) {
        fieldsToValidate = ['nombreInstitucion'];
      }
      // Students don't have required fields in step 3
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case USER_ROLES.ESTUDIANTE:
        return <GraduationCap className="w-6 h-6" />;
      case USER_ROLES.EMPRESA:
        return <Building className="w-6 h-6" />;
      case USER_ROLES.INSTITUCION:
        return <Users className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case USER_ROLES.ESTUDIANTE:
        return 'Encuentra prácticas y empleos que se adapten a tu perfil académico';
      case USER_ROLES.EMPRESA:
        return 'Publica ofertas de trabajo y encuentra el talento que necesitas';
      case USER_ROLES.INSTITUCION:
        return 'Conecta a tus estudiantes con oportunidades laborales';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#231F20] text-white overflow-hidden relative selection:bg-[#00AEFF]/30 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#005290]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00AEFF]/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left panel - Branding & benefits */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col justify-center p-10 bg-[#231F20]/50 rounded-3xl border border-slate-800 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00AEFF]/5 to-[#005290]/5" />

            <div className="relative z-10">
              <Link href="/" className="inline-block mb-8 group relative w-40 h-12">
                <Image
                  src="/Logo2.png"
                  alt="ProTalent Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </Link>

              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                Únete a la comunidad del <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEFF] to-[#005290]">
                  Futuro Tecnológico
                </span>
              </h2>

              <div className="space-y-6">
                {[
                  { title: "Matches Inteligentes", desc: "Algoritmos que conectan tu perfil con la oportunidad ideal." },
                  { title: "Seguimiento en Tiempo Real", desc: "Monitorea el estado de tus postulaciones al instante." },
                  { title: "Comunidad Verificada", desc: "Interactúa solo con empresas y talentos validados." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="mt-1 w-8 h-8 rounded-full bg-[#00AEFF]/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#00AEFF]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{item.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-800">
                <p className="text-slate-400">¿Ya tienes cuenta?</p>
                <Link href={ROUTES.LOGIN} className="inline-flex items-center mt-2 text-[#00AEFF] font-bold hover:text-[#00AEFF]/80 transition-colors group">
                  Inicia sesión
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.aside>

          {/* Right panel - Form card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col"
          >
            <div className="bg-[#231F20]/80 backdrop-blur-xl py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-800 flex-1 flex flex-col">

              {/* Header inside card */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">Crea tu cuenta</h2>
                <p className="mt-2 text-sm text-slate-400">Completa los pasos para comenzar</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center bg-[#231F20] px-2">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                          ${step >= i
                            ? 'bg-[#00AEFF] border-[#00AEFF] text-white shadow-[0_0_15px_rgba(0,174,255,0.5)]'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                          }
                        `}
                      >
                        {step > i ? <Check className="w-5 h-5" /> : i}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${step >= i ? 'text-[#00AEFF]' : 'text-slate-600'}`}>
                        {i === 1 ? 'Cuenta' : i === 2 ? 'Datos' : 'Perfil'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <form className="space-y-6 flex-1 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Account Information */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Correo electrónico
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-[#00AEFF] transition-colors" />
                          </div>
                          <input
                            {...register('email')}
                            type="email"
                            className={`
                              block w-full pl-10 pr-3 py-3 bg-[#231F20]/50 border rounded-xl text-white placeholder-slate-600
                              focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700'}
                            `}
                            placeholder="tu@email.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Contraseña
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#00AEFF] transition-colors" />
                          </div>
                          <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            className={`
                              block w-full pl-10 pr-10 py-3 bg-[#231F20]/50 border rounded-xl text-white placeholder-slate-600
                              focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700'}
                            `}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                        )}
                      </div>

                      {/* Confirm Password Field */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Confirmar contraseña
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#00AEFF] transition-colors" />
                          </div>
                          <input
                            {...register('confirmPassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className={`
                              block w-full pl-10 pr-10 py-3 bg-[#231F20]/50 border rounded-xl text-white placeholder-slate-600
                              focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700'}
                            `}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Information */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nombre
                          </label>
                          <input
                            {...register('nombre')}
                            type="text"
                            className={`
                              block w-full px-3 py-3 bg-[#231F20]/50 border rounded-xl text-white placeholder-slate-600
                              focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              ${errors.nombre ? 'border-red-500/50' : 'border-slate-700'}
                            `}
                            placeholder="Tu nombre"
                          />
                          {errors.nombre && (
                            <p className="mt-1 text-sm text-red-400">{errors.nombre.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Apellido
                          </label>
                          <input
                            {...register('apellido')}
                            type="text"
                            className={`
                              block w-full px-3 py-3 bg-[#231F20]/50 border rounded-xl text-white placeholder-slate-600
                              focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              ${errors.apellido ? 'border-red-500/50' : 'border-slate-700'}
                            `}
                            placeholder="Tu apellido"
                          />
                          {errors.apellido && (
                            <p className="mt-1 text-sm text-red-400">{errors.apellido.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Role Selection */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                          ¿Cómo te describes?
                        </label>
                        <div className="space-y-3">
                          {[
                            { value: USER_ROLES.ESTUDIANTE, label: 'Estudiante', description: 'Busco prácticas y empleos' },
                            { value: USER_ROLES.EMPRESA, label: 'Empresa', description: 'Busco talento joven' },
                            { value: USER_ROLES.INSTITUCION, label: 'Institución', description: 'Conecto estudiantes' },
                          ].map((role) => (
                            <label
                              key={role.value}
                              className={`
                                relative flex items-center p-4 border rounded-xl cursor-pointer
                                transition-all duration-200
                                ${watch('rol') === role.value
                                  ? 'border-[#00AEFF] bg-[#00AEFF]/10 shadow-[0_0_15px_rgba(0,174,255,0.1)]'
                                  : 'border-slate-700 bg-[#231F20]/50 hover:border-slate-600 hover:bg-slate-800'
                                }
                              `}
                            >
                              <input
                                {...register('rol')}
                                type="radio"
                                value={role.value}
                                className="sr-only"
                              />
                              <div className="flex items-center w-full">
                                <div className={`
                                  w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors
                                  ${watch('rol') === role.value ? 'bg-[#00AEFF] text-white' : 'bg-slate-800 text-slate-400'}
                                `}>
                                  {getRoleIcon(role.value)}
                                </div>
                                <div>
                                  <div className={`text-sm font-bold ${watch('rol') === role.value ? 'text-white' : 'text-slate-300'}`}>
                                    {role.label}
                                  </div>
                                  <div className="text-sm text-slate-500">
                                    {role.description}
                                  </div>
                                </div>
                                {watch('rol') === role.value && (
                                  <div className="ml-auto">
                                    <CheckCircle2 className="w-6 h-6 text-[#00AEFF]" />
                                  </div>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.rol && (
                          <p className="mt-1 text-sm text-red-400">{errors.rol.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Role-specific Information */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00AEFF]/10 mb-4">
                          {getRoleIcon(selectedRole)}
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          Información adicional
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {getRoleDescription(selectedRole)}
                        </p>
                      </div>

                      {/* Company Name Field */}
                      {selectedRole === USER_ROLES.EMPRESA && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nombre de la empresa *
                          </label>
                          <input
                            {...register('nombreEmpresa')}
                            type="text"
                            className={`
                              block w-full px-3 py-3 bg-[#231F20]/50 border rounded-xl text-white placeholder-slate-600
                              focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              ${errors.nombreEmpresa ? 'border-red-500/50' : 'border-slate-700'}
                            `}
                            placeholder="Nombre de tu empresa"
                          />
                          {errors.nombreEmpresa && (
                            <p className="mt-1 text-sm text-red-400">{errors.nombreEmpresa.message}</p>
                          )}
                        </div>
                      )}

                      {/* Institution Name Field */}
                      {selectedRole === USER_ROLES.INSTITUCION && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nombre de la institución *
                          </label>
                          <input
                            {...register('nombreInstitucion')}
                            type="text"
                            className={`
                              block w-full px-3 py-3 bg-[#231F20]/50 border rounded-xl text-white placeholder-slate-600
                              focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              ${errors.nombreInstitucion ? 'border-red-500/50' : 'border-slate-700'}
                            `}
                            placeholder="Nombre de tu institución"
                          />
                          {errors.nombreInstitucion && (
                            <p className="mt-1 text-sm text-red-400">{errors.nombreInstitucion.message}</p>
                          )}
                        </div>
                      )}

                      {/* University and Career Fields for Students */}
                      {selectedRole === USER_ROLES.ESTUDIANTE && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Universidad (opcional)
                            </label>
                            <input
                              {...register('universidad')}
                              type="text"
                              className="
                                block w-full px-3 py-3 bg-[#231F20]/50 border border-slate-700 rounded-xl text-white placeholder-slate-600
                                focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              "
                              placeholder="Tu universidad"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Carrera (opcional)
                            </label>
                            <input
                              {...register('carrera')}
                              type="text"
                              className="
                                block w-full px-3 py-3 bg-[#231F20]/50 border border-slate-700 rounded-xl text-white placeholder-slate-600
                                focus:ring-2 focus:ring-[#00AEFF]/50 focus:border-[#00AEFF] transition-all outline-none
                              "
                              placeholder="Tu carrera"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex space-x-4 mt-auto pt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="
                        flex-1 flex justify-center items-center py-3 px-4 border border-slate-700 text-sm font-bold rounded-xl text-slate-300
                        bg-slate-900 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500
                        transition-all duration-200
                      "
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Atrás
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="
                        flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white
                        bg-gradient-to-r from-[#00AEFF] to-[#005290] hover:from-[#00AEFF]/90 hover:to-[#005290]/90
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#231F20] focus:ring-[#00AEFF]
                        transform transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-[#00AEFF]/20
                      "
                    >
                      Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || registerMutation.isPending}
                      className="
                        flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white
                        bg-gradient-to-r from-[#00AEFF] to-[#005290] hover:from-[#00AEFF]/90 hover:to-[#005290]/90
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#231F20] focus:ring-[#00AEFF]
                        transform transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-[#00AEFF]/20
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      "
                    >
                      {isSubmitting || registerMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          Crear cuenta
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                Al registrarte, aceptas nuestros{' '}
                <Link href="/terms" className="text-[#00AEFF] hover:text-[#00AEFF]/80 transition-colors">
                  Términos de Servicio
                </Link>{' '}
                y{' '}
                <Link href="/privacy" className="text-[#00AEFF] hover:text-[#00AEFF]/80 transition-colors">
                  Política de Privacidad
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}