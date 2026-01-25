// vite.config.js
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "node:fs";
import path from "node:path";

export default defineConfig(({ mode }) => ({
    root: "sources",
    base: "/Task-Checklist/",

    plugins: [
        createHtmlPlugin({
            minify: true,
            inject: {
                data: {
                    criticalCss: `<style type="text/css">\n${fs.readFileSync(path.resolve(__dirname, "sources/css/critical.css"), "utf-8")}\n</style>`,
                },
            },
        }),
        mode === "release" ? viteSingleFile({removeViteModuleLoader: true}) : null,
    ],

    build: {
        outDir: mode === "release" ? "../release" : "../pages",
        emptyOutDir: true,
    },
}));
