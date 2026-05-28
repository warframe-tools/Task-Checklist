// vite.config.js
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { execSync } from "node:child_process";

process.env.VITE_GIT_COMMIT_HASH = execSync("git rev-parse HEAD").toString().trim(); // only updated on vite restart

export default defineConfig(({ mode }) => ({
    root: "sources",
    base: "/Task-Checklist/",
    cacheDir: "../.vite",

    plugins: [
        mode === "release" ? viteSingleFile({removeViteModuleLoader: true}) : null,
    ],

    build: {
        outDir: mode === "release" ? "../release" : "../pages",
        emptyOutDir: true,
    },

    test: {
        environment: "jsdom",
        restoreMocks: true,
        coverage: {
            reportsDirectory: "../.coverage",
            exclude: ["img/", "*.json"]
        }
    }
}));
