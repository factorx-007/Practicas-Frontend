'use client';

import { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Link as LinkIcon 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Tipos de datos de portafolio
interface Experience {
  id: string;
  titulo: string;
  empresa: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  esTrabajoActual: boolean;
}

interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  enlace?: string;
}

interface Certification {
  id: string;
  nombre: string;
  institucion: string;
  fechaObtencion: string;
  enlace?: string;
}

export default function PortfolioPage() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      titulo: 'Desarrollador Web Frontend',
      empresa: 'Tech Solutions Inc.',
      descripcion: 'Desarrollo de aplicaciones web con React y Next.js',
      fechaInicio: '2023-06-01',
      esTrabajoActual: true
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      nombre: 'Sistema de Gestión de Empleabilidad',
      descripcion: 'Plataforma web para conectar estudiantes con empresas',
      tecnologias: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      enlace: 'https://github.com/usuario/proyecto'
    }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: '1',
      nombre: 'Desarrollo Web Fullstack',
      institucion: 'Platzi',
      fechaObtencion: '2023-12-15',
      enlace: 'https://platzi.com/certificado'
    }
  ]);

  const handleDeleteExperience = (experienceId: string) => {
    setExperiences(experiences.filter(exp => exp.id !== experienceId));
    toast.success('Experiencia eliminada');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(proj => proj.id !== projectId));
    toast.success('Proyecto eliminado');
  };

  const handleDeleteCertification = (certificationId: string) => {
    setCertifications(certifications.filter(cert => cert.id !== certificationId));
    toast.success('Certificación eliminada');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mi Portafolio</h1>
            <p className="text-blue-100">
              Muestra tus logros, experiencias y proyectos
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Experiencia Laboral */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Experiencia Laboral</h2>
          <Link 
            href="/dashboard/estudiante/portfolio/experience/create"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Experiencia</span>
          </Link>
        </div>
        <div className="space-y-4">
          {experiences.map(experience => (
            <div 
              key={experience.id} 
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {experience.titulo}
                </h3>
                <p className="text-sm text-gray-600">
                  {experience.empresa} 
                  {experience.esTrabajoActual ? ' (Actual)' : ''}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {experience.descripcion}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {experience.fechaInicio} - {experience.esTrabajoActual ? 'Presente' : experience.fechaFin}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/dashboard/estudiante/portfolio/experience/${experience.id}/edit`}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => handleDeleteExperience(experience.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proyectos */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Proyectos</h2>
          <Link 
            href="/dashboard/estudiante/portfolio/projects/create"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Proyecto</span>
          </Link>
        </div>
        <div className="space-y-4">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.nombre}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {project.descripcion}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  {project.tecnologias.map(tech => (
                    <span 
                      key={tech} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.enlace && (
                  <a 
                    href={project.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Ver Proyecto</span>
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/dashboard/estudiante/portfolio/projects/${project.id}/edit`}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificaciones */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Certificaciones</h2>
          <Link 
            href="/dashboard/estudiante/portfolio/certifications/create"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Certificación</span>
          </Link>
        </div>
        <div className="space-y-4">
          {certifications.map(certification => (
            <div 
              key={certification.id} 
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {certification.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  {certification.institucion}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Obtenida: {certification.fechaObtencion}
                </p>
                {certification.enlace && (
                  <a 
                    href={certification.enlace} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Verificar Certificación</span>
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/dashboard/estudiante/portfolio/certifications/${certification.id}/edit`}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => handleDeleteCertification(certification.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
