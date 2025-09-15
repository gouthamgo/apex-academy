/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        salesforce: {
          blue: '#0176d3',
          lightblue: '#1ab9ff',
          navy: '#16325c',
          orange: '#ff6600',
          green: '#04844b',
          yellow: '#ffb75d',
        },
        apex: {
          keyword: '#c678dd',
          string: '#98c379',
          comment: '#5c6370',
          number: '#d19a66',
          function: '#61afef',
        },
        code: {
          bg: '#282c34',
          'bg-light': '#fafafa',
          border: '#3e4451',
          'border-light': '#e1e5e9',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.700'),
            code: {
              color: theme('colors.pink.500'),
              backgroundColor: theme('colors.gray.100'),
              paddingLeft: theme('spacing.1'),
              paddingRight: theme('spacing.1'),
              paddingTop: theme('spacing.0.5'),
              paddingBottom: theme('spacing.0.5'),
              borderRadius: theme('borderRadius.sm'),
              fontWeight: theme('fontWeight.medium'),
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.code.bg'),
              border: `1px solid ${theme('colors.code.border')}`,
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: theme('colors.gray.200'),
              padding: 0,
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            code: {
              color: theme('colors.pink.400'),
              backgroundColor: theme('colors.gray.800'),
            },
            pre: {
              backgroundColor: theme('colors.code.bg'),
              border: `1px solid ${theme('colors.code.border')}`,
            },
          },
        },
      }),
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};