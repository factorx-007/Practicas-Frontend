'use client';

import { useState } from 'react';
import { Plus, Code2, Edit2, Trash2, Star } from 'lucide-react';
import { StudentProfile, EstudianteHabilidad } from '@/types/user';
import MinimalButton from '@/components/ui/MinimalButton';
import SkillModal from '../modals/SkillModal';
import { EstudianteHabilidadInput } from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentSkillsProps {
  profile: StudentProfile | null;
}

const NIVEL_LABELS: Record<string, string> = {
  BASICO: 'Básico',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
  EXPERTO: 'Experto',
};

const NIVEL_COLORS: Record<string, string> = {
  BASICO: 'bg-gray-100 text-gray-800',
  INTERMEDIO: 'bg-blue-100 text-blue-800',
  AVANZADO: 'bg-green-100 text-green-800',
  EXPERTO: 'bg-purple-100 text-purple-800',
};

export default function StudentSkills({ profile: initialProfile }: StudentSkillsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<EstudianteHabilidad | null>(null);
  const [skillList, setSkillList] = useState<EstudianteHabilidad[]>(
    initialProfile?.habilidadesNuevas || [
      {
        id: '1',
        nivel: 'AVANZADO',
        anios_experiencia: 3,
        habilidad: {
          nombre: 'React',
          categoria: 'FRAMEWORK_LIBRERIA',
          tipo: 'TECNICA',
        },
      },
      {
        id: '2',
        nivel: 'AVANZADO',
        anios_experiencia: 3,
        habilidad: {
          nombre: 'Node.js',
          categoria: 'FRAMEWORK_LIBRERIA',
          tipo: 'TECNICA',
        },
      },
      {
        id: '3',
        nivel: 'INTERMEDIO',
        anios_experiencia: 2,
        habilidad: {
          nombre: 'PostgreSQL',
          categoria: 'BASE_DATOS',
          tipo: 'TECNICA',
        },
      },
      {
        id: '4',
        nivel: 'AVANZADO',
        anios_experiencia: 4,
        habilidad: {
          nombre: 'TypeScript',
          categoria: 'LENGUAJE_PROGRAMACION',
          tipo: 'TECNICA',
        },
      },
      {
        id: '5',
        nivel: 'AVANZADO',
        anios_experiencia: 5,
        habilidad: {
          nombre: 'Trabajo en Equipo',
          categoria: 'SOFT_SKILL',
          tipo: 'BLANDA',
        },
      },
      {
        id: '6',
        nivel: 'INTERMEDIO',
        anios_experiencia: 2,
        habilidad: {
          nombre: 'Docker',
          categoria: 'CLOUD_DEVOPS',
          tipo: 'TECNICA',
        },
      },
    ]
  );

  const handleSaveSkill = async (data: EstudianteHabilidadInput) => {
    try {
      if (editingSkill) {
        // Update existing skill
        await UsersService.updateStudentProfile({
          habilidadesNuevas: {
            update: [
              {
                where: { id: editingSkill.id },
                data,
              },
            ],
          },
        });

        setSkillList(
          skillList.map((skill) =>
            skill.id === editingSkill.id
              ? {
                  ...skill,
                  ...data,
                  habilidad: {
                    nombre: data.habilidad?.nombre || skill.habilidad.nombre,
                    categoria: data.habilidad?.categoria || skill.habilidad.categoria,
                    tipo: data.habilidad?.tipo || skill.habilidad.tipo,
                  },
                }
              : skill
          )
        );

        toast.success('Habilidad actualizada');
      } else {
        // Create new skill
        const newSkill: EstudianteHabilidad = {
          id: Date.now().toString(), // Asegurar que el id se genera antes de enviar
          nivel: data.nivel,
          anios_experiencia: data.anios_experiencia ?? 0, // Asegurar un valor numérico
          habilidad: {
            nombre: data.habilidad?.nombre || '',
            categoria: data.habilidad?.categoria || 'OTRO', // Usar un valor por defecto válido
            tipo: data.habilidad?.tipo || 'TECNICA',
          },
        };

        await UsersService.updateStudentProfile({
          habilidadesNuevas: {
            create: [newSkill], // Pasar el objeto completo con el id generado
          },
        });

        setSkillList([...skillList, newSkill]);
        toast.success('Habilidad agregada');
      }

      setIsModalOpen(false);
      setEditingSkill(null);
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error('Error al guardar la habilidad');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta habilidad?')) return;

    try {
      await UsersService.updateStudentProfile({
        habilidadesNuevas: {
          delete: [{ id }],
        },
      });

      setSkillList(skillList.filter((skill) => skill.id !== id));
      toast.success('Habilidad eliminada');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Error al eliminar la habilidad');
    }
  };

  const handleEdit = (skill: EstudianteHabilidad) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  // Group skills by category
  const skillsByCategory = skillList.reduce((acc, skill) => {
    const category = skill.habilidad.categoria;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, EstudianteHabilidad[]>);

  const renderStars = (nivel: string) => {
    const stars = {
      BASICO: 1,
      INTERMEDIO: 2,
      AVANZADO: 3,
      EXPERTO: 4,
    };
    const count = stars[nivel as keyof typeof stars] || 2;

    return (
      <div className="flex items-center gap-1">
        {[...Array(4)].map((_, idx) => (
          <Star
            key={idx}
            className={`w-4 h-4 ${
              idx < count ? 'text-yellow-500 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Habilidades</h2>
          <p className="text-gray-600 mt-1">
            {skillList.length} habilidad{skillList.length !== 1 ? 'es' : ''} registrada{skillList.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MinimalButton 
          onClick={handleNew} 
          icon={<Plus className="w-5 h-5" />}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span className="font-medium">Agregar Habilidad</span>
        </MinimalButton>
      </div>

      {/* Skills List */}
      <div className="space-y-5">
        {Object.keys(skillsByCategory).length > 0 ? (
          Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{category}</h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h4 className="text-lg font-bold text-gray-900">
                            {skill.habilidad.nombre}
                          </h4>
                          <span
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              NIVEL_COLORS[skill.nivel]
                            }`}
                          >
                            {NIVEL_LABELS[skill.nivel]}
                          </span>
                          {skill.anios_experiencia && skill.anios_experiencia > 0 && (
                            <span className="text-gray-600 font-medium">
                              {skill.anios_experiencia} año{skill.anios_experiencia !== 1 ? 's' : ''} de experiencia
                            </span>
                          )}
                        </div>
                        <div className="mt-2">{renderStars(skill.nivel)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Code2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay habilidades registradas
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Agrega tus habilidades técnicas y blandas para destacar tu perfil
            </p>
            <MinimalButton 
              onClick={handleNew} 
              icon={<Plus className="w-5 h-5" />}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <span className="font-medium">Agregar Primera Habilidad</span>
            </MinimalButton>
          </div>
        )}
      </div>

      {/* Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
        }}
        onSave={handleSaveSkill}
        currentData={editingSkill}
      />
    </div>
  );
}