import React from 'react';

interface InstitutionStudentsProps {
  // Ejemplo de propiedades que podrías necesitar
  // students?: Array<{
  //   id: string;
  //   name: string;
  //   email: string;
  //   program?: string;
  // }>;
  [key: string]: unknown;
}

const InstitutionStudents: React.FC<InstitutionStudentsProps> = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Estudiantes</h2>
      <div className="space-y-4">
        <p>Aquí se mostrará la lista de estudiantes de la institución.</p>
        {/* Agrega más contenido según sea necesario */}
      </div>
    </div>
  );
};

export default InstitutionStudents;
