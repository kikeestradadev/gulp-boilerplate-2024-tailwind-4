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

// Configuración del compilador Sass usando la nueva API
const sass = gulpSass(sassCompiler);

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
				pretty: true,
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
			collapseWhitespace: false,
			removeComments: false,
			minifyCSS: false,
			minifyJS: false
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
			outputStyle: 'expanded', 
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
			autoprefixer()
			// Removed cssnano to prevent compression
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/'))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('scripts', () => {
	return browserify('src/js/index.js')
		.transform(babelify)
		.bundle()
		.pipe(source('index.js')) // Mantén el nombre original
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(
			minify({
				ext: {
					min: '.js', // Mantén la extensión .js sin agregar .min
				},
			})
		)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/')); // Coloca el archivo en public/
});

// Tarea para sincronizar assets
gulp.task('sync-assets', () => {
	return gulp.src('src/assets/**/*')
		.pipe(copy('public', { prefix: 1 }));
});

// Tarea para watch de assets
gulp.task('watch-assets', () => {
	return watch('src/assets/**/*', { events: ['add', 'change', 'unlink'] })
		.on('add', (filepath) => {
			const relativePath = path.relative('src/assets', filepath);
			const destPath = path.join('public/assets', relativePath);
			return gulp.src(filepath)
				.pipe(copy('public', { prefix: 1 }));
		})
		.on('change', (filepath) => {
			const relativePath = path.relative('src/assets', filepath);
			const destPath = path.join('public/assets', relativePath);
			return gulp.src(filepath)
				.pipe(copy('public', { prefix: 1 }));
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

gulp.task('clean', () => {
	return deleteAsync(['public/**/*']);
});

gulp.task(
	'serve',
	gulp.series('pug', 'sass', 'scripts', 'sync-assets', () => {
		browserSync.init({
			server: {
				baseDir: 'public',
			},
			port: 3000, // Especificar un puerto
			notify: false, // Mantener las notificaciones desactivadas
			open: true, // Cambiar a true para que abra el navegador
			browser: 'default', // Usar el navegador por defecto
		});

		// Watch para Pug
		gulp.watch('src/pug/**/*.pug', (done) => {
			gulp.series('pug', 'sass')();
			browserSync.reload();
			done();
		});

		// Watch para Sass y Tailwind
		gulp.watch(['src/scss/**/*.scss', 'tailwind.config.js'], gulp.series('sass'));

		// Watch para Scripts
		gulp.watch('src/js/**/*.js', (done) => {
			gulp.series('scripts')();
			browserSync.reload();
			done();
		});

		// Watch para datos
		gulp.watch(['src/data/**/*.json', 'src/md/**/*.md'], (done) => {
			gulp.series('pug', 'sass')();
			browserSync.reload();
			done();
		});

		// Watch para Assets con sincronización
		gulp.task('watch-assets')();
	})
);

gulp.task('dev', gulp.series('clean', 'serve'));
gulp.task('build', gulp.series('pug', 'sass', 'scripts', 'sync-assets', 'compress'));
gulp.task('default', gulp.series('dev'));
