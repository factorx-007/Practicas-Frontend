'use client';

import { useState } from 'react';
import { Plus, Github, Globe, ExternalLink, Calendar, Edit2, Trash2, FolderGit2 } from 'lucide-react';
import { StudentProfile, Proyecto } from '@/types/user';
import MinimalButton from '@/components/ui/MinimalButton';
import ProjectModal from '../modals/ProjectModal';
import { ProyectoInput } from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentProjectsProps {
  profile: StudentProfile | null;
}

const ESTADO_COLORS: Record<string, string> = {
  EN_PROGRESO: 'bg-blue-100 text-blue-800',
  COMPLETADO: 'bg-green-100 text-green-800',
  EN_PAUSA: 'bg-yellow-100 text-yellow-800',
  CANCELADO: 'bg-gray-100 text-gray-800',
};

const ESTADO_LABELS: Record<string, string> = {
  EN_PROGRESO: 'En Progreso',
  COMPLETADO: 'Completado',
  EN_PAUSA: 'En Pausa',
  CANCELADO: 'Cancelado',
};

const TIPO_LABELS: Record<string, string> = {
  PERSONAL: 'Personal',
  LABORAL: 'Laboral',
  ACADEMICO: 'Académico',
  VOLUNTARIADO: 'Voluntariado',
};

export default function StudentProjects({ profile: initialProfile }: StudentProjectsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Proyecto | null>(null);
  const [projectList, setProjectList] = useState<Proyecto[]>(
    initialProfile?.proyectos || [
      {
        id: '1',
        titulo: 'Sistema de Gestión de Tareas',
        descripcion: 'Aplicación web full-stack para gestión de proyectos y tareas con sistema de colaboración en tiempo real. Incluye autenticación, roles de usuario, notificaciones push y reportes analíticos.',
        tipo: 'PERSONAL',
        fecha_inicio: '2024-01-15T00:00:00.000Z',
        fecha_fin: null,
        estado: 'EN_PROGRESO',
        url_repositorio: 'https://github.com/usuario/task-manager',
        url_demo: 'https://taskmanager-demo.com',
        contexto: 'EQUIPO',
        tecnologias: ['React', 'Node.js', 'PostgreSQL', 'Socket.IO', 'Docker'],
        imagenes: [],
      },
      {
        id: '2',
        titulo: 'E-commerce Platform',
        descripcion: 'Plataforma de comercio electrónico con carrito de compras, pasarela de pagos integrada (Stripe), gestión de inventario y panel administrativo completo.',
        tipo: 'ACADEMICO',
        fecha_inicio: '2023-08-01T00:00:00.000Z',
        fecha_fin: '2023-12-20T00:00:00.000Z',
        estado: 'COMPLETADO',
        url_repositorio: 'https://github.com/usuario/ecommerce',
        url_demo: 'https://ecommerce-demo.vercel.app',
        contexto: 'INDIVIDUAL',
        tecnologias: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Stripe'],
        imagenes: [],
      },
    ]
  );

  const handleSaveProject = async (data: ProyectoInput) => {
    try {
      if (editingProject) {
        // Update existing project
        await UsersService.updateStudentProfile({
          proyectos: {
            update: [
              {
                where: { id: editingProject.id },
                data,
              },
            ],
          },
        });

        setProjectList(
          projectList.map((proj) =>
            proj.id === editingProject.id ? { ...proj, ...data } : proj
          )
        );

        toast.success('Proyecto actualizado');
      } else {
        // Create new project
        const newProj: Proyecto = {
          id: Date.now().toString(),
          ...data,
          tecnologias: [],
          imagenes: [],
        };

        await UsersService.updateStudentProfile({
          proyectos: {
            create: [data],
          },
        });

        setProjectList([...projectList, newProj]);
        toast.success('Proyecto agregado');
      }

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Error al guardar el proyecto');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await UsersService.updateStudentProfile({
        proyectos: {
          delete: [{ id }],
        },
      });

      setProjectList(projectList.filter((proj) => proj.id !== id));
      toast.success('Proyecto eliminado');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error al eliminar el proyecto');
    }
  };

  const handleEdit = (proj: Proyecto) => {
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Proyectos</h2>
          <p className="text-gray-600 mt-1">
            {projectList.length} proyecto{projectList.length !== 1 ? 's' : ''} registrado{projectList.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MinimalButton 
          onClick={handleNew} 
          icon={<Plus className="w-5 h-5" />}
          className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span className="font-medium">Agregar Proyecto</span>
        </MinimalButton>
      </div>

      {/* Projects List */}
      <div className="space-y-5">
        {projectList.length > 0 ? (
          projectList.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <FolderGit2 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{proj.titulo}</h3>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${ESTADO_COLORS[proj.estado]}`}>
                        {ESTADO_LABELS[proj.estado]}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2 leading-relaxed text-lg">{proj.descripcion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-orange-600 transition-colors"
                    aria-label="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {formatDate(proj.fecha_inicio)} -{' '}
                    {proj.estado === 'EN_PROGRESO' ? 'Presente' : proj.fecha_fin ? formatDate(proj.fecha_fin) : 'Presente'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {TIPO_LABELS[proj.tipo]}
                  </span>
                </div>

                {proj.contexto && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {proj.contexto}
                    </span>
                  </div>
                )}
              </div>

              {/* Technologies */}
              {proj.tecnologias && (proj.tecnologias as string[]).length > 0 && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                    Tecnologías
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(proj.tecnologias as string[]).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-md border border-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-5 pt-4 border-t border-gray-100">
                {proj.url_repositorio && (
                  <a
                    href={proj.url_repositorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="font-medium">Código fuente</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {proj.url_demo && (
                  <a
                    href={proj.url_demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">Ver demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <FolderGit2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay proyectos registrados
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Agrega tus proyectos personales y profesionales para mostrar tu experiencia práctica
            </p>
            <MinimalButton 
              onClick={handleNew} 
              icon={<Plus className="w-5 h-5" />}
              className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <span className="font-medium">Agregar Primer Proyecto</span>
            </MinimalButton>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        currentData={editingProject}
      />
    </div>
  );
}