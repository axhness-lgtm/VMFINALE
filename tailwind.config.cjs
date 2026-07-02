/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"The Seasons"', 'Georgia', 'serif'],
        mono: ['"Mistrully"', 'cursive'],
        sans: ['"The Seasons"', 'sans-serif'],
        body: ['"The Seasons"', 'sans-serif'],
        heading: ['"The Seasons"', 'serif'],
        logo: ['"Apricot"', 'cursive'],
        hibernate: ['"Hibernate"', 'sans-serif'],
      },
      colors: {
        cream: '#efe9e1',
        orange: '#e86321',
        blue: '#002fa7',
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px #002fa7',
        'brutal-hover': '12px 12px 0px 0px #002fa7',
      },
      borderWidth: {
        'brutal': '4px',
      }
    },
  },
  plugins: [],
}
