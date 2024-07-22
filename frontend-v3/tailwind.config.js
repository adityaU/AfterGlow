/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: ["*.html", "./src/**/*.rs"],
  },
  theme: {
    extend: {

      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--color-tertiary) / <alpha-value>)',
        default: 'rgb(var(--color-default) / <alpha-value>)',
        white: 'rgb(var(--color-white) / <alpha-value>)',
      },
    },
  },
  plugins: [],
  prefix: "tw-",
};
