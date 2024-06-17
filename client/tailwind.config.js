/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: {
      primary: 'hsl(var(--primary))',
      blue: 'hsl(var(--blue))',
      'blue-light': 'hsl(var(--blue-light))',
      pink: 'hsl(var(--pink))',
      'pink-light': 'hsl(var(--pink-light))',
      navy: 'hsl(var(--navy))',
      grey: 'hsl(var(--grey))',
      'grey-light': 'hsl(var(--grey-light))',
      'grey-neutral': 'hsl(var(--grey-neutral))',
      'grey-dark': 'hsl(var(--grey-dark))',
      white: 'hsl(var(--white))',
      black: 'hsl(var(--black))',
      yellow: 'hsl(var(--yellow))',
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      proxima: ['Proxima Nova', 'sans-serif'],
    },
    container: {
      screens: {
        '2xl': '1920px',
      },
      center: true,
    },
    extend: {
      backgroundImage: {
        'sales-background': "url('/assets/salesImage.jpg')",
      },
    },
  },
  plugins: [],
};
