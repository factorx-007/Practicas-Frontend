'use client';

import { useState } from 'react';
import { StudentProfile, ExperienciaLaboral } from '@/types/user';
import { useUpdateStudentProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// import ExperienceModal from './ExperienceModal'; // Se creará en el siguiente paso

interface ExperienceSectionProps {
  profile: StudentProfile | null;
}

// Componente para mostrar una sola tarjeta de experiencia
const ExperienceCard = ({ experience, onEdit, onDelete }: { experience: ExperienciaLaboral, onEdit: () => void, onDelete: () => void }) => {
  const startDate = format(new Date(experience.fecha_inicio), "MMM yyyy", { locale: es });
  const endDate = experience.es_actual ? 'Presente' : experience.fecha_fin ? format(new Date(experience.fecha_fin), "MMM yyyy", { locale: es }) : '';

  return (
    <div className="pl-4 border-l-2 border-gray-200 relative">
      <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-2 border-gray-300 rounded-full"></div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-800">{experience.cargo}</h4>
            <p className="text-sm text-gray-600">{experience.empresa} · {experience.modalidad}</p>
            <p className="text-xs text-gray-400">{startDate} - {endDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}><Edit className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="w-4 h-4 text-red-500" /></Button>
          </div>
        </div>
        {experience.descripcion && <p className="mt-2 text-sm text-gray-700">{experience.descripcion}</p>}
      </div>
    </div>
  );
};

export default function ExperienceSection({ profile }: ExperienceSectionProps) {
  const [, _setIsModalOpen] = useState(false);
  const [, _setEditingExperience] = useState<ExperienciaLaboral | null>(null);

  const { mutate: updateProfile, isPending } = useUpdateStudentProfile();

  const handleAddNew = () => {
    _setEditingExperience(null);
    _setIsModalOpen(true);
  };

  const handleEdit = (experience: ExperienciaLaboral) => {
    _setEditingExperience(experience);
    _setIsModalOpen(true);
  };

  const handleDelete = (experienceId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta experiencia?')) {
      updateProfile({ experiencias: { delete: [{ id: experienceId }] } });
    }
  };

  const experiences = profile?.experiencias || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          Experiencia Laboral
        </CardTitle>
        <Button onClick={handleAddNew} disabled={isPending}>
          <Plus className="w-4 h-4 mr-2" />
          Añadir Experiencia
        </Button>
      </CardHeader>
      <CardContent>
        {isPending && <Loader2 className="animate-spin w-6 h-6 mx-auto" />}
        <div className="space-y-6">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <ExperienceCard 
                key={exp.id} 
                experience={exp} 
                onEdit={() => handleEdit(exp)}
                onDelete={() => handleDelete(exp.id)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aún no has añadido ninguna experiencia laboral.</p>
              <p className="text-sm text-gray-400">¡Añade tus trabajos y prácticas para destacar!</p>
            </div>
          )}
        </div>
      </CardContent>
      {/* 
        El modal se renderizará aquí. Se creará en el siguiente paso.
        <ExperienceModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          experience={editingExperience}
        /> 
      */}
    </Card>
  );
}
