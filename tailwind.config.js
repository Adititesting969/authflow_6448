/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Updated to Pink Theme
        'primary': '#db2777', // pink-600
        'primary-50': '#fdf2f8', // pink-50
        'primary-100': '#fce7f3', // pink-100
        'primary-200': '#fbcfe8', // pink-200
        'primary-500': '#ec4899', // pink-500
        'primary-600': '#db2777', // pink-600
        'primary-700': '#be185d', // pink-700
        'primary-900': '#831843', // pink-900
        'primary-foreground': '#ffffff', // white

        // Secondary Colors
        'secondary': '#64748b', // slate-500
        'secondary-50': '#f8fafc', // slate-50
        'secondary-100': '#f1f5f9', // slate-100
        'secondary-200': '#e2e8f0', // slate-200
        'secondary-300': '#cbd5e1', // slate-300
        'secondary-400': '#94a3b8', // slate-400
        'secondary-600': '#475569', // slate-600
        'secondary-700': '#334155', // slate-700
        'secondary-800': '#1e293b', // slate-800
        'secondary-900': '#0f172a', // slate-900
        'secondary-foreground': '#ffffff', // white

        // Accent Colors - Complementary to pink
        'accent': '#8b5cf6', // violet-500
        'accent-50': '#f5f3ff', // violet-50
        'accent-100': '#ede9fe', // violet-100
        'accent-200': '#ddd6fe', // violet-200
        'accent-300': '#c4b5fd', // violet-300
        'accent-400': '#a78bfa', // violet-400
        'accent-600': '#7c3aed', // violet-600
        'accent-700': '#6d28d9', // violet-700
        'accent-800': '#5b21b6', // violet-800
        'accent-900': '#4c1d95', // violet-900
        'accent-foreground': '#ffffff', // white

        // Background Colors
        'background': '#ffffff', // white
        'surface': '#f8fafc', // slate-50
        'surface-hover': '#f1f5f9', // slate-100
        'surface-active': '#e2e8f0', // slate-200

        // Text Colors
        'text-primary': '#0f172a', // slate-900
        'text-secondary': '#475569', // slate-600
        'text-muted': '#64748b', // slate-500
        'text-disabled': '#94a3b8', // slate-400

        // Status Colors
        'success': '#059669', // emerald-600
        'success-50': '#ecfdf5', // emerald-50
        'success-100': '#d1fae5', // emerald-100
        'success-200': '#a7f3d0', // emerald-200
        'success-500': '#10b981', // emerald-500
        'success-700': '#047857', // emerald-700
        'success-foreground': '#ffffff', // white

        'warning': '#d97706', // amber-600
        'warning-50': '#fffbeb', // amber-50
        'warning-100': '#fef3c7', // amber-100
        'warning-200': '#fde68a', // amber-200
        'warning-500': '#f59e0b', // amber-500
        'warning-700': '#b45309', // amber-700
        'warning-foreground': '#ffffff', // white

        'error': '#dc2626', // red-600
        'error-50': '#fef2f2', // red-50
        'error-100': '#fee2e2', // red-100
        'error-200': '#fecaca', // red-200
        'error-500': '#ef4444', // red-500
        'error-700': '#b91c1c', // red-700
        'error-foreground': '#ffffff', // white

        // Border Colors
        'border': '#e2e8f0', // slate-200
        'border-hover': '#cbd5e1', // slate-300
        'border-focus': '#ec4899', // pink-500
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'default': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'default': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-16': 'calc(100vh - 4rem)',
        'screen-20': 'calc(100vh - 5rem)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}