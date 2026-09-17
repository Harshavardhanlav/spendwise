/**
 * SpendWise Design System — Tailwind theme
 *
 * Principles:
 * - One typeface (Inter), hierarchy comes from size / weight / colour, not from mixing fonts.
 * - Near-black "ink" is the brand + primary action colour. Blue is the interactive accent.
 *   Green and red are reserved EXCLUSIVELY for income and expense semantics.
 * - Restrained radii and near-invisible shadows. No gradients in the theme at all.
 */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        /* --- Surfaces --- */
        canvas: '#F5F6F8', // app background
        surface: '#FFFFFF', // cards, sheets, menus
        sunken: '#FAFBFC', // table headers, inset wells
        overlay: 'rgba(15, 26, 42, 0.48)', // modal scrim

        /* --- Ink: text + brand primary --- */
        ink: {
          50: '#F5F6F8',
          100: '#EDEFF2',
          200: '#E1E4E9',
          300: '#C9CED6',
          400: '#8B95A5', // muted / placeholder text
          500: '#6B7585',
          600: '#5A6474', // secondary text
          700: '#33404F',
          800: '#1C2A3D', // primary button hover
          900: '#0F1A2A', // primary text, primary button, sidebar
        },

        /* --- Hairlines --- */
        line: {
          subtle: '#EDEFF2',
          DEFAULT: '#E1E4E9',
          strong: '#C9CED6',
        },

        /* --- Accent: interactive / selected / primary data series --- */
        accent: {
          50: '#EEF3FE',
          100: '#DCE6FD',
          200: '#C2D3FB',
          300: '#9CB5F5',
          500: '#2B5FD9',
          600: '#2350BC',
          700: '#1C4199',
          900: '#16326F',
        },

        /* --- Money in --- */
        income: {
          bg: '#E9F5EF',
          border: '#C0E0CE',
          DEFAULT: '#12734A',
          strong: '#0E5C3B',
        },

        /* --- Money out --- */
        expense: {
          bg: '#FDECEA',
          border: '#F6CBC5',
          DEFAULT: '#B42318',
          strong: '#912012',
        },

        warning: {
          bg: '#FEF4E6',
          border: '#F7DDB4',
          DEFAULT: '#A15C07',
          strong: '#854B05',
        },

        info: {
          bg: '#EAF2FB',
          border: '#C6DCF3',
          DEFAULT: '#1F5FA8',
          strong: '#194E8A',
        },

        /* --- Categorical data-viz ramp (muted, distinguishable) --- */
        viz: {
          1: '#2B5FD9',
          2: '#0E8C7F',
          3: '#7A5AF8',
          4: '#C77700',
          5: '#B4477B',
          6: '#3F8A2E',
          7: '#6B7585',
        },
      },

      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },

      /* Semantic type scale. Dense-app sizing: 14px body, not 16px. */
      fontSize: {
        display: ['2rem', { lineHeight: '2.375rem', letterSpacing: '-0.022em', fontWeight: '600' }],
        title: ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.018em', fontWeight: '600' }],
        section: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.011em', fontWeight: '600' }],
        cardtitle: ['0.9375rem', { lineHeight: '1.375rem', letterSpacing: '-0.006em', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem' }],
        body: ['0.875rem', { lineHeight: '1.375rem' }],
        label: ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1rem' }],
        overline: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.055em', fontWeight: '600' }],
        button: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],

        /* Financial amounts — tighter tracking, heavier weight */
        'amount-xl': ['2.125rem', { lineHeight: '2.5rem', letterSpacing: '-0.028em', fontWeight: '600' }],
        'amount-lg': ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'amount-md': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.012em', fontWeight: '600' }],
        'amount-sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.006em', fontWeight: '500' }],
      },

      /* 4px base. Named steps used by layout primitives. */
      spacing: {
        4.5: '1.125rem',
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        68: '17rem', // desktop sidebar width
      },

      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem', // inputs, buttons
        lg: '0.625rem', // cards
        xl: '0.75rem', // modals, sheets
      },

      boxShadow: {
        xs: '0 1px 2px 0 rgba(15, 26, 42, 0.05)',
        sm: '0 1px 2px 0 rgba(15, 26, 42, 0.06), 0 1px 3px 0 rgba(15, 26, 42, 0.05)',
        pop: '0 8px 24px -6px rgba(15, 26, 42, 0.14), 0 2px 6px -2px rgba(15, 26, 42, 0.08)',
        modal: '0 24px 48px -12px rgba(15, 26, 42, 0.24), 0 4px 12px -4px rgba(15, 26, 42, 0.10)',
        none: 'none',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },

      transitionDuration: {
        120: '120ms',
        160: '160ms',
        200: '200ms',
        240: '240ms',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'translateY(4px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'sheet-up': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 160ms cubic-bezier(0.23, 1, 0.32, 1)',
        'pop-in': 'pop-in 160ms cubic-bezier(0.23, 1, 0.32, 1)',
        'sheet-up': 'sheet-up 240ms cubic-bezier(0.23, 1, 0.32, 1)',
      },

      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};
