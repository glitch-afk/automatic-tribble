/* eslint-disable import/no-extraneous-dependencies */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1.5rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        card: '#F4F4F5',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/typography', require('@tailwindcss/forms'))],
};
