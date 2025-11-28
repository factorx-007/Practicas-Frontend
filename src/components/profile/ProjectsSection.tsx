'use client';

import { UserProfile, StudentProfile } from '@/types/user';
import { FileText, Plus, Edit, Trash2, ExternalLink, Github } from 'lucide-react';

interface Proyecto {
  id?: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  enCurso: boolean;
  tecnologias?: string[];
  url?: string;
  repositorio?: string;
  colaboradores?: string[];
}

interface ProjectsSectionProps {
  profile: (UserProfile | (StudentProfile & { perfilEstudiante?: { proyectos?: Proyecto[] } })) | null;
}

export default function ProjectsSection({ profile }: ProjectsSectionProps) {
  const studentProfile = profile as StudentProfile & { perfilEstudiante?: { proyectos?: Proyecto[] } };
  const projects = studentProfile?.perfilEstudiante?.proyectos || [];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Proyectos</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Agregar Proyecto</span>
        </button>
      </div>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map((project: Proyecto, index: number) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.nombre}</h3>
                    {project.enCurso && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        En curso
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {project.fechaInicio} - {project.enCurso ? 'Presente' : project.fechaFin}
                  </p>
                  <p className="text-gray-600 mb-4">{project.descripcion}</p>

                  {/* Technologies */}
                  {project.tecnologias && project.tecnologias.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tecnologias?.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center space-x-4">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Ver proyecto</span>
                      </a>
                    )}
                    {project.repositorio && (
                      <a
                        href={project.repositorio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
                      >
                        <Github className="w-4 h-4" />
                        <span>Código fuente</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Collaborators */}
              {project.colaboradores && project.colaboradores.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Colaboradores:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.colaboradores?.map((colaborador: string, colabIndex: number) => (
                      <span
                        key={colabIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {colaborador}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos registrados</h3>
          <p className="text-gray-600 mb-4">Muestra tus proyectos y desarrollo de software</p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Proyecto
          </button>
        </div>
      )}
    </div>
  );
}