'use client';

import { useState } from 'react';
import { Plus, Award, Calendar, Building, ExternalLink, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { StudentProfile, Certificacion } from '@/types/user';
import MinimalButton from '@/components/ui/MinimalButton';
import CertificationModal from '../modals/CertificationModal';
import { CertificacionInput } from '@/types/profile.types';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface StudentCertificationsProps {
  profile: StudentProfile | null;
}

const TIPO_LABELS: Record<string, string> = {
  PROFESIONAL: 'Profesional',
  TECNICA: 'Técnica',
  IDIOMAS: 'Idiomas',
  CURSO: 'Curso',
  OTRO: 'Otro',
};

export default function StudentCertifications({ profile: initialProfile }: StudentCertificationsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certificacion | null>(null);
  const [certificationList, setCertificationList] = useState<Certificacion[]>(
    initialProfile?.certificaciones || [
      {
        id: '1',
        titulo: 'AWS Certified Solutions Architect – Associate',
        emisor: 'Amazon Web Services (AWS)',
        tipo: 'PROFESIONAL',
        fecha_emision: '2024-02-15T00:00:00.000Z',
        fecha_expiracion: '2027-02-15T00:00:00.000Z',
        credencial_id: 'AWS-CSA-2024-12345',
        url_verificacion: 'https://aws.amazon.com/verification/12345',
      },
      {
        id: '2',
        titulo: 'Google Cloud Professional Developer',
        emisor: 'Google Cloud',
        tipo: 'PROFESIONAL',
        fecha_emision: '2023-11-20T00:00:00.000Z',
        fecha_expiracion: '2025-11-20T00:00:00.000Z',
        credencial_id: 'GCP-PD-2023-67890',
        url_verificacion: 'https://cloud.google.com/certification/verify/67890',
      },
      {
        id: '3',
        titulo: 'React - The Complete Guide',
        emisor: 'Udemy',
        tipo: 'CURSO',
        fecha_emision: '2023-08-10T00:00:00.000Z',
        fecha_expiracion: null,
        credencial_id: 'UC-REACT-2023',
        url_verificacion: null,
      },
    ]
  );

  const getStatus = (cert: Certificacion): 'activo' | 'por-vencer' | 'vencido' | 'sin-expiracion' => {
    if (!cert.fecha_expiracion) return 'sin-expiracion';

    const now = new Date();
    const expiry = new Date(cert.fecha_expiracion);
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'vencido';
    if (daysUntilExpiry < 90) return 'por-vencer'; // Próximo a vencer en menos de 3 meses
    return 'activo';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'por-vencer':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      case 'sin-expiracion':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'activo':
        return 'Activo';
      case 'por-vencer':
        return 'Por vencer';
      case 'vencido':
        return 'Vencido';
      case 'sin-expiracion':
        return 'Sin expiración';
      default:
        return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'activo':
        return <CheckCircle className="w-4 h-4" />;
      case 'por-vencer':
      case 'vencido':
        return <Clock className="w-4 h-4" />;
      case 'sin-expiracion':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSaveCertification = async (data: CertificacionInput) => {
    try {
      if (editingCertification) {
        // Update existing certification
        await UsersService.updateStudentProfile({
          certificaciones: {
            update: [
              {
                where: { id: editingCertification.id },
                data,
              },
            ],
          },
        });

        setCertificationList(
          certificationList.map((cert) =>
            cert.id === editingCertification.id ? { ...cert, ...data } : cert
          )
        );

        toast.success('Certificación actualizada');
      } else {
        // Create new certification
        const newCert = {
          id: Date.now().toString(), // Asegurar que el id se genera antes de enviar
          ...data,
        };

        await UsersService.updateStudentProfile({
          certificaciones: {
            create: [newCert], // Pasar el objeto completo con el id generado
          },
        });

        setCertificationList([...certificationList, newCert]);
        toast.success('Certificación agregada');
      }

      setIsModalOpen(false);
      setEditingCertification(null);
    } catch (error) {
      console.error('Error saving certification:', error);
      toast.error('Error al guardar la certificación');
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta certificación?')) return;

    try {
      await UsersService.updateStudentProfile({
        certificaciones: {
          delete: [{ id }],
        },
      });

      setCertificationList(certificationList.filter((cert) => cert.id !== id));
      toast.success('Certificación eliminada');
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error('Error al eliminar la certificación');
    }
  };

  const handleEdit = (cert: Certificacion) => {
    setEditingCertification(cert);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingCertification(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certificaciones</h2>
          <p className="text-gray-600 mt-1">
            {certificationList.length} certificación{certificationList.length !== 1 ? 'es' : ''} registrada{certificationList.length !== 1 ? 's' : ''}
          </p>
        </div>
        <MinimalButton 
          onClick={handleNew} 
          icon={<Plus className="w-5 h-5" />}
          className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span className="font-medium">Agregar Certificación</span>
        </MinimalButton>
      </div>

      {/* Certifications List */}
      <div className="space-y-5">
        {certificationList.length > 0 ? (
          certificationList.map((cert) => {
            const status = getStatus(cert);
            return (
              <div
                key={cert.id}
                className="bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{cert.titulo}</h3>
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(status)}`}
                        >
                          {getStatusIcon(status)}
                          {getStatusLabel(status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{cert.emisor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors"
                      aria-label="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCertification(cert.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Emitido: {formatDate(cert.fecha_emision)}</span>
                  </div>
                  {cert.fecha_expiracion && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Vence: {formatDate(cert.fecha_expiracion)}</span>
                    </div>
                  )}
                </div>

                {/* Type and Credential Info */}
                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {TIPO_LABELS[cert.tipo]}
                  </span>
                  
                  {cert.credencial_id && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">ID de credencial:</span> {cert.credencial_id}
                    </div>
                  )}
                </div>

                {/* Verification Link */}
                {cert.url_verificacion && (
                  <div className="pt-4 border-t border-gray-100">
                    <a
                      href={cert.url_verificacion}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium"
                    >
                      <span>Verificar certificación</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay certificaciones registradas
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Agrega tus certificaciones profesionales para destacar tus competencias validadas
            </p>
            <MinimalButton 
              onClick={handleNew} 
              icon={<Plus className="w-5 h-5" />}
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <span className="font-medium">Agregar Primera Certificación</span>
            </MinimalButton>
          </div>
        )}
      </div>

      {/* Modal */}
      <CertificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCertification(null);
        }}
        onSave={handleSaveCertification}
        currentData={editingCertification}
      />
    </div>
  );
}