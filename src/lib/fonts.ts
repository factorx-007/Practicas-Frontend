import { Inter, Poppins, Playfair_Display } from 'next/font/google';

/**
 * Configuración centralizada de fuentes de Google Fonts
 * Optimizada para evitar problemas con Turbopack
 */
export const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif']
});

// Exportar todas las fuentes como un objeto para facilitar el uso
export const fonts = {
  inter,
  poppins,
  playfair
};

// Clases CSS para aplicar las fuentes
export const fontClasses = `${inter.variable} ${poppins.variable} ${playfair.variable}`;
