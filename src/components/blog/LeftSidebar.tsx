'use client';

import { useAuthStore } from '@/store/authStore';
import { User, MapPin, Briefcase, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LeftSidebar() {
    const user = useAuthStore(state => state.user);

    if (!user) return null;

    return (
        <div className="space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-400 relative">
                    {/* Cover Image Placeholder */}
                </div>
                <div className="px-4 pb-4 relative">
                    <div className="relative -top-10 mb-[-30px] flex justify-center">
                        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={user.nombre || 'User'}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <User className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <h3 className="font-bold text-lg text-gray-900">
                            {user.nombre} {user.apellido}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {user.rol === 'EMPRESA' ? 'Empresa' : 'Estudiante'}
                            {/* Add more role specific info here if available */}
                        </p>

                        <div className="border-t border-gray-100 pt-4 text-left space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Perfil visto</span>
                                <span className="font-semibold text-blue-600">124</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Conexiones</span>
                                <span className="font-semibold text-blue-600">45</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu / Shortcuts */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-2">
                <Link href="/dashboard/saved" className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
                    <Bookmark className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-sm">Guardados</span>
                </Link>
                <Link href="/dashboard/groups" className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-sm">Grupos</span>
                </Link>
                <Link href="/dashboard/events" className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-sm">Eventos</span>
                </Link>
            </div>
        </div>
    );
}
