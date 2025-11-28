'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Building } from 'lucide-react';

interface Experience {
  id?: string;
  empresa: string;
  puesto: string;
  ubicacion?: string;
  fechaInicio: string;
  fechaFin?: string;
  esTrabajoActual?: boolean;
  descripcion?: string;
  tipo?: 'TIEMPO_COMPLETO' | 'MEDIO_TIEMPO' | 'FREELANCE' | 'PRACTICAS' | 'VOLUNTARIADO';
  habilidades?: string[];
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Experience) => void;
  experience?: Experience | null;
}

export default function ExperienceModal({ isOpen, onClose, onSave, experience }: ExperienceModalProps) {
  const [formData, setFormData] = useState<Experience>({
    empresa: '',
    puesto: '',
    ubicacion: '',
    fechaInicio: '',
    fechaFin: '',
    esTrabajoActual: false,
    descripcion: '',
    tipo: 'TIEMPO_COMPLETO',
    habilidades: []
  });

  const [habilidadesText, setHabilidadesText] = useState('');

  useEffect(() => {
    if (experience) {
      setFormData(experience);
      setHabilidadesText(experience.habilidades?.join(', ') || '');
    } else {
      setFormData({
        empresa: '',
        puesto: '',
        ubicacion: '',
        fechaInicio: '',
        fechaFin: '',
        esTrabajoActual: false,
        descripcion: '',
        tipo: 'TIEMPO_COMPLETO',
        habilidades: []
      });
      setHabilidadesText('');
    }
  }, [experience, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Procesar habilidades solo al enviar el formulario
    const habilidades = habilidadesText
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    const finalFormData = {
      ...formData,
      habilidades
    };
    
    console.log('🔴 ExperienceModal.handleSubmit called with formData:', finalFormData);
    onSave(finalFormData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {experience ? 'Editar Experiencia' : 'Agregar Experiencia'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Empresa *
              </label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nombre de la empresa"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Puesto *
              </label>
              <input
                type="text"
                name="puesto"
                value={formData.puesto}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Título del cargo"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ubicación
              </label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ciudad, País"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Trabajo
              </label>
              <select
                name="tipo"
                value={formData.tipo || 'TIEMPO_COMPLETO'}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="TIEMPO_COMPLETO">Tiempo Completo</option>
                <option value="MEDIO_TIEMPO">Medio Tiempo</option>
                <option value="FREELANCE">Freelance</option>
                <option value="PRACTICAS">Prácticas</option>
                <option value="VOLUNTARIADO">Voluntariado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha de Fin
              </label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={formData.esTrabajoActual}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="esTrabajoActual"
              checked={formData.esTrabajoActual}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm text-gray-700">
              Trabajo actual
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habilidades (separadas por comas)
            </label>
            <input
              type="text"
              name="habilidadesText"
              value={habilidadesText}
              onChange={(e) => setHabilidadesText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="React, TypeScript, Node.js, Python..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Escribe las habilidades separadas por comas. Se procesarán al guardar.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe tus responsabilidades, logros y tecnologías utilizadas..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
