'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'ProTalent',
    maintenanceMode: false,
    maxOfferApplications: 5,
    emailNotifications: true,
    privacyPolicy: '',
    termsOfService: ''
  });

  const handleSettingChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    try {
      // Simular guardado de configuraciones
      console.log('Configuraciones guardadas:', settings);
      toast.success('Configuraciones guardadas exitosamente');
    } catch {
      toast.error('Error al guardar configuraciones');
    }
  };

  const handleResetToDefaults = () => {
    setSettings({
      platformName: 'ProTalent',
      maintenanceMode: false,
      maxOfferApplications: 5,
      emailNotifications: true,
      privacyPolicy: '',
      termsOfService: ''
    });
    toast.info('Configuraciones restablecidas a valores predeterminados');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Configuraciones de Plataforma</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuraciones Generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre de Plataforma
              </label>
              <input 
                type="text"
                value={settings.platformName}
                onChange={(e) => handleSettingChange('platformName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="block text-sm font-medium text-gray-700">
                Modo Mantenimiento
              </label>
              <input 
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Máximo de Solicitudes por Oferta
              </label>
              <input 
                type="number"
                value={settings.maxOfferApplications}
                onChange={(e) => handleSettingChange('maxOfferApplications', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="block text-sm font-medium text-gray-700">
                Notificaciones por Email
              </label>
              <input 
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Legales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Política de Privacidad
              </label>
              <textarea 
                value={settings.privacyPolicy}
                onChange={(e) => handleSettingChange('privacyPolicy', e.target.value)}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Términos de Servicio
              </label>
              <textarea 
                value={settings.termsOfService}
                onChange={(e) => handleSettingChange('termsOfService', e.target.value)}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" /> Guardar Configuraciones
        </Button>
        <Button 
          variant="outline"
          onClick={handleResetToDefaults}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Restablecer Predeterminados
        </Button>
      </div>
    </div>
  );
}
