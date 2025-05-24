/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3A59D1',
          secondary: '#3D90D7',
          accent: '#7AC6D2',
          light: '#B5FCCD',
        },
        fontFamily: {
          limelight: ['var(--font-limelight)'],
        },
      },
    },
    plugins: [],
  }