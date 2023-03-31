/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      katibeh: ['Katibeh'],
      "amiri-quran": ['amiri-quran'],
      amiri: ['amiri-regular', 'serif'],
      "droid-arabic": ['droid-arabic', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}