// 小程序框架v1.0.0
const gulp = require('gulp')
const less = require('gulp-less')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const changed = require('gulp-changed')
const del = require('del')

const ENV = process.env.NODE_ENV
const suffix = ENV === 'production' ? 'prod' : 'dev'

// 1. 不需要编译 & 不需要重命名的文件
const directDistFiles = function () {
  return gulp.src(['./src/**/*', './public/**/*', '!./src/**/*.less'])
            .pipe(gulp.dest('./dist'))
}

// 2. 需要重命名的文件，但不需要编译
const renameToDistFiles = function () {
  // 2.1 重命名constant.js
  const renameConstant = function () {
    return gulp.src(`./env/constant.${suffix}.js`)
              .pipe(rename('constant.js'))
              .pipe(gulp.dest('./dist'))
  }

  // 2.2 重命名project.config.json
  const renameConfig = function () {
    return gulp.src(`./env/project.${suffix}.config.json`)
              .pipe(rename('project.config.json'))
              .pipe(gulp.dest('./dist'))
  }

  return gulp.parallel([renameConstant, renameConfig])
}

// 3. 需要编译的Less文件，打包时全量打包
const lessFileCompiler = function () {
  // 3.1 迁移所有less文件到__dist__进行预编译
  const preCollectFile = function () {
    const preRenameEnvLess = function () {
      return gulp.src(`./env/variables.${suffix}.less`)
                .pipe(rename('variables.less'))
                .pipe(gulp.dest('./__dist__'))
    }
    const preCollectSrcLess = function () {
      return gulp.src(`./src/**/*.less`)
                .pipe(gulp.dest('./__dist__'))
    }

    return gulp.parallel([preRenameEnvLess, preCollectSrcLess])
  }
  // 3.2 将__dist__下的less文件结构进行全量编译
  const lessCompiler = function () {
    return gulp.src(`./__dist__/**/*.less`)
              .pipe(less().on('error', function(e) {
                console.error(e.message)
                this.emit('end')
              }))
              .pipe(cleanCSS())
              .pipe(rename(function(path) {
                path.extname = '.wxss'
              }))
              .pipe(gulp.dest('./dist'))
  }
  const cleanTempDist = function () {
    return del('./__dist__')
  }

  return gulp.series(preCollectFile(), lessCompiler, cleanTempDist)
}

// gulp tasks for watch
// 1. 不需要编译 & 不需要重命名的文件
const directDistFilesWatcher = function () {
  return gulp.src(['./src/**/*', './public/**/*', '!./src/**/*.less'])
            .pipe(changed('./dist'))
            .pipe(gulp.dest('./dist'))
}
// 2.1 重命名constant.js
const renameConstantWatcher = function () {
  return gulp.src(`./env/constant.${suffix}.js`)
            .pipe(rename('constant.js'))
            .pipe(changed('./dist'))
            .pipe(gulp.dest('./dist'))
}
// 2.2 重命名project.config.json
const renameConfigWatcher = function () {
  return gulp.src(`./env/project.${suffix}.config.json`)
            .pipe(rename('project.config.json'))
            .pipe(changed('./dist'))
            .pipe(gulp.dest('./dist'))
}
// 3.1 迁移所有less文件到__dist__准备编译
const preCollectLessFiles = function () {
  const preCollectEnvLess = function () {
    return gulp.src(`./env/variables.${suffix}.less`)
              .pipe(rename('variables.less'))
              .pipe(gulp.dest('./__dist__'))
  }
  const preCollectSrcLess = function () {
    return gulp.src('./src/**/*.less')
              .pipe(gulp.dest('./__dist__'))
  }

  return gulp.parallel([preCollectEnvLess, preCollectSrcLess])
}
const srcLessFileWatcher = function () {
  return gulp.src('./src/**/*.less')
            .pipe(changed('./__dist__'))
            .pipe(gulp.dest('./__dist__'))
}
// TODO: less文件在预编译阶段无法比对出修改，无法通过changed方法进行过滤
const tempLessFileCompiler = function () {
  return gulp.src('./__dist__/**/*.less')
            .pipe(less().on('error', function(e) {
              console.error(e.message)
              this.emit('end')
            }))
            .pipe(cleanCSS())
            .pipe(rename(function(path) {
              path.extname = '.wxss'
            }))
            .pipe(gulp.dest('./dist'))
}

// ==== Tools ====
const cleanTempDist = function () {
  return del('./__dist__')
}
const cleanDist = function () {
  return del('./dist')
}
// ===============

gulp.task('default', gulp.series(cleanTempDist, cleanDist, directDistFiles, renameToDistFiles(), lessFileCompiler()))
gulp.task('watch', () => {
  gulp.watch(['./src/**/*', './public/**/*', '!./src/**/*.less'], directDistFilesWatcher)
  gulp.watch(`./env/project.${suffix}.config.json`, renameConfigWatcher)
  gulp.watch(`./env/constant.${suffix}.js`, renameConstantWatcher)
  gulp.watch(`./env/variables.${suffix}.less`, lessFileCompiler)
  gulp.watch(`./src/**/*.less`, srcLessFileWatcher)
  gulp.watch(`./__dist__/**/*.less`, tempLessFileCompiler)
})
gulp.task('dev', gulp.series('default', preCollectLessFiles(), 'watch'))