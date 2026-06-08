/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        light: {
          primary: '#0D9488',
          secondary: '#6366F1',
          background: '#F8FAFC',
          surface: '#FFFFFF',
          text: '#1E293B',
          textSecondary: '#64748B',
          accent: '#14B8A6',
        },
        dark: {
          primary: '#F43F5E',
          secondary: '#A855F7',
          background: '#0F0F1A',
          surface: '#1A1A2E',
          text: '#F1F5F9',
          textSecondary: '#94A3B8',
          accent: '#EC4899',
        }
      },
    },
  },
  plugins: [],
}