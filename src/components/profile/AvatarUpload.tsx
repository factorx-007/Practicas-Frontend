'use client';

import { useRef } from 'react';
import { UserProfile, StudentProfile, CompanyProfile } from '@/types/user';
import { useUploadAvatar } from '@/hooks/useProfile';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  profile: (UserProfile | StudentProfile | CompanyProfile | (UserProfile & { empresa?: CompanyProfile })) | null;
}

export default function AvatarUpload({ profile }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, isUploading, error } = useUploadAvatar();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo debe ser menor a 5MB');
        return;
      }

      uploadAvatar(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title={profile ? "Cambiar foto de perfil" : "Subir foto de perfil"}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-600 mt-2">Error al subir la imagen</p>
      )}
    </>
  );
}