/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      backgroundColor: {
        'primary': '#FF7C04',
        'primary-100': 'rgba(255, 124, 4, 0.1)',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      },
      borderColor:{
        'primary': '#FF7C04',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      
      },
      textColor:{
        'primary': '#FF7C04',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      },
        
    },
    
  },
  plugins: [],
}

