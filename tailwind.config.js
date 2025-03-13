/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,pug}",
    "./public/**/*.html"
  ],
  theme: {
	// container: {
	// 	center: true, // Centra el contenedor
	// 	screens: {
	// 		DEFAULT: '100%', // Configura el ancho del contenedor para todas las pantallas
	// 		xl: '1600px', // Máximo ancho de 1600px para pantallas grandes
	// 	},
	// },
	screens: {
		s: '0',
		sm: '480px',
		m: '640px',
		l: '960px',
		lg: '1280px',
		xl: '1600px',
		xxl: '1800px',
		xxxl: '1920px',
	},
    extend: {},
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
} 
