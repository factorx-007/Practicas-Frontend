'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    MapPin,
    Briefcase,
    Clock,
    GraduationCap,
    Building,
    ArrowLeft,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import EnhancedApplicationForm from '@/components/offers/EnhancedApplicationForm';
import { OfferQuestion } from '@/types/offers.types';

interface OfferDetail {
    id: string;
    titulo: string;
    descripcion: string;
    ubicacion: string;
    modalidad: string;
    tipoEmpleo: string;
    nivelEducacion: string;
    experiencia: string;
    fecha_limite?: string;
    createdAt: string;
    empresa: {
        id: string;
        nombre_empresa: string;
        logo_url?: string;
        descripcion?: string;
        ubicacion?: string;
    };
    requisitos?: string[];
    beneficios?: string[];
    salario?: {
        min: number;
        max: number;
        moneda: string;
    };
    preguntas?: OfferQuestion[];
    requiereCV: boolean;
    requiereCarta: boolean;
}

export default function OfferDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [offer, setOffer] = useState<OfferDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    useEffect(() => {
        const fetchOffer = async () => {
            if (!params?.id) return;

            try {
                setIsLoading(true);
                const response = await api.get(API_ENDPOINTS.OFFERS.GET_BY_ID(params.id as string));

                if (response.success) {
                    setOffer(response.data as OfferDetail);
                } else {
                    toast.error('No se pudo cargar la oferta');
                    router.push('/dashboard/estudiante/offers');
                }
            } catch (error) {
                console.error('Error fetching offer:', error);
                toast.error('Error al cargar la oferta');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffer();
    }, [params?.id, router]);

    interface ApplicationFormData {
        mensajePresentacion: string;
        disponibilidad: string;
        cvUrl?: string;
        portfolioUrl?: string;
        motivacion?: string;
        respuestasPersonalizadas?: { preguntaId: string; respuesta: string }[];
    }

    const handleApply = async (data: unknown) => {
        if (!offer) return;

        const formData = data as ApplicationFormData;

        try {
            const payload = {
                mensaje: formData.mensajePresentacion,
                disponibilidad: formData.disponibilidad,
                ...(formData.cvUrl && { cvUrl: formData.cvUrl }),
                ...(formData.portfolioUrl && { portfolioUrl: formData.portfolioUrl }),
                ...(formData.motivacion && { motivacion: formData.motivacion }),
                ...(formData.respuestasPersonalizadas && { respuestas: formData.respuestasPersonalizadas })
            };

            const response = await api.post(`${API_ENDPOINTS.OFFERS.BASE}/${offer.id}/apply`, payload);

            if (response.success) {
                toast.success('¡Postulación enviada con éxito!');
                setShowApplicationForm(false);
                router.push('/dashboard/estudiante/applications');
            } else {
                toast.error(response.message || 'Error al enviar la postulación');
            }
        } catch (error) {
            console.error('Error applying:', error);
            toast.error('Error al enviar la postulación');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!offer) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Botón Volver */}
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Encabezado */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                    {offer.titulo}
                                </h1>
                                <div className="flex items-center text-gray-600 font-medium">
                                    <Building className="w-5 h-5 mr-2 text-gray-400" />
                                    {offer.empresa.nombre_empresa}
                                </div>
                            </div>
                            {offer.empresa.logo_url && (
                                <Image
                                    src={offer.empresa.logo_url}
                                    alt={offer.empresa.nombre_empresa}
                                    width={64}
                                    height={64}
                                    className="rounded-lg object-cover border border-gray-100"
                                    unoptimized
                                />
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                <MapPin className="w-4 h-4 mr-1.5" />
                                {offer.ubicacion}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700">
                                <Briefcase className="w-4 h-4 mr-1.5" />
                                {offer.modalidad}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                                <Clock className="w-4 h-4 mr-1.5" />
                                {offer.tipoEmpleo}
                            </span>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción del Puesto</h2>
                        <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line">
                            {offer.descripcion}
                        </div>
                    </div>

                    {/* Requisitos (si existen en la descripción o campo separado) */}
                    {/* Aquí asumimos que están en la descripción por ahora, o podríamos parsearlos si el backend los separa */}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Tarjeta de Acción */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles de la Oferta</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start">
                                <GraduationCap className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Nivel de Educación</p>
                                    <p className="text-sm font-medium text-gray-900">{offer.nivelEducacion}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Briefcase className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Experiencia</p>
                                    <p className="text-sm font-medium text-gray-900">{offer.experiencia}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Publicado</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {format(new Date(offer.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowApplicationForm(true)}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center"
                        >
                            Postularme Ahora
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Postulación */}
            {showApplicationForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-3xl my-8 relative">
                        <button
                            onClick={() => setShowApplicationForm(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <AlertCircle className="w-6 h-6" />
                        </button>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Postular a {offer.titulo}</h2>
                            <EnhancedApplicationForm
                                offer={{
                                    id: offer.id,
                                    titulo: offer.titulo,
                                    descripcion: offer.descripcion,
                                    requiereCV: offer.requiereCV,
                                    requiereCarta: offer.requiereCarta,
                                    preguntas: offer.preguntas?.map((q: OfferQuestion) => ({
                                        id: q.id,
                                        pregunta: q.pregunta,
                                        tipo: q.tipo,
                                        obligatoria: q.obligatoria,
                                        opciones: q.opciones
                                    }))
                                }}
                                onSubmit={handleApply}
                                onCancel={() => setShowApplicationForm(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
