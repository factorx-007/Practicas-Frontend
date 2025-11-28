'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OffersService } from '@/services/offers.service'; // Importar OffersService como clase y offersService como instancia
import { OfferWithDetails } from '@/types/offers.types';
import { toast } from 'sonner';
import { Loader2, Building, MapPin, DollarSign, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  const [offer, setOffer] = useState<OfferWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId) return;
      setIsLoading(true);
      try {
        const response = await OffersService.getOfferById(offerId); // Corregido: Llamada estática
        if (response.success && response.data) {
          setOffer(response.data);
        } else {
          toast.error('Oferta no encontrada');
          router.push('/dashboard/blog'); // Redirigir si la oferta no existe
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
        toast.error('Error al cargar la oferta');
        router.push('/dashboard/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [offerId, router]);

  const getModalidadColor = (modalidad: string) => {
    switch (modalidad) {
      case 'REMOTO': return 'bg-blue-100 text-blue-700';
      case 'PRESENCIAL': return 'bg-green-100 text-green-700';
      case 'HIBRIDO': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      toast.success('¡Te has postulado a esta oferta exitosamente!');
    } catch (error) {
      console.error('Error applying to offer:', error);
      toast.error('Error al postularse a la oferta');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-700">Cargando detalles de la oferta...</span>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Oferta no encontrada</h2>
        <p className="text-gray-500">La oferta de trabajo que buscas no está disponible.</p>
        <Button onClick={() => router.push('/dashboard/blog')} className="mt-4">Volver al Blog</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {offer.empresa?.usuario?.avatar ? (
              <Image
                src={offer.empresa.usuario.avatar}
                alt={offer.empresa.nombre_empresa}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-2xl border-2 border-gray-100">
                {offer.empresa.nombre_empresa.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-1">
                {offer.titulo}
              </h1>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{offer.empresa.nombre_empresa}</span>
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                  {offer.empresa.rubro} {/* Asumiendo que rubro existe en empresa */}
                </Badge>
              </p>
            </div>
          </div>
          <Button onClick={() => router.back()} variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Button>
        </div>

        {/* Detalles de la oferta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 mb-8">
          <p className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Ubicación:</span> {offer.ubicacion}
          </p>
          <p className="flex items-center gap-2">
            <Badge variant="secondary" className={`text-sm ${getModalidadColor(offer.modalidad)}`}>
              {offer.modalidad}
            </Badge>
          </p>
          <p className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Salario:</span> 
            {offer.salario_min || offer.salario_max ? (
              `$${offer.salario_min?.toLocaleString() || ''} - $${offer.salario_max?.toLocaleString() || ''}`
            ) : (
              'No especificado'
            )}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="font-semibold">Experiencia:</span> {offer.experiencia_minima || 'No especificada'}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="font-semibold">Fecha Límite:</span> 
            {format(new Date(offer.fecha_limite), 'dd MMMM yyyy', { locale: es })}
          </p>
        </div>

        {/* Descripción */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Descripción de la Oferta</h3>
        <p className="text-gray-700 leading-relaxed mb-8">
          {offer.descripcion}
        </p>

        {/* Requisitos y responsabilidades */}
        {((offer.requisitos && offer.requisitos.length > 0) || (offer.responsabilidades && offer.responsabilidades.length > 0)) && (
          <div className="mb-8">
            {offer.requisitos && offer.requisitos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Requisitos</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                  {offer.requisitos.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {offer.responsabilidades && offer.responsabilidades.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Responsabilidades</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                  {offer.responsabilidades.map((resp: string, index: number) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Botón de postulación */}
        <div className="text-center mt-8">
          <Button 
            onClick={handleApply} 
            disabled={isApplying} 
            className="w-full md:w-auto px-8 py-3 text-lg font-semibold"
          >
            {isApplying ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Postulando...</>
            ) : (
              'Postular a la Oferta'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
