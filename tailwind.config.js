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
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: 'var(--color-bg)',
        card: 'var(--color-card)',
        'dark-card': '#1c1c1e',
        'sidebar-bg': '#151b23',
        'sidebar-active': '#102a25',
        'sidebar-hover': '#1e2530',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        divider: 'var(--color-divider)',
        'divider-strong': 'var(--color-divider-strong)',
        'hover-bg': 'var(--color-divider)',
        accent: {
          primary: '#0f9d78',
          'primary-hover': '#0c8263',
          orange: '#f97316',
          'orange-light': '#ffedd5',
          blue: '#3b82f6',
          'blue-light': '#eff6ff',
          purple: '#a855f7',
          'purple-light': '#f3e8ff',
        },
        success: '#10b981',
        error: '#ef4444',
      },
      boxShadow: {
        card: '0px 4px 20px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
