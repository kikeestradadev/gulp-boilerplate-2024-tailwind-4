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
import { deleteAsync } from 'del';

// Configuración del compilador Sass usando la nueva API
const sass = gulpSass(sassCompiler);

// Configuración del entorno
const isDev = process.env.NODE_ENV !== 'production';

// Configuración de BrowserSync
const browserSyncConfig = {
	server: {
		baseDir: 'public',
	},
	port: 3000,
	notify: true,
	open: true,
	browser: 'default',
	reloadDelay: 100,
	reloadDebounce: 500,
	reloadThrottle: 0,
	ghostMode: false,
	ui: {
		port: 3001
	},
	watchOptions: {
		ignoreInitial: true,
		ignored: ['node_modules/**/*', 'public/**/*'],
		awaitWriteFinish: {
			stabilityThreshold: 1000,
			pollInterval: 100
		}
	}
};

// Función para leer todos los archivos JSON en un directorio
const getJsonData = () => {
	const dataDir = './src/data/';
	const files = fs.readdirSync(dataDir);
	let jsonData = {};

	files.forEach((file) => {
		if (path.extname(file) === '.json') {
			const fileData = fs.readFileSync(path.join(dataDir, file));
			Object.assign(jsonData, JSON.parse(fileData));
		}
	});

	return jsonData;
};

// Tarea pug
gulp.task('pug', () => {
	return gulp
		.src('./src/pug/pages/**/*.pug')
		.pipe(plumber())
		.pipe(data(() => getJsonData()))
		.pipe(
			pug({
				pretty: isDev, // true para desarrollo, false para producción
				compileDebug: false,
				doctype: 'html'
			})
		)
		.pipe(
			cacheBust({
				type: 'timestamp',
			})
		)
		.pipe(htmlmin({ 
			collapseWhitespace: !isDev,
			removeComments: !isDev,
			minifyCSS: !isDev,
			minifyJS: !isDev
		}))
		.pipe(gulp.dest('public'));
});

gulp.task('sass', () => {
	return gulp.src('src/scss/*.scss')
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.message);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: isDev ? 'expanded' : 'compressed',
			includePaths: ['node_modules'],
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
			autoprefixer(),
			...(isDev ? [] : [cssnano({
				preset: ['default', {
					discardComments: {
						removeAll: true
					},
					normalizeWhitespace: true,
					colormin: true,
					discardUnused: true,
					mergeIdents: true,
					reduceIdents: true,
					zindex: true
				}]
			})])
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('scripts', () => {
	return browserify('src/js/index.js')
		.transform(babelify)
		.bundle()
		.pipe(source('index.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(
			minify({
				ext: {
					min: '.js',
				},
				noSource: !isDev,
				ignoreFiles: isDev ? ['*.min.js'] : []
			})
		)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/'));
});

// Tarea para limpiar assets
gulp.task('clean-assets', () => {
	return deleteAsync('public/assets/**/*');
});

// Tarea para copiar assets
gulp.task('assets', gulp.series('clean-assets', () => {
	return gulp.src('src/assets/**/*')
		.pipe(copy('public', { prefix: 1 }));
}));

// Función para manejar errores
const handleError = (err) => {
	console.log(err.toString());
	this.emit('end');
};

// Función para notificar cambios
const notifyChange = (event) => {
	const fileName = event.path.split('/').pop();
	console.log(`File ${fileName} was ${event.type}, running tasks...`);
};

// Función para limpiar la caché
const clearCache = (done) => {
	deleteAsync(['public/**/*', '!public/assets/**/*']).then(() => {
		console.log('Cache cleared');
		done();
	});
};

gulp.task(
	'serve',
	gulp.series('pug', 'sass', 'scripts', 'assets', () => {
		// Inicializar BrowserSync
		const bs = browserSync.create();
		bs.init(browserSyncConfig);

		// Watch para Pug con debounce
		const pugWatcher = gulp.watch('src/pug/**/*.pug', { ignoreInitial: false })
			.on('change', (event) => {
				notifyChange(event);
				gulp.series('pug')((err) => {
					if (err) handleError(err);
					bs.reload();
				});
			});

		// Watch para Sass y Tailwind con debounce
		const sassWatcher = gulp.watch(['src/scss/**/*.scss', 'tailwind.config.js'], { ignoreInitial: false })
			.on('change', (event) => {
				notifyChange(event);
				gulp.series('sass')((err) => {
					if (err) handleError(err);
					bs.reload('*.css');
				});
			});

		// Watch para Scripts con debounce
		const scriptsWatcher = gulp.watch('src/js/**/*.js', { ignoreInitial: false })
			.on('change', (event) => {
				notifyChange(event);
				gulp.series('scripts')((err) => {
					if (err) handleError(err);
					bs.reload();
				});
			});

		// Watch para datos con debounce
		const dataWatcher = gulp.watch(['src/data/**/*.json', 'src/md/**/*.md'], { ignoreInitial: false })
			.on('change', (event) => {
				notifyChange(event);
				gulp.series('pug', 'sass')((err) => {
					if (err) handleError(err);
					bs.reload();
				});
			});

		// Watch para Assets con debounce
		const assetsWatcher = gulp.watch('src/assets/**/*', { 
			ignoreInitial: false,
			events: ['add', 'change', 'unlink']
		})
			.on('change', (event) => {
				notifyChange(event);
				gulp.series('assets')((err) => {
					if (err) handleError(err);
					bs.reload();
				});
			});

		// Manejar la limpieza de la caché solo cuando se solicite explícitamente
		process.on('SIGINT', () => {
			console.log('\nCerrando el servidor de desarrollo...');
			process.exit();
		});
	})
);

// Tarea para limpiar la caché manualmente
gulp.task('clean', clearCache);

// Tareas principales
gulp.task('dev', gulp.series('serve'));
gulp.task('build', gulp.series('pug', 'sass', 'scripts', 'assets'));

// Tarea por defecto
gulp.task('default', gulp.series('dev'));
