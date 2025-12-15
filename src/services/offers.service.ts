import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse } from '@/types/common';
import { OfferSearchFilters, PaginatedOffersResponse, OfferWithDetails, CompanyStats, Application, PaginatedCandidatesResponse } from '@/types/offers.types';

export class OffersService {
  async searchOffers(
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

    if (filters.ubicacion) searchParams.append('ubicacion', filters.ubicacion);
    if (filters.empresaId) searchParams.append('empresaId', filters.empresaId);

    return api.get<PaginatedOffersResponse>(`${API_ENDPOINTS.OFFERS.SEARCH}?${searchParams.toString()}`);
  }

  async getOfferById(offerId: string): Promise<ApiResponse<OfferWithDetails>> {
    return api.get<OfferWithDetails>(`${API_ENDPOINTS.OFFERS.BASE}/${offerId}`);
  }

  async getCompanyStats(): Promise<ApiResponse<CompanyStats>> {
    return api.get<CompanyStats>(`${API_ENDPOINTS.OFFERS.BASE}/company/stats`);
  }

  async getCompanyCandidates(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ApiResponse<PaginatedCandidatesResponse>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);

    return api.get<PaginatedCandidatesResponse>(`${API_ENDPOINTS.OFFERS.BASE}/company/candidates?${params.toString()}`);
  }

  async updateApplicationStatus(
    applicationId: string,
    status: string,
    notasEntrevistador?: string
  ): Promise<ApiResponse<Application>> {
    return api.patch<Application>(`${API_ENDPOINTS.OFFERS.BASE}/applications/${applicationId}/status`, {
      status,
      notasEntrevistador
    });
  }
}

export const offersService = new OffersService();
