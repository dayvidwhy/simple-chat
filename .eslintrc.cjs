module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
        node: true, // Add node environment
    },
    ignorePatterns: ["build/*", "node_modules/*"],
    extends: "@remix-run/eslint-config",
    "rules": {
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-extra-semi": "off",
        "@typescript-eslint/no-extra-semi": "off",
        "eol-last": ["error", "always"],
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
    }
};
