const gulp = require('gulp');
const babel = require('gulp-babel');
const flatten = require('gulp-flatten');
const gulpUtil = require('gulp-util');
const header = require('gulp-header');
const rename = require('gulp-rename');
const del = require('del');
const webpackStream = require('webpack-stream');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const DEVELOPMENT_HEADER = [
  '/**',
  ' * Flux v<%= version %>',
  ' */',
].join('\n') + '\n';
const PRODUCTION_HEADER = [
  '/**',
  ' * Flux v<%= version %>',
  ' *',
  ' * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.',
  ' *',
  ' * This source code is licensed under the BSD-style license found in the',
  ' * LICENSE file in the root directory of this source tree. An additional grant',
  ' * of patent rights can be found in the PATENTS file in the same directory.',
  ' */',
].join('\n') + '\n';

const currentVersion = require('./package.json').version;
const paths = {
  dist: './dist/',
  lib: 'lib',
  entry: './index.js',
  entryUtils: './utils.js',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
};

const buildDist = function (opts) {
  const webpackOpts = {
    // debug: opts.debug,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['fbjs']
            }
          }
        }
      ]
    },
    output: {
      filename: opts.output,
      libraryTarget: 'umd',
      library: opts.library,
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          opts.debug ? 'development' : 'production'
        ),
      })
    ]
  };
  if (!opts.debug) {
    webpackOpts.optimization= {
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          compress: {
            warnings: false,
          },
        }),
      ],
    }
  }
  return webpackStream(webpackOpts, null, function (err, stats) {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', '\n' + stats.toString({ colors: true }));
    }
  });
};

function clean() {
  return del([paths.lib, paths.dist, 'Flux.js']);
};

function libs() {
  return gulp
    .src(paths.src)
    // .pipe(babel())
    // .pipe(babel(babelDefaultOptions))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
};

function flow() {
  return gulp
    .src(paths.src)
    .pipe(flatten())
    .pipe(rename({ extname: '.js.flow' }))
    .pipe(gulp.dest(paths.lib));
};

async function distDefault() {
  const distOpts = {
    debug: true,
    output: 'Flux.js',
    library: 'Flux',
  };
  return gulp.src(paths.entry)
    .pipe(buildDist(distOpts))
    .pipe(header(DEVELOPMENT_HEADER, {
      version: currentVersion,
    }))
    .pipe(gulp.dest(paths.dist)
    )
}

async function distUtils() {
  const distOpts = {
    debug: true,
    output: 'FluxUtils.js',
    library: 'FluxUtils',
  };
  return gulp
    .src(paths.entryUtils)
    .pipe(buildDist(distOpts))
    .pipe(header(DEVELOPMENT_HEADER, {
      version: currentVersion,
    }))
    .pipe(gulp.dest(paths.dist))
}

async function distMin() {
  const distOpts = {
    debug: false,
    output: 'Flux.min.js',
    library: 'Flux',
  };
  return gulp
    .src(paths.entry)
    .pipe(buildDist(distOpts))
    .pipe(header(PRODUCTION_HEADER, {
      version: currentVersion,
    }))
    .pipe(gulp.dest(paths.dist))
}

async function distUtilsMin() {
  const distOpts = {
    debug: false,
    output: 'FluxUtils.min.js',
    library: 'FluxUtils',
  };
  return gulp
    .src(paths.entryUtils)
    .pipe(buildDist(distOpts))
    .pipe(header(PRODUCTION_HEADER, {
      version: currentVersion,
    }))
    .pipe(gulp.dest(paths.dist))
}

var build = gulp.series(
  libs,
  flow,
  distDefault
);

var publish = gulp.series(
  libs,
  flow,
  distDefault,
  distMin,
  distUtils,
  distUtilsMin,
  distUtilsMin
);


exports.clean = clean;
exports.libs = libs;
exports.flow = flow;
exports.buildDist = buildDist;
exports.distDefault = distDefault;
exports.distUtils = distUtils;
exports.distMin = distMin;
exports.distUtilsMin = distUtilsMin;
exports.publish = publish;
exports.build = build;
exports.default = build;