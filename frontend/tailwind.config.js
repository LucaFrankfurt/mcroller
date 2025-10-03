/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: '#7B8F45', // Weathered sage
          50: '#f1f4ea',
          100: '#e3e9d5',
          200: '#c8d1a8',
          300: '#aec98c',
          400: '#95b066',
          500: '#7b8f45',
          600: '#647235',
          700: '#4f5a2a',
          800: '#3a4320',
          900: '#273015',
        },
        cream: {
          DEFAULT: '#EDE0C8', // Aged parchment
          50: '#fdfbf6',
          100: '#f9f2e2',
          200: '#f3e4cc',
          300: '#ead2ae',
          400: '#e0c092',
          500: '#d5ae75',
          600: '#c3995e',
          700: '#a57a46',
          800: '#855c33',
          900: '#5b3c23',
        },
        mustard: {
          DEFAULT: '#C97A40', // Burnt sienna accent
          50: '#fbeee3',
          100: '#f6d9c0',
          200: '#edb889',
          300: '#e49852',
          400: '#d67f39',
          500: '#c97a40',
          600: '#ad5f2c',
          700: '#8f4921',
          800: '#71371a',
          900: '#462010',
        },
        'off-white': {
          DEFAULT: '#F5EFE6', // Soft linen background
          50: '#ffffff',
          100: '#fdf8f0',
          200: '#f7efe0',
          300: '#efe3ce',
          400: '#e5d4b8',
          500: '#d7c3a0',
          600: '#bfa581',
          700: '#a28564',
          800: '#7f6449',
          900: '#5a4431',
        },
        'dark-brown': {
          DEFAULT: '#3F2F25', // Rich roasted coffee
          50: '#c9b6a9',
          100: '#b89f8e',
          200: '#a48776',
          300: '#8d6d5c',
          400: '#745645',
          500: '#5d4233',
          600: '#4b3326',
          700: '#3f2f25',
          800: '#2f221b',
          900: '#20160f',
        },
      },
    },
  },
  plugins: [],
}
