/** @type {import("stylelint").Config} */
export default {
    "referenceFiles": ["sources/**/*.css"],
    "extends": [
        "stylelint-config-standard",
        "@stylistic/stylelint-config",
    ],
    "reportInvalidScopeDisables": true,
    "reportNeedlessDisables": true,
    "reportUnscopedDisables": true,
    "rules": {
        "font-family-name-quotes": "always-unless-keyword",
        "value-keyword-case": ["lower", { "ignoreKeywords": ["currentColor"] }],
        "color-hex-length": null,
        "property-no-vendor-prefix": [true, { "severity": "warning" }],
        "selector-no-deprecated": true,
        "no-descending-specificity": [true, { "severity": "warning" }],
        "selector-no-invalid": true,
        "no-unknown-animations": true,
        "no-unknown-custom-media": true,
        "no-unknown-custom-properties": true,
        "unit-no-unknown": true,
        "at-rule-property-required-list": {
            "font-face": ["font-family", "src", "font-style", "font-weight", "font-display"],
        },
        "color-named": ["always-where-possible", { "severity": "warning" }],
        "declaration-no-important": [true, { "severity": "warning" }],
        "unit-disallowed-list": ["ms"], // use "s" instead
        "font-weight-notation": "numeric",
        // complexity
        "max-nesting-depth": [3, { "severity": "warning" }],
        "selector-max-compound-selectors": [5, { "severity": "warning" }],
        // empty lines
        "rule-empty-line-before": null,
        "at-rule-empty-line-before": null,
        "comment-empty-line-before": null,
        "declaration-empty-line-before": null,
        "custom-property-empty-line-before": null,
        // stylistic
        "@stylistic/indentation": [4, { "ignore": "value" }],
        "@stylistic/declaration-colon-newline-after": null,
        "@stylistic/max-line-length": null,
        "@stylistic/unicode-bom": "never",
    },
};
