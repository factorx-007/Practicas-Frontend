'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Search } from 'lucide-react';
import { PostQueryParams } from '@/types/social.types';

interface BlogFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PostQueryParams;
  onApplyFilters: (filters: PostQueryParams) => void;
}

export default function BlogFilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters
}: BlogFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<PostQueryParams>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      busqueda: '',
      soloConexiones: false,
      orderBy: 'createdAt',
      order: 'desc',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
        >
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Filter className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Filtros de Posts</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Búsqueda */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 flex items-center">
              <Search className="w-4 h-4 mr-2 text-blue-500" />
              Buscar Contenido
            </label>
            <input
              type="text"
              value={localFilters.busqueda || ''}
              onChange={(e) => setLocalFilters((prev: PostQueryParams) => ({
                ...prev,
                busqueda: e.target.value
              }))}
              placeholder="Buscar en el contenido de los posts"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Solo Conexiones */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={localFilters.soloConexiones || false}
              onChange={(e) => setLocalFilters((prev: PostQueryParams) => ({
                ...prev,
                soloConexiones: e.target.checked
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-700 font-semibold">
              Mostrar solo posts de mis conexiones
            </label>
          </div>

          {/* Ordenar por */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Ordenar por
            </label>
            <select
              value={localFilters.orderBy || 'createdAt'}
              onChange={(e) => setLocalFilters((prev: PostQueryParams) => ({
                ...prev,
                orderBy: e.target.value as 'createdAt' | 'totalReacciones' | 'totalComentarios'
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="createdAt">Fecha de Creación</option>
              <option value="totalReacciones">Número de Reacciones</option>
              <option value="totalComentarios">Número de Comentarios</option>
            </select>
          </div>

          {/* Dirección del orden */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Dirección del Orden
            </label>
            <select
              value={localFilters.order || 'desc'}
              onChange={(e) => setLocalFilters((prev: PostQueryParams) => ({
                ...prev,
                order: e.target.value as 'asc' | 'desc'
              }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between space-x-4 mt-6">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Restablecer
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
