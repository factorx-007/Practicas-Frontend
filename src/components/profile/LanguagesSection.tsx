'use client';

import { useState } from 'react';
import { StudentProfile, EstudianteIdioma, UserProfile } from '@/types/user';
import { useUpdateStudentProfile } from '@/hooks/useProfile';
// Removed unused Card imports
import { Button } from '@/components/ui/button';
import { Globe, Plus, Edit, Trash2 } from 'lucide-react';
import { NIVEL_IDIOMA_LABELS, EstudianteIdiomaInput } from '@/types/profile.types';
import type { NivelIdioma } from '@/types/localTypes';

interface LanguagesSectionProps {
  profile: (UserProfile | (StudentProfile & { idiomas?: EstudianteIdioma[] })) | null;
}

// Catálogo de idiomas básico (puede reemplazarse por una llamada al backend cuando exista endpoint)
const LANGUAGE_CATALOG: { nombre: string; codigo_iso: string }[] = [
  { nombre: 'Español', codigo_iso: 'es' },
  { nombre: 'Inglés', codigo_iso: 'en' },
  { nombre: 'Portugués', codigo_iso: 'pt' },
  { nombre: 'Francés', codigo_iso: 'fr' },
  { nombre: 'Alemán', codigo_iso: 'de' },
  { nombre: 'Italiano', codigo_iso: 'it' },
  { nombre: 'Chino (Mandarín)', codigo_iso: 'zh' },
  { nombre: 'Japonés', codigo_iso: 'ja' },
  { nombre: 'Coreano', codigo_iso: 'ko' },
  { nombre: 'Ruso', codigo_iso: 'ru' },
  { nombre: 'Quechua', codigo_iso: 'qu' },
  { nombre: 'Aymara', codigo_iso: 'ay' },
];

const NIVEL_OPTIONS: { value: NivelIdioma; label: string }[] = [
  { value: 'A1_BASICO', label: NIVEL_IDIOMA_LABELS.A1_BASICO },
  { value: 'A2_ELEMENTAL', label: NIVEL_IDIOMA_LABELS.A2_ELEMENTAL },
  { value: 'B1_INTERMEDIO', label: NIVEL_IDIOMA_LABELS.B1_INTERMEDIO },
  { value: 'B2_INTERMEDIO_ALTO', label: NIVEL_IDIOMA_LABELS.B2_INTERMEDIO_ALTO },
  { value: 'C1_AVANZADO', label: NIVEL_IDIOMA_LABELS.C1_AVANZADO },
  { value: 'C2_MAESTRIA', label: NIVEL_IDIOMA_LABELS.C2_MAESTRIA },
  { value: 'NATIVO', label: NIVEL_IDIOMA_LABELS.NATIVO },
];

