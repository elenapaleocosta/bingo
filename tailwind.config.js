/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          cream: '#FAF7F2',
          bg: '#F5F0E8',
          card: '#FFFFFF',
          border: '#E8E1D5',
          text: '#2D3142',
          muted: '#6C757D',
          highlight: '#FFF9E6',
        },
        snoopy: {
          red: '#E86A58',
          softRed: '#F4978E',
          blue: '#90E0EF',
          softBlue: '#BEE1E6',
          dark: '#3A3A3C'
        },
        miffy: {
          orange: '#F7B05B',
          softOrange: '#FFD6BA',
          yellow: '#FFE5EC',
          green: '#C1E1C1',
          softGreen: '#D8F3DC'
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Comfortaa', 'Fredoka', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
