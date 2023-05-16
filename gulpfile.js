const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("gulp-autoprefixer"); // настройка browserslist находится в pagkage.json
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const csso = require("gulp-csso");
const gcmq = require("gulp-group-css-media-queries");
const gulpif = require("gulp-if");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass")(require("sass"));
const svgSprite = require("gulp-svg-sprite");
// const terser = require('gulp-terser');

let isProd = false;

const toProd = (done) => {
  isProd = true;
  done();
};

const cleanDist = () => {
  return src("dist", { read: false, allowEmpty: true }).pipe(clean({ force: true }));
};

const buildHtml = () => {
  return src("src/index.html")
    .pipe(
      gulpif(
        isProd,
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
    )
    .pipe(dest("dist"));
};

const buildStyles = () => {
  return src("src/scss/main.scss")
    .pipe(sass())
    .pipe(gulpif(isProd, autoprefixer()))
    .pipe(gulpif(isProd, gcmq()))
    .pipe(gulpif(isProd, csso()))
    .pipe(concat("style.css"))
    .pipe(dest("dist"));
};

const buildSprite = () => {
  return src("src/assets/images/sprite-icons/*.svg")
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [{ removeXMLNS: true }],
        }),
      ])
    )
    .pipe(
      svgSprite({
        mode: {
          symbol: true,
        },
      })
    )
    .pipe(concat("sprite.svg"))
    .pipe(dest("dist/assets/images"));
};

// const buildScripts = () => {
//   return src('src/index.js')
//     .pipe(
//       gulpif(
//         isProd,
//         terser({
//           toplevel: true,
//         })
//       )
//     )
//     .pipe(concat('index.js'))
//     .pipe(dest('dist'));
// };

const buildImages = () => {
  return src(["src/assets/favicons/*", "src/assets/images/**/*"], {
    ignore: "src/assets/images/sprite-icons/**",
    base: "src/assets",
  })
    .pipe(gulpif(isProd, imagemin([imagemin.mozjpeg({ quality: 95 }), imagemin.svgo()])))
    .pipe(dest("dist/assets"));
};

// const copyAssetFiles = () => {
//   return src(['src/assets/fonts/*', 'src/assets/icons.svg'], {
//     base: 'src/assets',
//   }).pipe(dest('dist/assets'));
// };

const mainTasks = parallel(buildHtml, buildStyles, buildSprite, buildImages);
// const mainTasks = parallel(buildHtml, buildStyles, buildSprite, buildImages, copyAssetFiles, buildScripts);

const watchTask = () => {
  watch("src/index.html", buildHtml);
  watch("src/scss/**/*.scss", buildStyles);
  watch("src/assets/images/sprite-icons/*.svg", buildSprite);
  watch(
    ["src/assets/favicons/*", "src/assets/images/**/*"],
    { ignored: "src/assets/images/sprite-icons/**" },
    buildImages
  );
  // watch(['src/assets/fonts/*', 'src/assets/icons.svg'], copyAssetFiles);
  // watch('src/index.js', buildScripts);
};

exports.default = series(mainTasks, watchTask);
exports.build = series(toProd, cleanDist, mainTasks);

exports.clean = cleanDist;
