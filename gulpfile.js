'use strict';

const connect = require('gulp-connect');
const electric = require('electric');
const ghPages = require('gulp-gh-pages');
const gulp = require('gulp');
const marble = require('marble');
const path = require('path');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');

electric.registerTasks({
	apiSrc: path.join(require.resolve('metal-component/package.json'), '../src/**/*.js'),
	apiConfig: {
		projects: [
			// {
			// 	name: 'metal-pagination',
			// 	repo: 'https://github.com/mairatma/metal-pagination',
			// 	src: path.join(require.resolve('metal-pagination/package.json'), '../src/Pagination.js')
			// },
			// {
			// 	name: 'metal-component',
			// 	repo: 'https://github.com/mairatma/metal-component',
			// 	src: path.join(require.resolve('metal-component/package.json'), '../src/**/*.js')
			// }
			{
				name: 'senna',
				repo: 'https://github.com/liferay/senna.js',
				src: path.join(require.resolve('senna/package.json'), '../src/**/*.js')
			}
		]
	},
	gulp: gulp,
	plugins: ['electric-marble-components']
});

// CSS -------------------------------------------------------------------------

gulp.task('css', () => {
	return gulp.src('src/styles/**/*.scss')
		.pipe(sass({
			includePaths: ['node_modules', marble.src]
		}))
		.pipe(gulp.dest('dist/styles'));
});

// Fonts -----------------------------------------------------------------------

gulp.task('fonts', () => {
	return gulp.src('node_modules/marble/build/fonts/**')
		.pipe(gulp.dest('dist/fonts'));
});

// Server ----------------------------------------------------------------------

gulp.task('server', () => {
	connect.server({
		root: 'dist',
		port: 8888
	});
});

// Deploy ----------------------------------------------------------------------

gulp.task('wedeploy', () => {
	return gulp.src('src/container.json')
		.pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['default'], () => {
	return gulp.src('dist/**/*')
		.pipe(ghPages({
			branch: 'wedeploy'
		}));
});

// Watch -----------------------------------------------------------------------

gulp.task('watch', () => {
	gulp.watch('src/**/*.+(md|soy|js|fm)', ['generate']);
	gulp.watch('src/styles/**/*.scss', ['css']);
});

// Build -----------------------------------------------------------------------

gulp.task('build', (callback) => {
	runSequence('generate', ['css', 'fonts', 'wedeploy'], callback);
});

gulp.task('default', (callback) => {
	runSequence('build', 'server', 'watch', callback);
});
