/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      colors:{
        primary: "#5D87FF",
        hoverbgGray: "#5d87ff20" , 
        lightBlackText: "#2a3547"
      }
    },
  },
  plugins: [],
}