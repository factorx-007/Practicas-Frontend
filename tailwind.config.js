/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tecsup: {
          red: {
            DEFAULT: '#E30613',
            dark: '#B30510',
            light: '#FF1F2D',
          },
          gray: {
            dark: '#2D2D2D',
            medium: '#6B6B6B',
            light: '#F5F5F5',
          },
          blue: {
            DEFAULT: '#003D7A',
            light: '#0066CC',
          },
          orange: '#FF6B35',
          green: '#00B74A',
        }
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        md: '0 4px 6px var(--tw-shadow-color)',
        lg: '0 8px 12px var(--tw-shadow-color)',
      },
      boxShadow: {
        'tecsup-red': '0 10px 40px -10px rgba(227, 6, 19, 0.5)',
        'tecsup-blue': '0 10px 40px -10px rgba(0, 61, 122, 0.5)',
      }
    }
  },
  plugins: [],
};
