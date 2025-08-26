/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette based on logo
        'beige': {
          50: '#FDFBF7',
          100: '#F9F5ED',
          200: '#F5E8D2',
          300: '#E8D4B0',
          400: '#D4C08A',
          500: '#C0AC64',
          600: '#A8984A',
          700: '#8A7A3B',
          800: '#6B5F2E',
          900: '#4A4221',
        },
        'olive': {
          50: '#F7F8F4',
          100: '#EEF1E8',
          200: '#DDE3D1',
          300: '#C8D1B5',
          400: '#A9B88A',
          500: '#8A9A6B',
          600: '#6F7D55',
          700: '#5A6444',
          800: '#464F36',
          900: '#2F3524',
        },
        'warm-brown': {
          50: '#F8F6F4',
          100: '#F0EBE6',
          200: '#E1D4C8',
          300: '#CBB8A3',
          400: '#B0967A',
          500: '#8F7A5C',
          600: '#6B4C3B',
          700: '#573C2E',
          800: '#452F24',
          900: '#2E1F18',
        },
        'dark-gray': {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1A1A1A',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'Nunito', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'large': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}

