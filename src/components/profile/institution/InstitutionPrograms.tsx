import React from 'react';

interface InstitutionProgramsProps {
  // Ejemplo de propiedades que podrías necesitar
  // programs?: Array<{
  //   id: string;
  //   name: string;
  //   description?: string;
  // }>;
  [key: string]: unknown;
}

const InstitutionPrograms: React.FC<InstitutionProgramsProps> = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Programas Académicos</h2>
      <div className="space-y-4">
        <p>Aquí se mostrarán los programas académicos de la institución.</p>
        {/* Agrega más contenido según sea necesario */}
      </div>
    </div>
  );
};

export default InstitutionPrograms;
