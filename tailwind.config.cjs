/** @type {import('tailwindcss').Config} */

module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
      },
      fontWeight: {
      },
      colors: {
        'primary-1': 'var(--color-primary-1)',
        'primary-2': 'var(--color-primary-2)',
        'secondary-danger': 'var(--color-secondary-danger)',
        'secondary-waring': 'var(--color-secondary-waring)',
        'secondary-green': 'var(--color-secondary-green)',
        'secondary-purple': 'var(--color-secondary-purple)',
        'dark-1': 'var(--color-dark-1)',
        cancel: 'var(--color-cancel)',
        'dark-bg-1': 'var(--color-dark-bg-1)',
        'dark-bg-2': 'var(--color-dark-bg-2)',
        'text-dark-1': 'var(--color-text-dark-1)',
      },
      spacing: {},
      maxWidth: {
        wrap: '1280px',
      },
      screens: {
        xlg: { max: '992px' },
        xmd: { max: '768px' },
        nmd: { min: '769px' },
        // md: { max: '1023px' },
      },
      translate: {
        'right-1/2': '-50%',
      },
    },
  },
  plugins: [],
};
