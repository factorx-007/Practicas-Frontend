'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalInput from '@/components/ui/MinimalInput';
import MinimalTextarea from '@/components/ui/MinimalTextarea';
import MinimalButton from '@/components/ui/MinimalButton';
import { CompanyProfile, UserProfile } from '@/types/user';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: (UserProfile & { empresa?: CompanyProfile }) | CompanyProfile | null;
  onSaveSuccess: () => void;
}

const companyInfoSchema = z.object({
  nombre_empresa: z.string().min(1, 'El nombre de la empresa es requerido'),
  ruc: z.string().optional().nullable(),
  rubro: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  website: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  descripcion: z.string().optional().nullable(),
});

type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;

export default function CompanyInfoModal({
  isOpen,
  onClose,
  currentProfile,
  onSaveSuccess,
}: CompanyInfoModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      nombre_empresa: '',
      ruc: '',
      rubro: '',
      direccion: '',
      telefono: '',
      website: '',
      descripcion: '',
    },
  });

  useEffect(() => {
    if (isOpen && currentProfile) {
      // Extract company data correctly
      let companyData = null;
      
      // Check if currentProfile is CompanyProfile directly
      if ('nombre_empresa' in currentProfile) {
        companyData = currentProfile;
      } 
      // Check if currentProfile is UserProfile with empresa
      else if ('empresa' in currentProfile && currentProfile.empresa) {
        companyData = currentProfile.empresa;
      }
      
      console.log('CompanyInfoModal - currentProfile:', currentProfile);
      console.log('CompanyInfoModal - companyData:', companyData);
      
      if (companyData) {
        const formData = {
          nombre_empresa: companyData.nombre_empresa || '',
          ruc: companyData.ruc || '',
          rubro: companyData.rubro || '',
          direccion: companyData.direccion || '',
          telefono: companyData.telefono || '',
          website: companyData.website || '',
          descripcion: companyData.descripcion || '',
        };
        
        console.log('CompanyInfoModal - formData:', formData);
        reset(formData);
      }
    } else if (!isOpen) {
        reset(); // Limpiar formulario al cerrar
    }
  }, [isOpen, currentProfile, reset]);

  const onSubmit = async (data: CompanyInfoFormData) => {
    setLoading(true);
    try {
      const payload = {
        ruc: data.ruc || undefined,
        nombre_empresa: data.nombre_empresa,
        rubro: data.rubro || undefined,
        descripcion: data.descripcion || undefined,
        direccion: data.direccion || undefined,
        telefono: data.telefono || undefined,
        website: data.website || undefined,
      };

      await UsersService.updateCompanyProfile(payload);
      toast.success('Información de la empresa actualizada exitosamente');
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar la información de la empresa:', error);
      toast.error('Error al actualizar la información de la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Información de la Empresa"
      size="lg"
      footer={
        <>
          <MinimalButton variant="ghost" onClick={handleClose} disabled={loading}>
            Cancelar
          </MinimalButton>
          <MinimalButton onClick={handleSubmit(onSubmit)} loading={loading}>
            Guardar Cambios
          </MinimalButton>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <MinimalInput
          label="Nombre de la Empresa"
          {...register('nombre_empresa')}
          error={errors.nombre_empresa?.message}
          placeholder="Ej: ProTalent S.A.C."
          required
        />
        <MinimalInput
          label="RUC (Registro Único de Contribuyentes)"
          {...register('ruc')}
          error={errors.ruc?.message}
          placeholder="Ej: 20123456789"
        />
        <MinimalInput
          label="Rubro / Industria"
          {...register('rubro')}
          error={errors.rubro?.message}
          placeholder="Ej: Tecnología, Marketing, Educación"
        />
        <MinimalInput
          label="Dirección Principal"
          {...register('direccion')}
          error={errors.direccion?.message}
          placeholder="Ej: Av. Salaverry 123, San Isidro"
        />
        <MinimalInput
          label="Teléfono de Contacto"
          {...register('telefono')}
          error={errors.telefono?.message}
          placeholder="Ej: +51 987 654 321"
        />
        <MinimalInput
          label="Sitio Web"
          type="url"
          {...register('website')}
          error={errors.website?.message}
          placeholder="https://www.tuempresa.com"
        />
        <MinimalTextarea
          label="Descripción de la Empresa"
          {...register('descripcion')}
          error={errors.descripcion?.message}
          placeholder="Describe brevemente tu empresa, su misión, visión y valores..."
          rows={5}
        />
      </form>
    </MinimalModal>
  );
}

