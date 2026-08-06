import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    { ignores: [".coverage/**/*"] },
    {
        linterOptions: {
            reportUnusedInlineConfigs: "warn",
        },
    },
    {
        files: ["sources/**/*.{js,mjs,cjs}", "*.config.*js"],
        plugins: { js },
        languageOptions: {
            globals: globals.browser,
        },
        extends: [
            "js/recommended",
            stylistic.configs.customize({
                indent: 4,
                semi: true,
                quotes: "double",
                jsx: false,
                arrowParens: true,
                quoteProps: "consistent",
            }),
        ],
        rules: {
            // "important" stuff
            "curly": ["error", "all"],
            "eqeqeq": ["error", "always"],
            "no-var": "error",
            "prefer-const": "error",
            "radix": "error",
            // niche stuff
            "array-callback-return": "error",
            "no-duplicate-imports": "error",
            "no-self-compare": "error",
            "no-template-curly-in-string": "warn",
            "no-unreachable-loop": "error",
            "no-use-before-define": ["error", "nofunc"],
            "block-scoped-var": "error",
            "consistent-return": "error",
            "default-param-last": "error",
            "dot-notation": "warn",
            "func-style": ["error", "declaration"],
            "no-empty-function": "error",
            "no-extend-native": "error",
            "no-labels": "error",
            "no-implicit-coercion": "error",
            "no-lone-blocks": "error",
            "no-lonely-if": "error",
            "no-new-wrappers": "error",
            "no-object-constructor": "error",
            "no-proto": "error",
            "no-return-assign": ["error", "always"],
            "no-sequences": ["error", { "allowInParentheses": false }],
            "no-shadow": "error",
            "no-throw-literal": "error",
            "no-unused-expressions": "error",
            "no-useless-concat": "error",
            "no-useless-rename": "error",
            "no-void": "error",
            "prefer-arrow-callback": "error",
            "prefer-numeric-literals": "error",
            "unicode-bom": "error",
            // eval
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-new-func": "error",
            "no-script-url": "error",
            // complexity
            "complexity": ["warn", 20],
            "id-length": ["warn", { "min": 1, "max": 30 }],
            "max-depth": ["warn", 4],
            "max-lines-per-function": ["warn", {
                "max": 60,
                "skipBlankLines": true,
                "skipComments": true,
            }],
            "max-nested-callbacks": ["warn", 4],
            "max-params": ["warn", 4],
            // stylistic
            "@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
            "@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
            "@stylistic/no-multiple-empty-lines": ["error", { "max": 2 }],
            "@stylistic/max-statements-per-line": ["error", { "max": 2 }],
            "@stylistic/object-curly-spacing": ["error", "always", { "emptyObjects": "never" }],
        },
    },
    {
        files: ["sources/tests/*.js", "*.config.*js"],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ["sources/**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
    },
    {
        files: ["sources/**/*.css"],
        plugins: { css },
        language: "css/css",
        extends: ["css/recommended"],
        languageOptions: {
            tolerant: true,
        },
        rules: {
            /* allowUnknownVariables suppresses errors from variables defined in other files.
            Stylelint does proper checking for this kind of error with its `referenceFiles` feature. */
            "css/no-invalid-properties": ["error", { "allowUnknownVariables": true }],
            "css/use-baseline": ["warn", {
                "available": "widely",
                "allowProperties": [
                    "backdrop-filter", // baseline 2024
                ],
                "allowPropertyValues": {
                    "background-attachment": ["fixed"], // only unavailable in iOS
                },
                "allowAtRules": [
                    "starting-style", // baseline 2024
                ],
            }],
            "css/no-important": "warn",
        },
    },
]);
