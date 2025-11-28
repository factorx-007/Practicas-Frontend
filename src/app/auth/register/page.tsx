'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import {
  Eye, EyeOff, Loader2, User, Mail, Lock, Building, GraduationCap, Users,
  ArrowRight, ArrowLeft, Sparkles, Check
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
    console.log('Datos del formulario:', data);
    try {
      // Transformar RegisterFormData a RegisterData eliminando confirmPassword
      const registerData = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: data.password,
        rol: data.rol,
        // Campos opcionales según el rol
        ...(data.carrera && { carrera: data.carrera }),
        ...(data.universidad && { universidad: data.universidad }),
        ...(data.nombreEmpresa && { nombreEmpresa: data.nombreEmpresa }),
        ...(data.nombreInstitucion && { nombreInstitucion: data.nombreInstitucion }),
      };

      const result = await registerMutation.mutateAsync(registerData);
      console.log('Resultado del registro:', result);
      // La redirección se hace dentro del hook
    } catch (error) {
      console.error('Error en el registro:', error);
      // Error ya es manejado por el hook, pero puedes agregar lógica adicional si es necesario
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = step === 1
      ? ['email', 'password', 'confirmPassword']
      : ['nombre', 'apellido', 'rol'];

    const isStepValid = await trigger(fieldsToValidate as (keyof RegisterFormData)[]);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left panel - Branding & benefits (visual) */}
          <aside className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md mr-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">ProTalent</h1>
                <p className="text-sm text-gray-600">Conecta con prácticas y empleos técnicos que potencian tu carrera.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">¿Por qué registrarte?</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-1" />
                <span className="font-medium">Matches inteligentes</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-1" />
                <span className="font-medium">Panel de seguimiento</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-1" />
                <span className="font-medium">Notificaciones y feedback</span>
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-sm text-gray-600">¿Ya tienes cuenta?</p>
              <Link href={ROUTES.LOGIN} className="inline-flex items-center mt-2 text-blue-600 font-medium hover:underline">
                Inicia sesión
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </aside>

          {/* Right panel - Form card */}
          <div className="w-full">
            <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
              {/* Header inside card */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-extrabold text-gray-900">Crea tu cuenta</h2>
                <p className="mt-2 text-sm text-gray-600">Regístrate y empieza a conectar con oportunidades relevantes.</p>
              </div>

              {/* Progress Bar (labels above numbers) */}
              <div className="mt-4">
                <div className="flex items-center">
                  {[1, 2, 3].map((i) => (
                    <>
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-xs text-gray-500 mb-2">
                          {i === 1 ? 'Cuenta' : i === 2 ? 'Información' : 'Rol'}
                        </span>
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                            ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
                          `}
                        >
                          {step > i ? <Check className="w-4 h-4" /> : i}
                        </div>
                      </div>

                      {i < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-200'}`}
                        />
                      )}
                    </>
                  ))}
                </div>
              </div>

              <form className="space-y-6 mt-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Account Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Información de cuenta
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configura tus credenciales de acceso
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      autoComplete="email"
                      className={`
                        appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 bg-gray-50 hover:bg-white
                        ${errors.email ? 'border-red-300' : 'border-gray-300'}
                      `}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`
                        appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 bg-gray-50 hover:bg-white
                        ${errors.password ? 'border-red-300' : 'border-gray-300'}
                      `}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`
                        appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 bg-gray-50 hover:bg-white
                        ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}
                      `}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="
                    w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white
                    bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl
                  "
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Información personal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cuéntanos un poco sobre ti
                  </p>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      {...register('nombre')}
                      type="text"
                      autoComplete="given-name"
                      className={`
                        appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 bg-gray-50 hover:bg-white
                        ${errors.nombre ? 'border-red-300' : 'border-gray-300'}
                      `}
                      placeholder="Tu nombre"
                    />
                    {errors.nombre && (
                      <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      {...register('apellido')}
                      type="text"
                      autoComplete="family-name"
                      className={`
                        appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 bg-gray-50 hover:bg-white
                        ${errors.apellido ? 'border-red-300' : 'border-gray-300'}
                      `}
                      placeholder="Tu apellido"
                    />
                    {errors.apellido && (
                      <p className="mt-2 text-sm text-red-600">{errors.apellido.message}</p>
                    )}
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Cómo te describes?
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: USER_ROLES.ESTUDIANTE, label: 'Estudiante', description: 'Busco prácticas y empleos' },
                      { value: USER_ROLES.EMPRESA, label: 'Empresa', description: 'Busco talento joven' },
                      { value: USER_ROLES.INSTITUCION, label: 'Institución', description: 'Conecto estudiantes con empresas' },
                    ].map((role) => (
                      <label
                        key={role.value}
                        className={`
                          relative flex items-center p-4 border-2 rounded-lg cursor-pointer
                          transition-all duration-200 hover:shadow-md
                          ${watch('rol') === role.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <input
                          {...register('rol')}
                          type="radio"
                          value={role.value}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <div className={`
                            w-12 h-12 rounded-lg flex items-center justify-center mr-4
                            ${watch('rol') === role.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}
                          `}>
                            {getRoleIcon(role.value)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {role.label}
                            </div>
                            <div className="text-sm text-gray-500">
                              {role.description}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.rol && (
                    <p className="mt-2 text-sm text-red-600">{errors.rol.message}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="
                      flex-1 flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700
                      bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      transition-all duration-200
                    "
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="
                      flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white
                      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl
                    "
                  >
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Role-specific Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Información adicional
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getRoleDescription(selectedRole)}
                  </p>
                </div>

                {/* Company Name Field */}
                {selectedRole === USER_ROLES.EMPRESA && (
                  <div>
                    <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la empresa *
                    </label>
                    <input
                      {...register('nombreEmpresa')}
                      type="text"
                      className={`
                        appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 bg-gray-50 hover:bg-white
                        ${errors.nombreEmpresa ? 'border-red-300' : 'border-gray-300'}
                      `}
                      placeholder="Nombre de tu empresa"
                    />
                    {errors.nombreEmpresa && (
                      <p className="mt-2 text-sm text-red-600">{errors.nombreEmpresa.message}</p>
                    )}
                  </div>
                )}

                {/* Institution Name Field */}
                {selectedRole === USER_ROLES.INSTITUCION && (
                  <div>
                    <label htmlFor="nombreInstitucion" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la institución *
                    </label>
                    <input
                      {...register('nombreInstitucion')}
                      type="text"
                      className={`
                        appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-200 bg-gray-50 hover:bg-white
                        ${errors.nombreInstitucion ? 'border-red-300' : 'border-gray-300'}
                      `}
                      placeholder="Nombre de tu institución"
                    />
                    {errors.nombreInstitucion && (
                      <p className="mt-2 text-sm text-red-600">{errors.nombreInstitucion.message}</p>
                    )}
                  </div>
                )}

                {/* University and Career Fields for Students */}
                {selectedRole === USER_ROLES.ESTUDIANTE && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="universidad" className="block text-sm font-medium text-gray-700 mb-2">
                        Universidad (opcional)
                      </label>
                      <input
                        {...register('universidad')}
                        type="text"
                        className="
                          appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          transition-all duration-200 bg-gray-50 hover:bg-white
                        "
                        placeholder="Tu universidad"
                      />
                    </div>
                    <div>
                      <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-2">
                        Carrera (opcional)
                      </label>
                      <input
                        {...register('carrera')}
                        type="text"
                        className="
                          appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          transition-all duration-200 bg-gray-50 hover:bg-white
                        "
                        placeholder="Tu carrera"
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="
                      flex-1 flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700
                      bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      transition-all duration-200
                    "
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || registerMutation.isPending}
                    className="
                      flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white
                      bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl
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
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>

    {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Al registrarte, aceptas nuestros{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-500">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}