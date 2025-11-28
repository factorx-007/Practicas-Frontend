import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse } from '@/types/common';
import { OfferSearchFilters, PaginatedOffersResponse, OfferWithDetails } from '@/types/offers.types';

export class OffersService {
  static async searchOffers(
    filters: OfferSearchFilters = {},
    page: number = 1,
    limit: number = 5 // Limitar para la barra lateral
  ): Promise<ApiResponse<PaginatedOffersResponse>> {
    const searchParams = new URLSearchParams();

    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());

    if (filters.search) searchParams.append('search', filters.search);
    if (filters.modalidad) searchParams.append('modalidad', filters.modalidad);
    if (filters.experiencia) searchParams.append('experiencia', filters.experiencia);
    if (filters.salarioMin) searchParams.append('salarioMin', filters.salarioMin.toString());
    if (filters.salarioMax) searchParams.append('salarioMax', filters.salarioMax.toString());
    if (filters.ubicacion) searchParams.append('ubicacion', filters.ubicacion);
    if (filters.empresaId) searchParams.append('empresaId', filters.empresaId);

    return api.get<PaginatedOffersResponse>(`${API_ENDPOINTS.OFFERS.SEARCH}?${searchParams.toString()}`);
  }

  static async getOfferById(offerId: string): Promise<ApiResponse<OfferWithDetails>> {
    return api.get<OfferWithDetails>(`${API_ENDPOINTS.OFFERS.BASE}/${offerId}`);
  }
}

export const offersService = new OffersService();
