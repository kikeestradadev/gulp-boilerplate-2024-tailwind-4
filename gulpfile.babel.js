import gulp from 'gulp';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import postcss from 'gulp-postcss';
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

// Tarea Tailwind CSS 4
gulp.task('tailwind', () => {
	return gulp.src('src/scss/tailwind.css')
		.pipe(plumber({
			errorHandler: function(err) {
				console.log(err.message);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(postcss([
			tailwindcss,
			autoprefixer()
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
			})
		)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/'));
});

// Tarea para copiar assets
gulp.task('assets', () => {
	return gulp.src('src/assets/**/*')
		.pipe(copy('public', { prefix: 1 }));
});

gulp.task(
	'serve',
	gulp.series('pug', 'tailwind', 'scripts', 'assets', () => {
		browserSync.init({
			server: {
				baseDir: 'public',
			},
			port: 3000,
			notify: false,
			open: true,
			browser: 'default',
		});

		gulp.watch('src/pug/**/*.pug', (done) => {
			gulp.series('pug', 'tailwind')();
			browserSync.reload();
			done();
		});

		gulp.watch(['src/scss/tailwind.css', 'tailwind.config.js'], gulp.series('tailwind'));

		gulp.watch('src/js/**/*.js', (done) => {
			gulp.series('scripts')();
			browserSync.reload();
			done();
		});

		gulp.watch(['src/data/**/*.json', 'src/md/**/*.md'], (done) => {
			gulp.series('pug', 'tailwind')();
			browserSync.reload();
			done();
		});

		gulp.watch('src/assets/**/*', (done) => {
			gulp.series('assets')();
			browserSync.reload();
			done();
		});
	})
);

gulp.task('dev', gulp.series('serve'));
gulp.task('build', gulp.series('pug', 'tailwind', 'scripts', 'assets'));
gulp.task('default', gulp.series('dev'));
