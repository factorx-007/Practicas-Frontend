import { api } from '@/lib/api';
import { ApiResponse } from '@/types/common';

export interface Benefit {
  id: string;
  nombre: string;
  categoria: string;
  icono: string;
  activo: boolean;
  createdAt: string;
}

export interface BenefitsResponse {
  all: Benefit[];
  byCategory: Record<string, Benefit[]>;
}

class CatalogsService {
  /**
   * Get benefits catalog
   */
  static async getBenefits(): Promise<ApiResponse<BenefitsResponse>> {
    return api.get<BenefitsResponse>('/catalogs/benefits');
  }
}

export default CatalogsService;
