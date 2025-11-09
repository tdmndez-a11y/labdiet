/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        akt: {
          primary: '#ff6b00',
          surface: '#131315',
          muted: '#191a1d',
          border: '#282a2f',
          text: '#eaeaec',
          background: '#0a0a0b'
        }
      },
      fontFamily: {
        heading: ['"Neue Haas Grotesk"', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        surface: '0 10px 30px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
};
