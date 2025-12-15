import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { offersService } from '@/services/offers.service'; // Importar OffersService como clase
import { Offer, OfferModalidad } from '@/types/offers.types';
// Removed unused date-fns imports
import Image from 'next/image';
import Link from 'next/link';

const JobOffersList: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const response = await offersService.searchOffers({
        limit: 3
      }); // Corregido: Llamar al método estático

      if (response.success && response.data) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading job offers:', error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const getModalidadColor = (modalidad: OfferModalidad) => {
    switch (modalidad) {
      case OfferModalidad.REMOTO:
        return 'bg-blue-100 text-blue-700';
      case OfferModalidad.PRESENCIAL:
        return 'bg-green-100 text-green-700';
      case OfferModalidad.HIBRIDO:
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Briefcase className="w-5 h-5 text-purple-500 mr-2" />
        <h3 className="font-semibold text-gray-800 text-sm">Ofertas de Trabajo</h3>
      </div>
      <AnimatePresence>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-purple-500 mr-2" />
            <span className="text-gray-500 text-sm">Cargando...</span>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-4">
            <Briefcase className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 text-sm">No hay ofertas disponibles</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer: Offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer border border-gray-100"
              >
                <Link href={`/dashboard/offers/${offer.id}`} className="block">
                  <div className="flex items-center gap-2 mb-2">
                    {offer.empresa?.usuario?.avatar ? (
                      <Image
                        src={offer.empresa.usuario.avatar}
                        alt={offer.empresa.nombre_empresa}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-xs">
                        {offer.empresa.nombre_empresa.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {offer.titulo}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {offer.empresa.nombre_empresa}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                    {offer.descripcion}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {offer.ubicacion}
                    </div>
                    <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 h-4 ${getModalidadColor(offer.modalidad)}`}>
                      {offer.modalidad}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobOffersList;