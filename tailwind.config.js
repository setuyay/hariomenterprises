/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light "paper" theme — token names kept; values flipped to brand palette.
        ink: '#fbf6ee',        // page background
        'ink-2': '#fffdf8',    // card surface
        cream: '#241c1c',      // primary text (dark on light)
        gold: '#e8472b',       // primary accent (Hariom red)
        'gold-soft': '#ff7a45',
        // Brand + accents
        nerolac: '#e8472b',
        mrf: '#0a5ad6',
        kamdhenu: '#159e54',
        sun: '#f7b500',
        hariom: '#e8472b',
        night: '#1a1414',      // intentional dark areas (footer, dark sections)
        line: 'rgba(26,20,20,.12)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
