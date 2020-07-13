var browserSync = require('browser-sync');
const { watch } = require('gulp');
var gulp = require('gulp');
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
var sourcemaps = require('gulp-sourcemaps');

let config = {
    pubdir: "./public/",
    scss: "./_scss/",
    styles: "./public/css/"
}


function tconnect(){
    
    browserSync.init({
        server: "./public",        
                   
    });
    
};

function treload(cb){
    browserSync.reload();    
    cb();
};

function tsass(){
    return gulp.src([config.scss+'*.scss', config.scss+'*.sass' ])        
        .pipe(sourcemaps.init())
        //.pipe(concat(config.sass.stylesheetname))
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('_maps/'))
        .pipe(gulp.dest(config.styles));
};

exports.dev = function(){  
    tconnect();
    console.log(config.scss+'**/*.scss');
    watch( [config.scss+'*.scss', config.scss+'*.sass' ], tsass);
    watch( [config.pubdir+'**/*.js', config.pubdir+'**/*.html', config.styles+'**/*.css'], treload);
};

exports.scss = tsass;

