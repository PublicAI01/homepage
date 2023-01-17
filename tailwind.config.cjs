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
      },
      backgroundImage: {
        text: 'var(--linear-gradient-text)',
        button: 'var(--linear-gradient-button)',
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
