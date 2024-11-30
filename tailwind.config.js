

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    screens: {
      "xxs" : {"max" : "420px"},
      "xs" : {"max" : "560px"},
      "sm" : { "max" : "768px"},
      "md" : { "max" : "976px"},
      "lg" : {"max" : "1200px"},
      "xl" : {"max" : "1477px"}
    },
    extend: {
      fontFamily : {
        gotham : ['Gotham', 'sans-serif']
      },
      fontWeight: {
        light: 300,
        medium: 500,
        bold: 700,
        black: 900,
      },
      backgroundImage : {
        'main-gradient' : 'var(--main-gradient )'
      },
      colors:{
        primary:{
          light: '#000000',
          dark : '#ffffff'
        }
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
}
