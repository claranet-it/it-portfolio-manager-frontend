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
      'clara-red-50': '#FDD1D3',
      'dark-grey': '#464650',
      'darkgray-200': '#CBCBD1',
      'darkgray-300': '#B9B9C2',
      'darkgray-400': '#91929F',
      'darkgray-500': '#9696A3',
      'darkgray-700': '#747484',
      'darkgray-900': '#555561',
      'gray-900': '#1A1A1A',
      'white-100': '#FFFFFF',
      'surface-5': '#FAFBFB',
      'surface-20': '#F0F3F4',
      'surface-50': '#E1E6EA',
      'surface-70': '#D7DEE3',
      'green-1': '#6DB3A7',
      'yellow-100': '#FAE022'
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