function NivelSelect({ value, onChange, label }: { value: NivelIdioma; onChange: (v: NivelIdioma) => void; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-600 mb-2 font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as NivelIdioma)}
        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
      >
        {NIVEL_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function LanguagesSection({ profile }: LanguagesSectionProps) {
  const studentProfile = profile as StudentProfile & { idiomas?: EstudianteIdioma[] };
  const idiomas = studentProfile?.idiomas || [];
  const { mutate: updateProfile, isPending } = useUpdateStudentProfile();

  const [isAdding, setIsAdding] = useState(false);
  const [newLanguage, setNewLanguage] = useState<EstudianteIdiomaInput>({
    nivel_oral: 'B1_INTERMEDIO',
    nivel_escrito: 'B1_INTERMEDIO',
    nivel_lectura: 'B1_INTERMEDIO',
    idioma: { nombre: '', codigo_iso: '' }
  });
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLevels, setEditingLevels] = useState<{ oral: NivelIdioma; escrito: NivelIdioma; lectura: NivelIdioma }>({
    oral: 'B1_INTERMEDIO',
    escrito: 'B1_INTERMEDIO',
    lectura: 'B1_INTERMEDIO',
  });

  const startEdit = (lang: EstudianteIdioma) => {
    setEditingId(lang.id);
    setEditingLevels({ oral: lang.nivel_oral as NivelIdioma, escrito: lang.nivel_escrito as NivelIdioma, lectura: lang.nivel_lectura as NivelIdioma });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateProfile({ idiomas: { update: [{ where: { id: editingId }, data: { nivel_oral: editingLevels.oral, nivel_escrito: editingLevels.escrito, nivel_lectura: editingLevels.lectura } }] } });
    setEditingId(null);
  };

  const addLanguage = () => {
    if (!newLanguage.idioma?.nombre || !newLanguage.idioma?.codigo_iso) return;
    
    // Send only the necessary data - backend will handle language creation/lookup
    const languageData = {
      nivel_oral: newLanguage.nivel_oral,
      nivel_escrito: newLanguage.nivel_escrito,
      nivel_lectura: newLanguage.nivel_lectura,
      // For now, send language name as a simple field - backend needs to handle this
      idioma: {
        nombre: newLanguage.idioma.nombre,
        codigo_iso: newLanguage.idioma.codigo_iso
      }
    };
    
    updateProfile({ idiomas: { create: [languageData] } });
    setIsAdding(false);
    setNewLanguage({
      nivel_oral: 'B1_INTERMEDIO',
      nivel_escrito: 'B1_INTERMEDIO',
      nivel_lectura: 'B1_INTERMEDIO',
      idioma: { nombre: '', codigo_iso: '' }
    });
    setShowCatalog(false);
    setCatalogFilter('');
  };

  const deleteLanguage = (id: string) => {
    if (window.confirm('¿Eliminar este idioma?')) {
      updateProfile({ idiomas: { delete: [{ id }] } });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Globe className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Idiomas</h2>
            <p className="text-gray-600 mt-1">
              {idiomas.length} idioma{idiomas.length !== 1 ? 's' : ''} registrado{idiomas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setIsAdding(true)} 
          disabled={isPending}
          className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Añadir Idioma
        </Button>
      </div>

      {/* Add Language Form */}
      {isAdding && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-5">Agregar Nuevo Idioma</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2 font-medium">Nombre del idioma</span>
              <input
                type="text"
                value={newLanguage.idioma?.nombre || ''}
                onChange={(e) => setNewLanguage({ ...newLanguage, idioma: { nombre: e.target.value, codigo_iso: newLanguage.idioma?.codigo_iso || '' } })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Ej. Inglés, Español"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 mb-2 font-medium">Código ISO (ej. en, es)</span>
              <input
                type="text"
                value={newLanguage.idioma?.codigo_iso || ''}
                onChange={(e) => setNewLanguage({ ...newLanguage, idioma: { nombre: newLanguage.idioma?.nombre || '', codigo_iso: e.target.value } })}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Código ISO"
              />
            </div>
          </div>
          <div className="mb-5">
            <Button 
              variant="outline" 
              onClick={() => setShowCatalog(!showCatalog)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {showCatalog ? 'Ocultar catálogo' : 'Seleccionar de catálogo'}
            </Button>
          </div>
          {showCatalog && (
            <div className="border rounded-xl p-4 mb-5">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  value={catalogFilter}
                  onChange={(e) => setCatalogFilter(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Buscar idioma..."
                />
              </div>
              <div className="max-h-60 overflow-auto grid grid-cols-1 md:grid-cols-2 gap-3">
                {LANGUAGE_CATALOG
                  .filter(l => l.nombre.toLowerCase().includes(catalogFilter.toLowerCase()) || l.codigo_iso.toLowerCase().includes(catalogFilter.toLowerCase()))
                  .map((lang) => (
                    <button
                      key={lang.codigo_iso}
                      onClick={() => setNewLanguage({ ...newLanguage, idioma: { nombre: lang.nombre, codigo_iso: lang.codigo_iso } })}
                      className="text-left px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{lang.nombre}</div>
                      <div className="text-sm text-gray-500">ISO: {lang.codigo_iso}</div>
                    </button>
                  ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <NivelSelect label="Nivel Oral" value={newLanguage.nivel_oral} onChange={(v) => setNewLanguage({ ...newLanguage, nivel_oral: v })} />
            <NivelSelect label="Nivel Escrito" value={newLanguage.nivel_escrito} onChange={(v) => setNewLanguage({ ...newLanguage, nivel_escrito: v })} />
            <NivelSelect label="Nivel Lectura" value={newLanguage.nivel_lectura} onChange={(v) => setNewLanguage({ ...newLanguage, nivel_lectura: v })} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsAdding(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={addLanguage}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Guardar Idioma
            </Button>
          </div>
        </div>
      )}

      {/* Languages List */}
      <div className="space-y-5">
        {idiomas.length > 0 ? (
          idiomas.map((lang) => (
            <div key={lang.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{lang.idioma?.nombre || 'Idioma'}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === lang.id ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={saveEdit}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Guardar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={cancelEdit}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => startEdit(lang)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => deleteLanguage(lang.id)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingId === lang.id ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <NivelSelect label="Nivel Oral" value={editingLevels.oral} onChange={(v) => setEditingLevels({ ...editingLevels, oral: v })} />
                  <NivelSelect label="Nivel Escrito" value={editingLevels.escrito} onChange={(v) => setEditingLevels({ ...editingLevels, escrito: v })} />
                  <NivelSelect label="Nivel Lectura" value={editingLevels.lectura} onChange={(v) => setEditingLevels({ ...editingLevels, lectura: v })} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-sm text-gray-600 font-medium">Nivel Oral</span>
                    <p className="font-bold text-gray-900 mt-1 text-lg">{NIVEL_IDIOMA_LABELS[lang.nivel_oral as NivelIdioma]}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-sm text-gray-600 font-medium">Nivel Escrito</span>
                    <p className="font-bold text-gray-900 mt-1 text-lg">{NIVEL_IDIOMA_LABELS[lang.nivel_escrito as NivelIdioma]}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-sm text-gray-600 font-medium">Nivel Lectura</span>
                    <p className="font-bold text-gray-900 mt-1 text-lg">{NIVEL_IDIOMA_LABELS[lang.nivel_lectura as NivelIdioma]}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no has agregado idiomas</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Registra tus idiomas y niveles para mejorar tu perfil</p>
            <Button 
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Agregar Idioma
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}