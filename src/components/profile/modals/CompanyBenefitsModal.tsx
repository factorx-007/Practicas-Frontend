'use client';

import { useState, useEffect } from 'react';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalButton from '@/components/ui/MinimalButton';
import { Plus, X, Loader2 } from 'lucide-react';
import UsersService from '@/services/users.service';
import CatalogsService, { Benefit } from '@/services/catalogs.service';
import { toast } from 'react-hot-toast';

interface CompanyBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

interface CompanyBenefit {
  id: string;
  descripcion: string | null;
  beneficio: Benefit;
}

export default function CompanyBenefitsModal({
  isOpen,
  onClose,
  onSaveSuccess,
}: CompanyBenefitsModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [catalogBenefits, setCatalogBenefits] = useState<Benefit[]>([]);
  const [originalBenefits, setOriginalBenefits] = useState<CompanyBenefit[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load catalog and company benefits
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catalogResponse, companyResponse] = await Promise.all([
        CatalogsService.getBenefits(),
        UsersService.getCompanyBenefits()
      ]);

      if (catalogResponse.success && catalogResponse.data) {
        setCatalogBenefits(catalogResponse.data.all);
      }

      if (companyResponse.success && companyResponse.data) {
        const benefits = (Array.isArray(companyResponse.data) ? companyResponse.data : []) as unknown as CompanyBenefit[];
        setOriginalBenefits(benefits);
        // Initialize selected benefits with current ones
        setSelectedBenefits(benefits.map((cb) => cb.beneficio.id));
      } else {
        // No benefits yet
        setOriginalBenefits([]);
        setSelectedBenefits([]);
      }
    } catch (error) {
      console.error('Error loading benefits:', error);
      toast.error('Error al cargar beneficios');
      // Initialize empty on error
      setOriginalBenefits([]);
      setSelectedBenefits([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleBenefit = (beneficioId: string) => {
    setSelectedBenefits(prev => {
      if (prev.includes(beneficioId)) {
        return prev.filter(id => id !== beneficioId);
      } else {
        return [...prev, beneficioId];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Find benefits to add (in selected but not in original)
      const originalIds = originalBenefits.map(cb => cb.beneficio.id);
      const toAdd = selectedBenefits.filter(id => !originalIds.includes(id));

      // Find benefits to remove (in original but not in selected)
      const toRemove = originalBenefits.filter(cb => !selectedBenefits.includes(cb.beneficio.id));

      console.log('Saving benefits:', { originalIds, selectedBenefits, toAdd, toRemove });

      // Execute additions
      if (toAdd.length > 0) {
        for (const beneficioId of toAdd) {
          await UsersService.addCompanyBenefit(beneficioId);
        }
      }

      // Execute removals
      if (toRemove.length > 0) {
        for (const benefit of toRemove) {
          await UsersService.deleteCompanyBenefit(benefit.id);
        }
      }

      if (toAdd.length === 0 && toRemove.length === 0) {
        toast('No hay cambios para guardar');
      } else {
        toast.success('Beneficios actualizados exitosamente');
      }

      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving benefits:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data ? String(error.response.data.message) : 'Error al guardar beneficios';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const isBenefitSelected = (beneficioId: string) => {
    return selectedBenefits.includes(beneficioId);
  };

  const hasChanges = () => {
    const originalIds = originalBenefits.map(cb => cb.beneficio.id).sort();
    const currentIds = [...selectedBenefits].sort();
    return JSON.stringify(originalIds) !== JSON.stringify(currentIds);
  };

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'SALUD', label: 'Salud' },
    { value: 'FINANCIERO', label: 'Financiero' },
    { value: 'DESARROLLO_PROFESIONAL', label: 'Desarrollo Profesional' },
    { value: 'FLEXIBILIDAD', label: 'Flexibilidad' },
    { value: 'BIENESTAR', label: 'Bienestar' },
    { value: 'TRANSPORTE', label: 'Transporte' },
    { value: 'ALIMENTACION', label: 'Alimentación' },
  ];

  const filteredBenefits = catalogBenefits.filter(benefit => {
    const matchesCategory = selectedCategory === 'all' || benefit.categoria === selectedCategory;
    const matchesSearch = benefit.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestionar Beneficios"
      size="lg"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-600">
            {selectedBenefits.length} beneficio{selectedBenefits.length !== 1 ? 's' : ''} seleccionado{selectedBenefits.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            <MinimalButton variant="ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </MinimalButton>
            <MinimalButton
              onClick={handleSave}
              disabled={!hasChanges() || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </MinimalButton>
          </div>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selected Benefits */}
          {selectedBenefits.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Beneficios Seleccionados ({selectedBenefits.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedBenefits.map((benefitId) => {
                  const benefit = catalogBenefits.find(b => b.id === benefitId);
                  if (!benefit) return null;
                  return (
                    <div
                      key={benefitId}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm"
                    >
                      <span>{benefit.nombre}</span>
                      <button
                        onClick={() => toggleBenefit(benefitId)}
                        className="hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Buscar beneficios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === cat.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Available Benefits */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Beneficios Disponibles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredBenefits.map((benefit) => {
                const isSelected = isBenefitSelected(benefit.id);
                return (
                  <button
                    key={benefit.id}
                    onClick={() => toggleBenefit(benefit.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm'
                      }`}
                  >
                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                      {benefit.nombre}
                    </span>
                    {isSelected ? (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </MinimalModal>
  );
}
