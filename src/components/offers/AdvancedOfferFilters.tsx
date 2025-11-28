'use client';

import { useState } from 'react';
import {
  Filter,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  GraduationCap,
  Clock,
  Tag,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import {
  WORK_MODALITY,
  OFFER_TYPES,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS
} from '@/constants';

export interface AdvancedFilters {
  // Filtros básicos
  search: string;
  ubicacion: string;
  modalidad: string[];
  tipoEmpleo: string[];

  // Filtros de requisitos
  nivelEducacion: string[];
  experiencia: string[];

  // Filtros de salario
  salarioMin: number | null;
  salarioMax: number | null;
  soloConSalario: boolean;

  // Filtros de fecha
  fechaPublicacion: 'TODO' | 'HOY' | 'SEMANA' | 'MES';

  // Filtros de habilidades
  habilidades: string[];

  // Ordenamiento
  sortBy: 'relevancia' | 'fechaCreacion' | 'salario' | 'popularidad';
  sortOrder: 'asc' | 'desc';
}

interface Props {
  filters: AdvancedFilters;
  onFiltersChange: (filters: AdvancedFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

// Habilidades comunes (en una aplicación real vendrían del backend)
const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
  'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git',
  'HTML', 'CSS', 'Vue.js', 'Angular', 'Express', 'Spring Boot',
  'Django', 'Flask', 'Laravel', 'PHP', 'C#', '.NET',
  'DevOps', 'Kubernetes', 'Jenkins', 'CI/CD', 'Agile', 'Scrum'
];

// Memoizar el componente para evitar re-renders innecesarios
export default function AdvancedOfferFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ''
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [skillSearchTerm, setSkillSearchTerm] = useState('');

  const updateFilter = <K extends keyof AdvancedFilters>(key: K, value: AdvancedFilters[K]) => {
    // Only update if the value actually changed
    if (JSON.stringify(filters[key]) !== JSON.stringify(value)) {
      onFiltersChange({
        ...filters,
        [key]: value
      });
    }
  };

  const toggleArrayFilter = (key: keyof AdvancedFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    updateFilter(key, newArray);
  };

  const addSkill = (skill: string) => {
    if (!filters.habilidades.includes(skill)) {
      updateFilter('habilidades', [...filters.habilidades, skill]);
    }
    setSkillSearchTerm('');
  };

  const removeSkill = (skill: string) => {
    updateFilter('habilidades', filters.habilidades.filter(s => s !== skill));
  };

  const filteredSkills = COMMON_SKILLS.filter(skill =>
    skill.toLowerCase().includes(skillSearchTerm.toLowerCase()) &&
    !filters.habilidades.includes(skill)
  );

  const hasActiveFilters = () => {
    return (
      filters.search !== '' ||
      filters.ubicacion !== '' ||
      filters.modalidad.length > 0 ||
      filters.tipoEmpleo.length > 0 ||
      filters.nivelEducacion.length > 0 ||
      filters.experiencia.length > 0 ||
      filters.salarioMin !== null ||
      filters.salarioMax !== null ||
      filters.soloConSalario ||
      filters.fechaPublicacion !== 'TODO' ||
      filters.habilidades.length > 0
    );
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header del filtro */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
            {hasActiveFilters() && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Activos
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {hasActiveFilters() && (
              <button
                onClick={onClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Limpiar todos
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros básicos - siempre visibles */}
      <div className="px-6 py-4 space-y-4">
        {/* Búsqueda principal */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título, empresa o palabras clave..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Ubicación */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Ciudad o región..."
            value={filters.ubicacion}
            onChange={(e) => updateFilter('ubicacion', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros avanzados - expandibles */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-100">

          {/* Modalidad y Tipo de Empleo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Briefcase className="w-4 h-4 mr-2" />
                Modalidad de Trabajo
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(WORK_MODALITY).map(modalidad => (
                  <button
                    key={modalidad}
                    onClick={() => toggleArrayFilter('modalidad', modalidad)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.modalidad.includes(modalidad)
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {modalidad}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Clock className="w-4 h-4 mr-2" />
                Tipo de Empleo
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(OFFER_TYPES).map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => toggleArrayFilter('tipoEmpleo', tipo)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.tipoEmpleo.includes(tipo)
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Educación y Experiencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <GraduationCap className="w-4 h-4 mr-2" />
                Nivel de Educación
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(EDUCATION_LEVELS).map(nivel => (
                  <button
                    key={nivel}
                    onClick={() => toggleArrayFilter('nivelEducacion', nivel)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.nivelEducacion.includes(nivel)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Tag className="w-4 h-4 mr-2" />
                Nivel de Experiencia
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(EXPERIENCE_LEVELS).map(nivel => (
                  <button
                    key={nivel}
                    onClick={() => toggleArrayFilter('experiencia', nivel)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.experiencia.includes(nivel)
                        ? 'bg-orange-100 border-orange-500 text-orange-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {nivel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rango Salarial */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <DollarSign className="w-4 h-4 mr-2" />
              Rango Salarial (USD)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Salario mínimo"
                value={filters.salarioMin || ''}
                onChange={(e) => updateFilter('salarioMin', e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Salario máximo"
                value={filters.salarioMax || ''}
                onChange={(e) => updateFilter('salarioMax', e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.soloConSalario}
                  onChange={(e) => updateFilter('soloConSalario', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo ofertas con salario</span>
              </label>
            </div>
          </div>

          {/* Fecha de Publicación */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 mr-2" />
              Fecha de Publicación
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'TODO', label: 'Todas las fechas' },
                { value: 'HOY', label: 'Hoy' },
                { value: 'SEMANA', label: 'Esta semana' },
                { value: 'MES', label: 'Este mes' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFilter('fechaPublicacion', option.value as 'TODO' | 'HOY' | 'SEMANA' | 'MES')}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    filters.fechaPublicacion === option.value
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Tag className="w-4 h-4 mr-2" />
              Habilidades Técnicas
            </label>

            {/* Skills seleccionadas */}
            {filters.habilidades.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {filters.habilidades.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Búsqueda de skills */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar habilidades..."
                value={skillSearchTerm}
                onChange={(e) => setSkillSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Sugerencias de skills */}
              {skillSearchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSkills.slice(0, 8).map(skill => (
                    <button
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Skills sugeridas */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Habilidades populares:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.slice(0, 8).filter(skill => !filters.habilidades.includes(skill)).map(skill => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ordenar por
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as 'relevancia' | 'fechaCreacion' | 'salario' | 'popularidad')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevancia">Relevancia</option>
                <option value="fechaCreacion">Fecha de publicación</option>
                <option value="salario">Salario</option>
                <option value="popularidad">Popularidad</option>
              </select>

              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Mayor a menor</option>
                <option value="asc">Menor a mayor</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}