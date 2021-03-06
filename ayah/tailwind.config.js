module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'sky': "url('./images/image2.jpg')",
      }),

    },
  },
  variants: {
    extend: {

      backgroundImage: ['hover', 'focus'],

    },
  },
  plugins: [],
}
