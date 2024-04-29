/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      'blue': 'hsl(var(--primary))',
      'blue-light': 'hsl(var(--blue-light))',
      'pink': 'hsl(var(--pink))',
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