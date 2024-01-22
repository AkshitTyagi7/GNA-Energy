/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      backgroundColor: {
        'primary': '#FF7C04',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      }
    },
  },
  plugins: [],
}

