'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  Sun, 
  Moon, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';



// Definir tipos de temas
type Theme = 'light' | 'dark';

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Estado para el tema
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Hook de autenticación
  const { } = useAuth();
  const logoutMutation = useLogout();
  const pathname = usePathname();

  // Efecto para aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Guardar preferencia de tema
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Alternar tema
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Menú de navegación
  const menuItems = [
    { 
      href: '/admin/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      active: pathname === '/admin/dashboard'
    },
    { 
      href: '/admin/users', 
      icon: Users, 
      label: 'Usuarios',
      active: pathname === '/admin/users'
    },
    { 
      href: '/admin/offers', 
      icon: Briefcase, 
      label: 'Ofertas',
      active: pathname === '/admin/offers'
    },
    { 
      href: '/admin/settings', 
      icon: Settings, 
      label: 'Configuración',
      active: pathname === '/admin/settings'
    }
  ];

  // Manejar logout
  const handleLogout = () => {
    logoutMutation.mutate();
    toast.success('Sesión cerrada');
  };

  return (
    <div className={cn(
      'min-h-screen flex bg-background text-foreground',
      'transition-colors duration-300 ease-in-out',
      'dark:bg-gray-900 dark:text-gray-100',
      'selection:bg-primary selection:text-primary-foreground'
    )}>
      {/* Sidebar Futurista */}
      <aside className={cn(
        'w-64 p-6 border-r border-border',
        'bg-card text-card-foreground',
        'dark:bg-gray-800 dark:border-gray-700',
        'transition-all duration-300 ease-in-out',
        'flex flex-col justify-between'
      )}>
        {/* Logo y Título */}
        <div>
          <h1 className={cn(
            'text-3xl font-bold mb-8 text-primary',
            'bg-gradient-to-r from-primary to-secondary',
            'bg-clip-text text-transparent',
            'dark:from-blue-400 dark:to-purple-600'
          )}>
            ProTalent
          </h1>

          {/* Menú de Navegación */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center p-3 rounded-lg transition-all duration-200',
                  'hover:bg-accent hover:text-accent-foreground',
                  item.active 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer del Sidebar */}
        <div className="space-y-4">
          {/* Selector de Tema */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme}
            className="w-full"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="ml-2">
              {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
          </Button>

          {/* Botón de Logout */}
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className={cn(
        'flex-1 p-8 overflow-y-auto',
        'bg-background',
        'dark:bg-gray-900',
        'transition-colors duration-300 ease-in-out'
      )}>
        {/* Efecto de fondo futurista */}
        <div className={cn(
          'absolute inset-0 z-[-1]',
          'bg-gradient-to-br from-primary/10 to-secondary/10',
          'dark:from-primary/20 dark:to-secondary/20',
          'opacity-50 blur-3xl'
        )} />
        <QueryProvider>
          {children}
          <ToastProvider />
        </QueryProvider>
      </main>
    </div>
  );
}
