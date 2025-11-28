import React from 'react';

interface InstitutionOverviewProps {
  // Ejemplo de propiedades que podrías necesitar
  // Descomenta y personaliza según sea necesario
  // id: string;
  // name: string;
  // description?: string;
  [key: string]: unknown; // Permite propiedades adicionales
}

const InstitutionOverview: React.FC<InstitutionOverviewProps> = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Resumen de la Institución</h2>
      <div className="space-y-4">
        <p>Aquí irá el resumen de la institución.</p>
        {/* Agrega más contenido según sea necesario */}
      </div>
    </div>
  );
};

export default InstitutionOverview;
