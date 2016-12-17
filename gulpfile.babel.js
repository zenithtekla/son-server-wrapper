import gulp             from 'gulp';
import config           from './gulp-config';
import buildJSON        from './db'; // loading db.js

import shell            from 'gulp-shell';
import nodemon          from 'gulp-nodemon';
import runSequence      from 'run-sequence';

gulp.task('default', function(callback){
	runSequence('build_json', 'watch_src', 'nodemon', callback);
});

// gulp.task('shell', ['watch_src'], shell.task(['json-server -w db.json --port 7000']));
// gulp.task('shell', ['watch_src'], shell.task(['nodemon node_modules/json-server/bin db.json --port 7000']));

gulp.task('watch_src', function(){
	return gulp.watch(config.db_scripts.src, ['build_json']);
});

gulp.task('build_json', function(){
	return buildJSON();
	// return shell.task(['json-server -w db.json --port 7000']);
});

gulp.task('nodemon', ['build_json'], function (cb) {
  var started = false;
  // Start the server at the beginning of the task
  return nodemon({
      script: 'server.js',
      delayTime: 50,
      ignore: ['node_modules/'],
      // socket may be optional
      watch: ['db.js', 'server.js'],
      tasks: ['build_json']
    })
    .on('start', function () {
      if (!started) {
        started = true;
        cb();
      }
      // console.log('Restarting server ...');
    })
    .on('restart', function () {
      console.log('restarting the json-server');
      // shell.task(['json-server --watch ${config.db_file} --port 7000']);
    });
});