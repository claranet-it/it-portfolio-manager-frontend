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
      'dark-gray-50': '#F7F7F8',
      'darkgray-200': '#CBCBD1',
      'darkgray-300': '#B9B9C2',
      'darkgray-400': '#91929F',
      'darkgray-500': '#9696A3',
      'darkgray-900': '#393941',
      'gray-900': '#1A1A1A',
      'white-100': '#FFFFFF',
      'surface-5': '#FAFBFB',
      'surface-20': '#F0F3F4',
      'surface-40': '#E6EBED',
      'surface-50': '#E1E6EA',
      'surface-70': '#D7DEE3',
      'surface-90': '#CDD6DC',
      'green-1': '#6DB3A7',
      'yellow-100': '#FAE022',
      'black-trasparent': '#0000001c',
      'success': '#057A55',
      'success-light': '#BCF0DA',
      'success-dark': '#03543F',
      'warning-light': '#FDF6B2',
      'danger-light': '#FED0CA',
      'danger-dark': '#992A1B',
      'info-light': '#C3DDFD',
      'info-dark': '#1E429F'
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
