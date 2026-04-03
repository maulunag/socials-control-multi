/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#16161E',
        panel: '#1E1E2F',
        panelHighlight: '#2A2A3E',
        primary: '#7C3AED',
        primaryHover: '#6D28D9',
        accent: '#10B981',
        danger: '#EF4444'
      }
    },
  },
  plugins: [],
}
