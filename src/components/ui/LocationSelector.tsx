'use client';

import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface LocationData {
  departamentos: { id: string; nombre: string; provincias: Province[] }[];
}

interface Province {
  id: string;
  nombre: string;
  distritos: District[];
}

interface District {
  id: string;
  nombre: string;
}

interface LocationSelectorProps {
  value?: string;
  onChange: (location: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

// Datos estáticos de las principales ubicaciones de Perú
const locationData: LocationData = {
  departamentos: [
    {
      id: '01',
      nombre: 'Lima',
      provincias: [
        {
          id: '01',
          nombre: 'Lima',
          distritos: [
            { id: '01', nombre: 'Lima' },
            { id: '02', nombre: 'Miraflores' },
            { id: '03', nombre: 'San Isidro' },
            { id: '04', nombre: 'Surco' },
            { id: '05', nombre: 'La Molina' },
            { id: '06', nombre: 'San Borja' },
            { id: '07', nombre: 'Lince' },
            { id: '08', nombre: 'Jesús María' },
            { id: '09', nombre: 'Magdalena' },
            { id: '10', nombre: 'Pueblo Libre' },
            { id: '11', nombre: 'San Miguel' },
            { id: '12', nombre: 'Breña' },
            { id: '13', nombre: 'La Victoria' },
            { id: '14', nombre: 'Cercado de Lima' },
            { id: '15', nombre: 'Barranco' },
            { id: '16', nombre: 'Chorrillos' },
            { id: '17', nombre: 'Villa El Salvador' },
            { id: '18', nombre: 'San Juan de Miraflores' },
            { id: '19', nombre: 'Villa María del Triunfo' },
            { id: '20', nombre: 'Los Olivos' },
            { id: '21', nombre: 'Independencia' },
            { id: '22', nombre: 'San Martín de Porres' },
            { id: '23', nombre: 'Comas' },
            { id: '24', nombre: 'Carabayllo' },
            { id: '25', nombre: 'Puente Piedra' },
            { id: '26', nombre: 'Ate' },
            { id: '27', nombre: 'El Agustino' },
            { id: '28', nombre: 'Santa Anita' },
            { id: '29', nombre: 'San Luis' },
            { id: '30', nombre: 'Callao' }
          ]
        }
      ]
    },
    {
      id: '02',
      nombre: 'Arequipa',
      provincias: [
        {
          id: '01',
          nombre: 'Arequipa',
          distritos: [
            { id: '01', nombre: 'Arequipa' },
            { id: '02', nombre: 'Cayma' },
            { id: '03', nombre: 'Cerro Colorado' },
            { id: '04', nombre: 'Characato' },
            { id: '05', nombre: 'Chiguata' },
            { id: '06', nombre: 'Jacobo Hunter' },
            { id: '07', nombre: 'José Luis Bustamante y Rivero' },
            { id: '08', nombre: 'Mariano Melgar' },
            { id: '09', nombre: 'Miraflores' },
            { id: '10', nombre: 'Mollebaya' },
            { id: '11', nombre: 'Paucarpata' },
            { id: '12', nombre: 'Pocsi' },
            { id: '13', nombre: 'Polobaya' },
            { id: '14', nombre: 'Quequeña' },
            { id: '15', nombre: 'Sabandia' },
            { id: '16', nombre: 'Sachaca' },
            { id: '17', nombre: 'San Juan de Siguas' },
            { id: '18', nombre: 'San Juan de Tarucani' },
            { id: '19', nombre: 'Santa Isabel de Siguas' },
            { id: '20', nombre: 'Santa Rita de Siguas' },
            { id: '21', nombre: 'Socabaya' },
            { id: '22', nombre: 'Tiabaya' },
            { id: '23', nombre: 'Uchumayo' },
            { id: '24', nombre: 'Vitor' },
            { id: '25', nombre: 'Yanahuara' },
            { id: '26', nombre: 'Yarabamba' },
            { id: '27', nombre: 'Yura' },
            { id: '28', nombre: 'Alto Selva Alegre' }
          ]
        }
      ]
    },
    {
      id: '03',
      nombre: 'La Libertad',
      provincias: [
        {
          id: '01',
          nombre: 'Trujillo',
          distritos: [
            { id: '01', nombre: 'Trujillo' },
            { id: '02', nombre: 'El Porvenir' },
            { id: '03', nombre: 'Florencia de Mora' },
            { id: '04', nombre: 'Huanchaco' },
            { id: '05', nombre: 'La Esperanza' },
            { id: '06', nombre: 'Laredo' },
            { id: '07', nombre: 'Moche' },
            { id: '08', nombre: 'Poroto' },
            { id: '09', nombre: 'Salaverry' },
            { id: '10', nombre: 'Simbal' },
            { id: '11', nombre: 'Victor Larco Herrera' }
          ]
        }
      ]
    },
    {
      id: '04',
      nombre: 'Piura',
      provincias: [
        {
          id: '01',
          nombre: 'Piura',
          distritos: [
            { id: '01', nombre: 'Piura' },
            { id: '02', nombre: 'Castilla' },
            { id: '03', nombre: 'Catacaos' },
            { id: '04', nombre: 'Cura Mori' },
            { id: '05', nombre: 'El Tallan' },
            { id: '06', nombre: 'La Arena' },
            { id: '07', nombre: 'La Unión' },
            { id: '08', nombre: 'Las Lomas' },
            { id: '09', nombre: 'Tambo Grande' }
          ]
        }
      ]
    },
    {
      id: '05',
      nombre: 'Cusco',
      provincias: [
        {
          id: '01',
          nombre: 'Cusco',
          distritos: [
            { id: '01', nombre: 'Cusco' },
            { id: '02', nombre: 'Ccorca' },
            { id: '03', nombre: 'Poroy' },
            { id: '04', nombre: 'San Jerónimo' },
            { id: '05', nombre: 'San Sebastián' },
            { id: '06', nombre: 'Santiago' },
            { id: '07', nombre: 'Saylla' },
            { id: '08', nombre: 'Wanchaq' }
          ]
        }
      ]
    },
    {
      id: '99',
      nombre: 'Otras ubicaciones',
      provincias: [
        {
          id: '01',
          nombre: 'Opciones especiales',
          distritos: [
            { id: '01', nombre: 'Remoto - Perú' },
            { id: '02', nombre: 'Remoto - Internacional' },
            { id: '03', nombre: 'Híbrido - Nacional' },
            { id: '04', nombre: 'Múltiples ubicaciones' }
          ]
        }
      ]
    }
  ]
};

export default function LocationSelector({
  value = '',
  onChange,
  error,
  className = ''
}: LocationSelectorProps) {
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLocation, setCustomLocation] = useState('');

  // Inicializar valores basados en el prop value
  useEffect(() => {
    if (value) {
      // Si es una ubicación personalizada (no encontrada en nuestros datos)
      const isStandardLocation = locationData.departamentos.some(dep =>
        dep.provincias.some(prov =>
          prov.distritos.some(dist =>
            `${dist.nombre}, ${prov.nombre}, ${dep.nombre}` === value ||
            dist.nombre === value
          )
        )
      );

      if (!isStandardLocation) {
        setShowCustomInput(true);
        setCustomLocation(value);
      }
    }
  }, [value]);

  const handleDepartamentoChange = (depId: string) => {
    setSelectedDepartamento(depId);
    setSelectedProvincia('');
    setSelectedDistrito('');

    if (depId === '99') {
      setShowCustomInput(false);
    }
  };

  const handleProvinciaChange = (provId: string) => {
    setSelectedProvincia(provId);
    setSelectedDistrito('');
  };

  const handleDistritoChange = (distId: string) => {
    setSelectedDistrito(distId);

    const departamento = locationData.departamentos.find(d => d.id === selectedDepartamento);
    const provincia = departamento?.provincias.find(p => p.id === selectedProvincia);
    const distrito = provincia?.distritos.find(d => d.id === distId);

    if (distrito && provincia && departamento) {
      // Para ubicaciones especiales como "Remoto", solo usar el nombre del distrito
      if (departamento.id === '99') {
        onChange(distrito.nombre);
      } else {
        onChange(`${distrito.nombre}, ${provincia.nombre}, ${departamento.nombre}`);
      }
    }
  };

  const handleCustomLocationSubmit = () => {
    if (customLocation.trim()) {
      onChange(customLocation.trim());
      setShowCustomInput(false);
    }
  };

  const selectedDepartamentoData = locationData.departamentos.find(d => d.id === selectedDepartamento);
  const selectedProvinciaData = selectedDepartamentoData?.provincias.find(p => p.id === selectedProvincia);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="flex items-center text-sm lg:text-base font-semibold text-gray-900">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
        Ubicación
        <span className="text-red-500 ml-1">*</span>
      </label>

      {!showCustomInput ? (
        <div className="space-y-3">
          {/* Selector de Departamento */}
          <div className="relative">
            <select
              value={selectedDepartamento}
              onChange={(e) => handleDepartamentoChange(e.target.value)}
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona departamento/región</option>
              {locationData.departamentos.map(dep => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Selector de Provincia */}
          {selectedDepartamento && selectedDepartamento !== '99' && (
            <div className="relative">
              <select
                value={selectedProvincia}
                onChange={(e) => handleProvinciaChange(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base"
              >
                <option value="">Selecciona provincia</option>
                {selectedDepartamentoData?.provincias.map(prov => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          )}

          {/* Selector de Distrito */}
          {selectedProvincia && (
            <div className="relative">
              <select
                value={selectedDistrito}
                onChange={(e) => handleDistritoChange(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base"
              >
                <option value="">
                  {selectedDepartamento === '99' ? 'Selecciona modalidad' : 'Selecciona distrito'}
                </option>
                {selectedProvinciaData?.distritos.map(dist => (
                  <option key={dist.id} value={dist.id}>
                    {dist.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          )}

          {/* Opción para ubicación personalizada */}
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            ¿No encuentras tu ubicación? Ingresa manualmente
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Ingresa ubicación personalizada"
              className="flex-1 px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              onKeyDown={(e) => e.key === 'Enter' && handleCustomLocationSubmit()}
            />
            <button
              type="button"
              onClick={handleCustomLocationSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
            >
              OK
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              setCustomLocation('');
            }}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            ← Volver a selector estándar
          </button>
        </div>
      )}

      {/* Ubicación seleccionada */}
      {value && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center text-sm text-blue-800">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-medium">Ubicación seleccionada:</span>
            <span className="ml-2">{value}</span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs lg:text-sm">{error}</p>
      )}

      <p className="text-xs lg:text-sm text-gray-500">
        Selecciona la ubicación donde se realizará el trabajo. Para trabajo remoto, elige &quot;Otras ubicaciones&quot;.
      </p>
    </div>
  );
}