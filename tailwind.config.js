/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // WCAG AAA Compliant Primary Blues
        primary: {
          50: '#f0f4f8',
          100: '#d6e1f0',
          200: '#b3c7e6',
          300: '#8aa8d8',
          400: '#6b8bc7',
          500: '#4d6db3',
          600: '#d4a574',  // Updated gold for better contrast
          700: '#2d3f7f',
          800: '#1f2c65',
          900: '#1a2846',  // New primary background
          950: '#0f1419',
        },
        // Deep navy background tones
        navy: {
          50: '#f2f3f7',
          100: '#e6e8ef',
          200: '#d0d4de',
          300: '#aeb6c7',
          400: '#8691a8',
          500: '#68758f',
          600: '#535e76',
          700: '#444c61',
          800: '#3a4052',
          900: '#1a1a2e', // Main background color from reference
          950: '#131220',
        },
        // Elegant gold/brass accent (main accent color)
        gold: {
          50: '#fefcf0',
          100: '#fdf6d8',
          200: '#fbebb0',
          300: '#f8dc7e',
          400: '#f5c842',
          500: '#f2b71e',
          600: '#d4af37', // Main gold color from reference
          700: '#b8941f', // Darker gold from reference
          800: '#967518',
          900: '#7a6019',
          950: '#46360b',
        },
        // Vintage bordeaux/wine colors inspired by jazz clubs
        bordeaux: {
          50: '#fdf2f3',
          100: '#fce7e8',
          200: '#f9d2d4',
          300: '#f4aeb1',
          400: '#ed7d82',
          500: '#e3535a',
          600: '#cc2a36', // Deep wine red
          700: '#a91e2a', // Rich bordeaux
          800: '#8b1e27',
          900: '#751f26',
          950: '#400b0f',
        },
        // Warm cream/beige tones for vintage feel
        cream: {
          50: '#fefefe',
          100: '#fefcf7',
          200: '#fdf7e8',
          300: '#fbf0d0',
          400: '#f7e4a6',
          500: '#f1d16e',
          600: '#e8bf42',
          700: '#d4a628', // Warm cream
          800: '#b08420',
          900: '#8f6b1e',
          950: '#523a0f',
        },
        // Vintage copper/bronze accents
        copper: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fad9be',
          300: '#f6bf91',
          400: '#f19b61',
          500: '#ed7d3a',
          600: '#de6421', // Vintage copper
          700: '#b84e18',
          800: '#934019',
          900: '#773618',
          950: '#401a0a',
        },
        // Neutral grays with blues undertone
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Status colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'], // Elegant serif for headings
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'monospace'],
        // Vintage & Art Deco inspired fonts
        vintage: ['Bebas Neue', 'Oswald', 'system-ui', 'sans-serif'], // Art Deco style headers
        jazz: ['Abril Fatface', 'Playfair Display', 'Georgia', 'serif'], // Jazz Age elegance
        retro: ['Righteous', 'Bebas Neue', 'system-ui', 'sans-serif'], // Retro signage style
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
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      spacing: {
        '6': '1.5rem',     // 24px - base grid unit
        '12': '3rem',      // 48px - 2x grid
        '18': '4.5rem',    // 72px - 3x grid
        '24': '6rem',      // 96px - 4x grid
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Elegant shadows inspired by reference design
        'elegant': '0 8px 25px rgba(0,0,0,0.3)',
        'elegant-lg': '0 20px 40px rgba(0,0,0,0.3)',
        'gold': '0 5px 15px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 8px 25px rgba(212, 175, 55, 0.4)',
        'gold-xl': '0 12px 30px rgba(212, 175, 55, 0.6)',
        'navy': '0 4px 6px -1px rgb(26 26 46 / 0.1), 0 2px 4px -2px rgb(26 26 46 / 0.1)',
        'navy-lg': '0 10px 15px -3px rgb(26 26 46 / 0.1), 0 4px 6px -4px rgb(26 26 46 / 0.1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        // Elegant animations inspired by reference design
        elegantPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-3px)' },
        },
        goldShimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
            backgroundSize: '200% 100%'
          },
          '100%': { 
            backgroundPosition: '200% 0',
            backgroundSize: '200% 100%'
          },
        },
        // Art Deco vintage animations
        artDecoSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.05)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        vintageBounce: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(-2deg)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
          },
          '50%': { 
            transform: 'translateY(-10px) rotate(2deg)',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
          },
        },
        jazzGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.2)',
            opacity: '0.9'
          },
        },
        vinylSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',
        slideInUp: 'slideInUp 0.5s ease-out',
        slideInDown: 'slideInDown 0.5s ease-out',
        slideInLeft: 'slideInLeft 0.5s ease-out',
        slideInRight: 'slideInRight 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        // Elegant animations
        'elegant-pulse': 'elegantPulse 2s ease-in-out infinite',
        'float-up': 'floatUp 0.3s ease-out',
        'gold-shimmer': 'goldShimmer 2s ease-in-out infinite',
        // Vintage Art Deco animations
        'art-deco-spin': 'artDecoSpin 8s ease-in-out infinite',
        'vintage-bounce': 'vintageBounce 2s ease-in-out infinite',
        'jazz-glow': 'jazzGlow 3s ease-in-out infinite',
        'vinyl-spin': 'vinylSpin 4s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}