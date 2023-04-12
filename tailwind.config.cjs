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
        button2: 'var(--linear-gradient-button2)',
        'bg-pink': 'var(--linear-gradient-bg-pink)',
        'bg-gray': 'var(--linear-gradient-bg-gray)',
        'bg-silver': 'var(linear-gradient-bg-silver)',
        'bg-gold': 'var(--linear-gradient-bg-gold)',
        'border-green': 'var(--linear-gradient-border-green)',
        'border-purple': 'var(--linear-gradient-border-purple)',
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
      backgroundColor: (theme) => ({
        ...theme('colors'),
        'my-purple': '#7A43FF',
        'my-yellow': '#FFCE18',
        'my-gray': '#131313',
        'my-gray-white': '#F8F8F8',
      }),
    },
  },
  plugins: [],
};
