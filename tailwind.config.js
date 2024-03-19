/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      'clara-red': '#DA0812',
      'red-500': '#B6070F',
      'dark-grey': '#464650',
      'darkgray-300': '#B9B9C2',
      'darkgray-500': '#9696A3'
    },
    screens: {
      'sm': { 'min': '0px', 'max': '767px' },
      'md': { 'min': '768px', 'max': '1296px' },
      'lg': { 'min': '1296px' },
    },
    extend: {},
  },
  plugins: [],
};
