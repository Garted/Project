/* eslint-disable linebreak-style */
import { task, watch, src, dest, parallel } from "gulp";
import browserSync, { reload, stream } from "browser-sync";
// eslint-disable-next-line no-undef
const sass = require("gulp-sass")(require("sass"));
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import rename from "gulp-rename";
import imagemin from "gulp-imagemin";
import htmlmin from "gulp-htmlmin";

task("server", function () {
	browserSync({
		server: {
			baseDir: "dist",
		},
	});

	watch("src/*.html").on("change", reload);
});

task("styles", function () {
	return src("src/sass/**/*.+(scss|sass)")
		.pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
		.pipe(rename({ suffix: ".min", prefix: "" }))
		.pipe(autoprefixer())
		.pipe(cleanCSS({ compatibility: "ie8" }))
		.pipe(dest("dist/css"))
		.pipe(stream());
});

task("watch", function () {
	watch("src/sass/**/*.+(scss|sass|css)", parallel("styles"));
	watch("src/*.html").on("change", parallel("html"));
	watch("src/js/**/*.js").on("change", parallel("scripts"));
	watch("src/fonts/**/*").on("all", parallel("fonts"));
	watch("src/icons/**/*").on("all", parallel("icons"));
	watch("src/img/**/*").on("all", parallel("images"));
});

task("html", function () {
	return src("src/*.html")
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest("dist/"));
});

task("scripts", function () {
	return src("src/js/**/*.js")
		.pipe(dest("dist/js"))
		.pipe(stream());
});

task("fonts", function () {
	return src("src/fonts/**/*")
		.pipe(dest("dist/fonts"))
		.pipe(stream());
});

task("icons", function () {
	return src("src/icons/**/*")
		.pipe(dest("dist/icons"))
		.pipe(stream());
});

task("images", function () {
	return src("src/img/**/*")
		.pipe(imagemin())
		.pipe(dest("dist/img"))
		.pipe(stream());
});

task(
	"default",
	parallel(
		"watch",
		"server",
		"styles",
		"scripts",
		"fonts",
		"icons",
		"html",
		"images"
	)
);
