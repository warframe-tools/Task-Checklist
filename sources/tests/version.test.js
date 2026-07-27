import { describe, expect, test } from "vitest";
import { APP_VERSION } from "../js/app.js";
import pkg from "../../package.json" with { type: "json" };
import { readFileSync } from "node:fs";
import path from "node:path";

describe("check version numbers", () => {
    test("package.json", () => {
        expect(pkg.version, "package.json version number does not match app.js APP_VERSION").toEqual(APP_VERSION);
    });

    test("SECURITY.md", () => {
        const security = readFileSync(path.resolve(__dirname, "../../SECURITY.md"), "utf-8");
        const major = security.match(/\| Version \| Supported\s*\|[\r\n]*\| -* \| -* \|[\r\n]*\| (\d+)\.x\.x/)[1];
        expect(major, "SECURITY.md version number does not match app.js APP_VERSION major version number").toEqual(APP_VERSION.split(".")[0])
    });
});
