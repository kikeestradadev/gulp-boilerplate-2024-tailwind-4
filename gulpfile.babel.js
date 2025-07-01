import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import * as sassCompiler from 'sass';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import minify from 'gulp-minify';
import data from 'gulp-data';
import fs from 'fs';
import path from 'path';
import cacheBust from 'gulp-cache-bust';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import copy from 'gulp-copy';
import htmlmin from 'gulp-htmlmin';
import cleanCSS from 'gulp-clean-css';
import terser from 'gulp-terser';
import { deleteAsync } from 'del';
import watch from 'gulp-watch';
import changed from 'gulp-changed';
import remember from 'gulp-remember';
import cached from 'gulp-cached';
import newer from 'gulp-newer';

// Configuración del compilador Sass usando la nueva API
const sass = gulpSass(sassCompiler);

// Variables para debouncing
let pugTimeout;
let sassTimeout;
let scriptsTimeout;
let dataTimeout;

// Función para debouncing
const debounce = (func, wait) => {
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(func.timeout);
			func(...args);
		};
		clearTimeout(func.timeout);
		func.timeout = setTimeout(later, wait);
	};
};

// Función para leer todos los archivos JSON en un directorio con cache
let jsonDataCache = null;
let jsonDataCacheTime = 0;
const CACHE_DURATION = 5000; // 5 segundos

const getJsonData = () => {
	const now = Date.now();
	const dataDir = './src/data/';
	
	// Verificar si el cache es válido
	if (jsonDataCache && (now - jsonDataCacheTime) < CACHE_DURATION) {
		return jsonDataCache;
	}

	try {
		const files = fs.readdirSync(dataDir);
		let jsonData = {};

		files.forEach((file) => {
			if (path.extname(file) === '.json') {
				const fileData = fs.readFileSync(path.join(dataDir, file));
				Object.assign(jsonData, JSON.parse(fileData));
			}
		});

		// Actualizar cache
		jsonDataCache = jsonData;
		jsonDataCacheTime = now;
		
		return jsonData;
	} catch (error) {
		console.error('Error reading JSON data:', error);
		return jsonDataCache || {};
	}
};

// Tarea pug optimizada
gulp.task('pug', () => {
	return gulp
		.src('./src/pug/pages/**/*.pug')
		.pipe(plumber({
			errorHandler: function(err) {
				console.log('Pug Error:', err.message);
				this.emit('end');
			}
		}))
		.pipe(cached('pug'))
		.pipe(data(() => getJsonData()))
		.pipe(
			pug({
				pretty: true,
				compileDebug: false,
				doctype: 'html',
				basedir: './src/pug'
			})
		)
		.pipe(
			cacheBust({
				type: 'timestamp',
			})
		)
		.pipe(htmlmin({ 
			collapseWhitespace: false,
			removeComments: false,
			minifyCSS: false,
			minifyJS: false
		}))
		.pipe(gulp.dest('public'))
		.pipe(browserSync.stream({match: '**/*.html'}));
});

