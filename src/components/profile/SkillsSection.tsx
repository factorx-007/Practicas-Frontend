'use client';

import { useState } from 'react';
import { UserProfile, StudentProfile } from '@/types/user';
import { Code, Plus, X, Edit } from 'lucide-react';

interface SkillsSectionProps {
  profile: (UserProfile | (StudentProfile & {
    perfilEstudiante?: {
      habilidades?: string[];
    };
  })) | null;
}

export default function SkillsSection({ profile }: SkillsSectionProps) {
  // Obtener habilidades del perfil de estudiante o usar un array vacío
  const studentProfile = profile as StudentProfile & {
    perfilEstudiante?: {
      habilidades?: string[];
    };
  };
  const skills = studentProfile?.perfilEstudiante?.habilidades || [];
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkills, setEditingSkills] = useState<string[]>(skills);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !editingSkills.includes(newSkill.trim())) {
      setEditingSkills([...editingSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditingSkills(editingSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    // TODO: Implement API call to save skills
    console.log('Saving skills:', editingSkills);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingSkills(skills);
    setNewSkill('');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Habilidades Técnicas</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Editar Habilidades</span>
          </button>
        )}
      </div>

      {/* Skills Display/Edit */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {isEditing ? (
          <div className="space-y-4">
            {/* Add New Skill */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Agregar nueva habilidad..."
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Skills List (Editing) */}
            <div className="flex flex-wrap gap-2">
              {editingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Edit Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        ) : (
          <>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay habilidades registradas</h3>
                <p className="text-gray-600 mb-4">Agrega tus habilidades técnicas para destacar tu perfil</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Habilidades
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}