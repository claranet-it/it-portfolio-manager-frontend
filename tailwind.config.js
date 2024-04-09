/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    colors: {
      'clara-red': '#DA0812',
      'clara-red-200': '#FFC0C0',
      'red-500': '#B6070F',
      'dark-grey': '#464650',
      'darkgray-200': '#CBCBD1',
      'darkgray-300': '#B9B9C2',
      'darkgray-500': '#9696A3',
      'darkgray-900': '#555561',
      'gray-900': '#1A1A1A',
      'white-100': '#FFFFFF'
    },
    screens: {
      'sm': { 'min': '0px', 'max': '767px' },
      'md': { 'min': '768px', 'max': '1296px' },
      'lg': { 'min': '1296px' },
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
