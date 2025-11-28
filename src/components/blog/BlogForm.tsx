'use client';

import { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Save
} from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { CreatePostDTO, Post } from '@/types/social.types';

type PostFormValues = CreatePostDTO & { id?: string };

interface BlogFormProps {
  onSubmit: (data: PostFormValues, images: File[], videos: File[]) => void;
  register: UseFormRegister<PostFormValues>;
  errors: FieldErrors<PostFormValues>;
  isEditing?: boolean;
  initialData?: Post;
  rhfHandleSubmit: UseFormHandleSubmit<PostFormValues>;
}

export default function BlogForm({
  onSubmit,
  register,
  errors,
  isEditing = false,
  initialData,
  rhfHandleSubmit
}: BlogFormProps) {
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setImagenes(fileList);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setVideos(fileList);
    }
  };

  const onFormSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data, imagenes, videos);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={rhfHandleSubmit(onFormSubmit)} 
      className="bg-white rounded-xl shadow-lg p-6 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contenido */}
        <div className="col-span-full">
          <label className="block text-gray-700 font-semibold mb-2">
            <FileText className="inline-block w-5 h-5 mr-2 text-green-500" />
            Contenido del Post
          </label>
          <textarea
            {...register('contenido')}
            defaultValue={initialData?.contenido}
            placeholder="Escribe tu contenido aquí..."
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-y ${
              errors.contenido ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contenido && (
            <p className="text-red-500 text-sm mt-1">{errors.contenido.message}</p>
          )}
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <ImageIcon className="inline-block w-5 h-5 mr-2 text-purple-500" />
            Imágenes (máx. 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {imagenes.length > 0 && (
            <div className="mt-2 flex space-x-2">
              {imagenes.map((img, index) => (
                <span 
                  key={index} 
                  className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
                >
                  {img.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            <Video className="inline-block w-5 h-5 mr-2 text-red-500" />
            Videos (máx. 2)
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {videos.length > 0 && (
            <div className="mt-2 flex space-x-2">
              {videos.map((vid, index) => (
                <span 
                  key={index} 
                  className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs"
                >
                  {vid.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Privacidad */}
        <div className="col-span-full flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('privado')}
            defaultChecked={initialData?.privado || false}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-gray-700 font-semibold">
            Marcar como privado
          </label>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center text-white px-6 py-2 rounded-lg transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Save className="w-5 h-5 mr-2" />
          {isEditing ? 'Actualizar Post' : 'Crear Post'}
        </button>
      </div>
    </form>
  );
}
