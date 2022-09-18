/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./index.html",
     "./src/**/*.{vue,js,ts,jsx,tsx,scss}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#6574cd",
        "secondary": "#f5f7fb",
        "tertiary" : "white",
        "default": "#6e7687",
      }
    },
  },
  plugins: [],
  prefix: 'tw-'
}
