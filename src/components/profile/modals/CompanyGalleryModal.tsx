'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MinimalModal from '@/components/ui/MinimalModal';
import MinimalButton from '@/components/ui/MinimalButton';
import { Upload, X, Loader2 } from 'lucide-react';
import UsersService from '@/services/users.service';
import { toast } from 'react-hot-toast';

interface CompanyGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGallery: string[];
  onSaveSuccess: () => void;
}

export default function CompanyGalleryModal({
  isOpen,
  onClose,
  currentGallery,
  onSaveSuccess,
}: CompanyGalleryModalProps) {
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setGallery(currentGallery);
    }
  }, [isOpen, currentGallery]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    setUploading(true);
    try {
      const response = await UsersService.uploadGalleryImage(file);
      if (response.success && response.data) {
        setGallery([...gallery, response.data.imageUrl]);
        toast.success('Imagen agregada exitosamente');
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const response = await UsersService.deleteGalleryImage(imageUrl);
      if (response.success) {
        setGallery(gallery.filter(url => url !== imageUrl));
        toast.success('Imagen eliminada exitosamente');
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  return (
    <MinimalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestionar Galería"
      size="lg"
      footer={
        <MinimalButton variant="ghost" onClick={onClose}>
          Cerrar
        </MinimalButton>
      }
    >
      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="gallery-upload"
          />
          <label
            htmlFor="gallery-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-2" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-600">
              {uploading ? 'Subiendo...' : 'Haz clic para subir una imagen'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF hasta 5MB
            </p>
          </label>
        </div>

        {/* Gallery Grid */}
        {gallery.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <Image
                  src={imageUrl}
                  alt={`Galería ${index + 1}`}
                  width={200}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeleteImage(imageUrl)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay imágenes en la galería</p>
            <p className="text-sm mt-1">Sube tu primera imagen para comenzar</p>
          </div>
        )}
      </div>
    </MinimalModal>
  );
}
