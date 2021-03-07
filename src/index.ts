import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import browserSync from "browser-sync";
import del from "del";
import { dest, lastRun, parallel, series, src, task, watch } from "gulp";
import sourcemaps from "gulp-sourcemaps";
import { terser } from "rollup-plugin-terser";
import { data } from "./data";
import { gulpIf } from "./gulp-if";
import { htmlMinifier } from "./html-minifier";
import { pug } from "./pug";
import { gulpRollup } from "./rollup";
import { sass } from "./sass";

let isProduction = process.env.NODE_ENV === "production";

const DATA = {} as any;

task("clear", async () => {
    return del("dist");
});

task("web", () => {
    return src("CNAME", { allowEmpty: true })
        .pipe(dest("dist"));
});

task("assets", () => {
    return src("assets/**/*", {
        ignore: ["**/_*", "**/sources/**"],
        since: lastRun("assets")
    })
        .pipe(dest("dist/assets"));
});

task("favicon", () => {
    return src("assets/favicon.ico", { allowEmpty: true })
        .pipe(dest("dist"));
});

task("fontawesome", () => {
    return src("node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2")
        .pipe(dest("dist/assets/fonts"));
});

task("data", () => {
    return src("data/**/*", {
        ignore: "**/_*",
        since: lastRun("data")
    })
        .pipe(data(DATA));
});

task("templates", () => {
    return src("src/templates/pages/**/*.pug", {
        ignore: "**/_*"
    })
        .pipe(pug(DATA, isProduction))
        .pipe(gulpIf(isProduction, htmlMinifier({
            collapseWhitespace: true
        })))
        .pipe(dest("dist"));
});

task("styles", () => {
    return src("src/styles/*.scss", {
        ignore: "**/_*"
    })
        .pipe(gulpIf(!isProduction, sourcemaps.init()))
        .pipe(sass({
            outputStyle: isProduction ? "compressed" : "expanded",
            sourceMap: !isProduction
        }))
        .pipe(gulpIf(!isProduction, sourcemaps.write("")))
        .pipe(dest("dist/styles"));
});

task("scripts", () => {
    return src("src/scripts/*.ts", {
        ignore: "**/_*"
    })
        .pipe(gulpIf(!isProduction, sourcemaps.init()))
        .pipe(gulpRollup([
            nodeResolve(),
            commonjs({
                transformMixedEsModules: true
            }),
            typescript()
        ].concat(isProduction ? [terser()] : [])))
        .pipe(gulpIf(!isProduction, sourcemaps.write("")))
        .pipe(dest("dist/scripts"));
});

task("watch", async () => {
    watch("assets/**/*", task("assets"));
    watch("assets/favicon.ico", task("favicon"));

    watch("data/**/*", task("templates:full"));
    watch("src/templates/**/*", task("templates"));

    watch("src/styles/**/*", task("styles"));
    watch("src/scripts/**/*", task("scripts"));

    browserSync.init({
        server: "dist",
        watch: true
    });
});

task("build:init", async () => {
    isProduction = true;
    process.env.NODE_ENV = "production";
});

task("dev:init", async () => {
    isProduction = false;
    process.env.NODE_ENV = "development";
});

task("assets:full", parallel("assets", "favicon", "fontawesome"));
task("templates:full", series("data", "templates"));

task("compile", parallel("assets:full", "styles", "templates:full", "scripts"));

task("build", series("build:init", "clear", "web", "compile"));
task("dev", series("dev:init", "clear", "compile", "watch"));
