/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      'primary': 'hsl(var(--primary))',
      'primary-light': 'hsl(var(--primary-light))',
      'secondary': 'hsl(var(--secondary))',
      'navy': 'hsl(var(--navy))',
      'grey': 'hsl(var(--grey))',
      'grey-dark': 'hsl(var(--grey-dark))',
      'white': 'hsl(var(--white))',
      'black': 'hsl(var(--black))',
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      proxima: ['Proxima Nova', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}