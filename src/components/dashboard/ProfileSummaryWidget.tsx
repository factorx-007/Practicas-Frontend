'use client';

import { useProfile } from '@/hooks/useProfile';
import { StudentProfile } from '@/types/user';
import { Briefcase, GraduationCap, Code, Languages, FolderGit2, Award, Plus, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface ProfileSummaryWidgetProps {
    className?: string;
}

export default function ProfileSummaryWidget({ className = "" }: ProfileSummaryWidgetProps) {
    const { data: profile, isLoading } = useProfile();

    if (isLoading) {
        return (
            <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-8"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Verificamos si es estudiante buscando el rol en diferentes ubicaciones posibles
    // o si tiene la propiedad 'carrera' que es única del perfil de estudiante
    const isStudent = (profile as unknown as { rol?: string })?.rol === 'ESTUDIANTE' ||
        (profile as unknown as { usuario?: { rol?: string } })?.usuario?.rol === 'ESTUDIANTE' ||
        (profile as unknown as { tipo?: string })?.tipo === 'ESTUDIANTE' ||
        'carrera' in (profile || {});

    if (!profile || !isStudent) return null;

    const student = ('carrera' in profile ? profile : null) as StudentProfile | null;

    const items = [
        {
            label: 'Carrera',
            value: student?.carrera,
            icon: BookOpen,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
        {
            label: 'Experiencia',
            count: student?.experiencias?.length || 0,
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Educación',
            count: student?.educacion?.length || 0,
            icon: GraduationCap,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Habilidades',
            count: student?.habilidadesNuevas?.length || 0,
            icon: Code,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        {
            label: 'Idiomas',
            count: student?.idiomas?.length || 0,
            icon: Languages,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            label: 'Proyectos',
            count: student?.proyectos?.length || 0,
            icon: FolderGit2,
            color: 'text-pink-600',
            bg: 'bg-pink-50'
        },
        {
            label: 'Certificaciones',
            count: student?.certificaciones?.length || 0,
            icon: Award,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        }
    ];

    return (
        <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tu Perfil</h3>
                <Link
                    href="/dashboard/profile"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Editar
                </Link>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                        </div>
                        {item.value ? (
                            <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]" title={item.value}>
                                {item.value}
                            </span>
                        ) : (
                            <span className={`text-sm font-bold ${item.count && item.count > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                {item.count || 0}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
