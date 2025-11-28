'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  Filter, 
  Plus, 
  Eye 
} from 'lucide-react';
import { adminService, type OfferFilterParams } from '@/services/admin';
import { toast } from 'sonner';
import { Offer } from '@/types/admin';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters] = useState<OfferFilterParams>({
    estado: undefined,
    empresa: ''
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Llamada al servicio con los filtros actuales
        const response = await adminService.listOffers(filters);
        
        // Verificar la estructura de la respuesta
        console.log('Respuesta de listOffers:', response);
        
        // Establecer las ofertas de la respuesta
        // La respuesta es un objeto con la propiedad 'data' que contiene el array de ofertas
        setOffers(response?.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
        toast.error('Error al cargar ofertas');
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [filters]);

  const handleEditOffer = async (offerId: string) => {
    try {
      // Obtener detalles de la oferta
      const offerDetails = await adminService.getOfferDetails(offerId);
      
      // Aquí podrías abrir un modal de edición o navegar a una página de edición
      console.log('Detalles de la oferta para editar:', offerDetails);
      toast.info(`Editar oferta ${offerId}`);
    } catch (error) {
      console.error('Error al obtener detalles de la oferta:', error);
      toast.error('No se pudieron obtener los detalles de la oferta');
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      // Confirmar eliminación
      const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta oferta?');
      
      if (confirmDelete) {
        await adminService.deleteOffer(offerId);
        
        // Actualizar lista de ofertas después de eliminar
        const updatedOffers = offers.filter(offer => offer.id !== offerId);
        setOffers(updatedOffers);
        
        toast.success('Oferta eliminada exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      toast.error('No se pudo eliminar la oferta');
    }
  };

  const handleViewOffer = async (offerId: string) => {
    try {
      // Obtener detalles completos de la oferta
      const offerDetails = await adminService.getOfferDetails(offerId);
      
      // Aquí podrías abrir un modal o navegar a una página de detalles
      console.log('Detalles completos de la oferta:', offerDetails);
      toast.info(`Ver detalles de oferta ${offerId}`);
    } catch (error) {
      console.error('Error al obtener detalles de la oferta:', error);
      toast.error('No se pudieron obtener los detalles de la oferta');
    }
  };

  const handleCreateOffer = async () => {
    try {
      // Aquí podrías abrir un modal o navegar a un formulario de creación de oferta
      toast.info('Funcionalidad de crear oferta próximamente');
    } catch (error) {
      console.error('Error al crear oferta:', error);
      toast.error('No se pudo crear la oferta');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Ofertas</h1>
        <Button onClick={handleCreateOffer}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Oferta
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Ofertas</CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Cargando ofertas...
                  </TableCell>
                </TableRow>
              ) : (
                offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>{offer.id}</TableCell>
                    <TableCell>{offer.titulo}</TableCell>
                    <TableCell>{offer.empresa.nombre}</TableCell>
                    <TableCell>
                      <span 
                        className={`
                          px-2 py-1 rounded-full text-xs 
                          ${offer.estado === 'APROBADA' 
                            ? 'bg-green-100 text-green-800' 
                            : offer.estado === 'PENDIENTE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'}
                        `}
                      >
                        {offer.estado}
                      </span>
                    </TableCell>
                    <TableCell>{offer.ubicacion}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewOffer(offer.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditOffer(offer.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteOffer(offer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
