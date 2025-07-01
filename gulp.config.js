// Configuración para Gulp
export default {
	// Rutas
	paths: {
		src: {
			pug: './src/pug/pages/**/*.pug',
			pugAll: './src/pug/**/*.pug',
			sass: 'src/scss/*.scss',
			sassAll: 'src/scss/**/*.scss',
			js: 'src/js/**/*.js',
			jsEntry: 'src/js/index.js',
			assets: 'src/assets/**/*',
			data: 'src/data/**/*.json',
			md: 'src/md/**/*.md'
		},
		dest: {
			root: 'public',
			assets: 'public/assets'
		}
	},

	// Configuración de BrowserSync
	browserSync: {
		server: {
			baseDir: 'public',
		},
		port: 3000,
		notify: false,
		open: true,
		browser: 'default',
		reloadDelay: 100,
		reloadDebounce: 250,
		reloadThrottle: 0,
		watchOptions: {
			ignored: ['node_modules', '.git', 'public']
		}
	},

	// Configuración de Pug
	pug: {
		pretty: true,
		compileDebug: false,
		doctype: 'html',
		basedir: './src/pug'
	},

	// Configuración de Sass
	sass: {
		outputStyle: 'expanded',
		includePaths: ['node_modules', 'src/scss'],
		quietDeps: true
	},

	// Configuración de PostCSS
	postcss: {
		plugins: [
			'tailwindcss',
			'autoprefixer'
		]
	},

	// Configuración de Browserify
	browserify: {
		debug: true,
		cache: {},
		packageCache: {},
		fullPaths: true
	},

	// Configuración de Babel
	babel: {
		presets: ['@babel/preset-env'],
		plugins: ['@babel/plugin-transform-runtime']
	},

	// Configuración de watch
	watch: {
		debounce: {
			pugSass: 300,
			scripts: 300,
			data: 500
		},
		events: ['add', 'change', 'unlink']
	},

	// Configuración de cache
	cache: {
		duration: 5000 // 5 segundos
	}
}; 
