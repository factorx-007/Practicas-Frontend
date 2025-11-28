'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalTextarea from '@/components/ui/MinimalTextarea';
import MinimalButton from '@/components/ui/MinimalButton';
import { CompanyProfile, UserProfile } from '@/types/user';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Zap, Users, Star, Shield, Heart, Coffee, Target, Award, Briefcase } from 'lucide-react';

interface CompanyCultureModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProfile: (UserProfile & { empresa?: CompanyProfile }) | CompanyProfile | null;
    onSaveSuccess: () => void;
}

const valorSchema = z.object({
    title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    icon: z.string(),
});

const companyCultureSchema = z.object({
    mision: z.string().optional().nullable(),
    vision: z.string().optional().nullable(),
    cultura_descripcion: z.string().optional().nullable(),
    tamanio: z.string().optional(),
    tipo: z.string().optional(),
    valores: z.array(valorSchema).optional(),
});

type CompanyCultureFormData = z.infer<typeof companyCultureSchema>;

export default function CompanyCultureModal({
    isOpen,
    onClose,
    currentProfile,
    onSaveSuccess,
}: CompanyCultureModalProps) {
    const [loading, setLoading] = useState(false);
    const [valores, setValores] = useState<Array<{ title: string; description: string; icon: string }>>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CompanyCultureFormData>({
        resolver: zodResolver(companyCultureSchema),
        defaultValues: {
            mision: '',
            vision: '',
            cultura_descripcion: '',
            tamanio: 'PEQUEÑA',
            tipo: 'STARTUP',
            valores: [],
        },
    });

    useEffect(() => {
        if (isOpen && currentProfile) {
            const company = 'empresa' in currentProfile ? (currentProfile as unknown as Record<string, unknown>).empresa : currentProfile;
            const perfilEmpresa = (company as unknown as Record<string, unknown>)?.perfilEmpresa as Record<string, unknown> || {};
            const mision = String(perfilEmpresa?.mision || (company as unknown as Record<string, unknown>)?.mision || '');
            const vision = String(perfilEmpresa?.vision || (company as unknown as Record<string, unknown>)?.vision || '');
            const cultura_descripcion = String(perfilEmpresa?.cultura_descripcion || (company as unknown as Record<string, unknown>)?.cultura_descripcion || '');
            const tamanio = String(perfilEmpresa?.tamanio || '');
            const tipo = String(perfilEmpresa?.tipo || '');
            const valoresData = (Array.isArray(perfilEmpresa?.valores) ? perfilEmpresa.valores : []) as { title: string; description: string; icon: string }[];

            setValores(Array.isArray(valoresData) ? valoresData : []);

            reset({
                mision,
                vision,
                cultura_descripcion,
                tamanio,
                tipo,
                valores: valoresData,
            });
        } else if (!isOpen) {
            reset();
            setValores([]);
        }
    }, [isOpen, currentProfile, reset]);

    const onSubmit = async (data: CompanyCultureFormData) => {
        setLoading(true);
        try {
            // Construct the payload matching the backend structure
            const payload = {
                perfilEmpresa: {
                    upsert: {
                        create: {
                            mision: data.mision || null,
                            vision: data.vision || null,
                            cultura_descripcion: data.cultura_descripcion || null,
                            tamanio: (data.tamanio as string) || 'PEQUEÑA',
                            tipo: (data.tipo as string) || 'STARTUP',
                            valores: valores,
                            galeria: [],
                        },
                        update: {
                            mision: data.mision || null,
                            vision: data.vision || null,
                            cultura_descripcion: data.cultura_descripcion || null,
                            tamanio: (data.tamanio as string) || 'PEQUEÑA',
                            tipo: (data.tipo as string) || 'STARTUP',
                            valores: valores,
                        },
                    },
                },
            };

            await UsersService.updateCompanyProfile(payload);
            toast.success('Cultura empresarial actualizada exitosamente');
            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error('Error al actualizar la cultura empresarial:', error);
            toast.error('Error al actualizar la cultura empresarial');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setValores([]);
        onClose();
    };

    const iconOptions = [
        { value: 'Zap', label: 'Innovación', Icon: Zap },
        { value: 'Users', label: 'Trabajo en Equipo', Icon: Users },
        { value: 'Star', label: 'Excelencia', Icon: Star },
        { value: 'Shield', label: 'Integridad', Icon: Shield },
        { value: 'Heart', label: 'Pasión', Icon: Heart },
        { value: 'Coffee', label: 'Colaboración', Icon: Coffee },
        { value: 'Target', label: 'Enfoque', Icon: Target },
        { value: 'Award', label: 'Reconocimiento', Icon: Award },
        { value: 'Briefcase', label: 'Profesionalismo', Icon: Briefcase },
    ];

    const addValor = () => {
        setValores([...valores, { title: '', description: '', icon: 'Star' }]);
    };

    const removeValor = (index: number) => {
        setValores(valores.filter((_, i) => i !== index));
    };

    const updateValor = (index: number, field: 'title' | 'description' | 'icon', value: string) => {
        const newValores = [...valores];
        newValores[index][field] = value;
        setValores(newValores);
    };

    return (
        <MinimalModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Editar Cultura Empresarial"
            size="lg"
            footer={
                <>
                    <MinimalButton variant="ghost" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </MinimalButton>
                    <MinimalButton onClick={handleSubmit(onSubmit)} loading={loading}>
                        Guardar Cambios
                    </MinimalButton>
                </>
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tamaño de Empresa
                        </label>
                        <select
                            {...register('tamanio')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="MICRO">Micro</option>
                            <option value="PEQUEÑA">Pequeña</option>
                            <option value="MEDIANA">Mediana</option>
                            <option value="GRANDE">Grande</option>
                            <option value="CORPORACION">Corporación</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Empresa
                        </label>
                        <select
                            {...register('tipo')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="STARTUP">Startup</option>
                            <option value="PYME">PYME</option>
                            <option value="CORPORACION">Corporación</option>
                            <option value="MULTINACIONAL">Multinacional</option>
                            <option value="ONG">ONG</option>
                            <option value="GOBIERNO">Gobierno</option>
                            <option value="CONSULTORA">Consultora</option>
                        </select>
                    </div>
                </div>

                <MinimalTextarea
                    label="Misión"
                    {...register('mision')}
                    error={errors.mision?.message}
                    placeholder="¿Cuál es el propósito fundamental de tu empresa?"
                    rows={3}
                />
                <MinimalTextarea
                    label="Visión"
                    {...register('vision')}
                    error={errors.vision?.message}
                    placeholder="¿Hacia dónde se dirige tu empresa en el futuro?"
                    rows={3}
                />
                <MinimalTextarea
                    label="Descripción de la Cultura"
                    {...register('cultura_descripcion')}
                    error={errors.cultura_descripcion?.message}
                    placeholder="Describe el ambiente de trabajo, valores y lo que hace única a tu empresa..."
                    rows={4}
                />

                {/* Valores Corporativos */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Valores Corporativos
                        </label>
                        <button
                            type="button"
                            onClick={addValor}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar Valor
                        </button>
                    </div>

                    {valores.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No hay valores definidos. Haz clic en &quot;Agregar Valor&quot; para comenzar.</p>
                    ) : (
                        <div className="space-y-3">
                            {valores.map((valor, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    value={valor.title}
                                                    onChange={(e) => updateValor(index, 'title', e.target.value)}
                                                    placeholder="Ej: Innovación"
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Icono
                                                </label>
                                                <select
                                                    value={valor.icon}
                                                    onChange={(e) => updateValor(index, 'icon', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {iconOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeValor(index)}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={valor.description}
                                            onChange={(e) => updateValor(index, 'description', e.target.value)}
                                            placeholder="Describe este valor..."
                                            rows={2}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                        Nota: La gestión de Beneficios y Galería estará disponible próximamente.
                    </p>
                </div>
            </form>
        </MinimalModal>
    );
}