// Tarea sass optimizada
gulp.task('sass', () => {
	return gulp.src('src/scss/*.scss')
		.pipe(plumber({
			errorHandler: function(err) {
				console.log('Sass Error:', err.message);
				this.emit('end');
			}
		}))
		.pipe(cached('sass'))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded', 
			includePaths: ['node_modules', 'src/scss'],
			quietDeps: true,
			logger: {
				warn: function(message) {
					// Ignorar mensajes de deprecación
					if (!message.includes('legacy-js-api') && !message.includes('@import rules are deprecated')) {
						console.warn(message);
					}
				}
			}
		}).on('error', sass.logError))
		.pipe(postcss([
			tailwindcss,
			autoprefixer()
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

// Tarea scripts optimizada
gulp.task('scripts', () => {
	return browserify('src/js/index.js', {
		debug: true,
		cache: {},
		packageCache: {},
		fullPaths: true
	})
		.transform(babelify, {
			presets: ['@babel/preset-env'],
			plugins: ['@babel/plugin-transform-runtime']
		})
		.bundle()
		.pipe(source('index.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(
			minify({
				ext: {
					min: '.js',
				},
			})
		)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/'))
		.pipe(browserSync.stream({match: '**/*.js'}));
});

// Tarea para sincronizar assets optimizada
gulp.task('sync-assets', () => {
	return gulp.src('src/assets/**/*')
		.pipe(newer('public/assets'))
		.pipe(copy('public', { prefix: 1 }));
});

// Tarea para watch de assets optimizada
gulp.task('watch-assets', () => {
	return watch('src/assets/**/*', { 
		events: ['add', 'change', 'unlink'],
		ignoreInitial: false
	})
		.on('add', (filepath) => {
			return gulp.src(filepath)
				.pipe(copy('public', { prefix: 1 }))
				.pipe(browserSync.stream());
		})
		.on('change', (filepath) => {
			return gulp.src(filepath)
				.pipe(copy('public', { prefix: 1 }))
				.pipe(browserSync.stream());
		})
		.on('unlink', (filepath) => {
			const relativePath = path.relative('src/assets', filepath);
			const destPath = path.join('public/assets', relativePath);
			return deleteAsync(destPath);
		});
});

// Tarea para comprimir archivos en public
gulp.task('compress', () => {
	// Comprimir HTML
	gulp.src('public/**/*.html')
		.pipe(htmlmin({ 
			collapseWhitespace: true,
			removeComments: true,
			minifyCSS: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('public'));

	// Comprimir CSS
	gulp.src('public/**/*.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('public'));

	// Comprimir JS
	gulp.src('public/**/*.js')
		.pipe(terser())
		.pipe(gulp.dest('public'));

	return Promise.resolve();
});

// Tarea para limpiar la carpeta public
gulp.task('clean', () => {
	return deleteAsync(['public'], { force: true });
});

// Tarea para crear la carpeta public
gulp.task('create-public', (done) => {
	if (!fs.existsSync('public')) {
		fs.mkdirSync('public');
	}
	done();
});

// Tarea para limpiar cache
gulp.task('clear-cache', (done) => {
	jsonDataCache = null;
	jsonDataCacheTime = 0;
	done();
});

// Funciones debounced para watch
const debouncedPugSass = debounce(() => {
	gulp.series('pug', 'sass')(() => {
		browserSync.reload();
	});
}, 300);

const debouncedScripts = debounce(() => {
	gulp.series('scripts')(() => {
		browserSync.reload();
	});
}, 300);

const debouncedData = debounce(() => {
	gulp.series('clear-cache', 'pug', 'sass')(() => {
		browserSync.reload();
	});
}, 500);

gulp.task(
	'serve',
	gulp.series('pug', 'sass', 'scripts', 'sync-assets', () => {
		browserSync.init({
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
		});

		// Watch para Pug y Sass con debouncing
		watch(['src/pug/**/*.pug', 'src/scss/**/*.scss'], { 
			ignoreInitial: false,
			events: ['add', 'change', 'unlink']
		}, debouncedPugSass);

		// Watch para Scripts con debouncing
		watch('src/js/**/*.js', { 
			ignoreInitial: false,
			events: ['add', 'change', 'unlink']
		}, debouncedScripts);

		// Watch para datos con debouncing
		watch(['src/data/**/*.json', 'src/md/**/*.md'], { 
			ignoreInitial: false,
			events: ['add', 'change', 'unlink']
		}, debouncedData);

		// Watch para Assets con sincronización
		gulp.task('watch-assets')();
	})
);

gulp.task('dev', gulp.series('clean', 'create-public', 'serve'));
gulp.task('build', gulp.series('clean', 'create-public', 'pug', 'sass', 'scripts', 'sync-assets', 'compress'));
gulp.task('default', gulp.series('dev'));
