'use client';

import type { UserProfile, StudentProfile, Certificacion } from '@/types/user';
import { Award, Plus, Edit, Trash2, ExternalLink, CheckCircle } from 'lucide-react';

interface UserWithStudentProfile extends UserProfile {
  perfilEstudiante?: {
    certificaciones?: Certificacion[];
  };
}

type ProfileWithCertifications = StudentProfile | UserWithStudentProfile | null;

interface CertificationsSectionProps {
  profile: ProfileWithCertifications;
}

export default function CertificationsSection({ profile }: CertificationsSectionProps) {
  // Type guard to check if profile has certificaciones
  const certifications = (() => {
    if (!profile) return [];
    
    // Handle StudentProfile
    if ('certificaciones' in profile) {
      return profile.certificaciones || [];
    }
    
    // Handle UserProfile with perfilEstudiante
    if ('perfilEstudiante' in profile && profile.perfilEstudiante?.certificaciones) {
      return profile.perfilEstudiante.certificaciones;
    }
    
    return [];
  })();

  const isExpired = (fechaVencimiento: string | null | undefined): boolean => {
    if (!fechaVencimiento) return false;
    try {
      return new Date(fechaVencimiento) < new Date();
    } catch (e) {
      console.error('Error parsing date:', e);
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Certificaciones</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Agregar Certificación</span>
        </button>
      </div>

      {/* Certifications List */}
      {certifications.length > 0 ? (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{cert.titulo}</h3>
                      {!isExpired(cert.fecha_expiracion) && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {isExpired(cert.fecha_expiracion) && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Expirada
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 font-medium mb-2">{cert.emisor}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Obtenida: {new Date(cert.fecha_emision).toLocaleDateString()}</p>
                      {cert.fecha_expiracion && (
                        <p className={isExpired(cert.fecha_expiracion) ? 'text-red-600' : ''}>
                          Válida hasta: {new Date(cert.fecha_expiracion).toLocaleDateString()}
                        </p>
                      )}
                      {cert.credencial_id && (
                        <p>ID de credencial: <span className="font-mono text-xs">{cert.credencial_id}</span></p>
                      )}
                    </div>

                    {/* Skills - Not available in the Certificacion interface */}

                    {/* Verification Link */}
                    {cert.url_verificacion && (
                      <div className="mt-3">
                        <a
                          href={cert.url_verificacion}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Verificar certificación</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay certificaciones registradas</h3>
          <p className="text-gray-600 mb-4">Agrega tus certificaciones profesionales y cursos completados</p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primera Certificación
          </button>
        </div>
      )}
    </div>
  );
}