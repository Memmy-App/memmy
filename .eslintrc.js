module.exports = {
  env: {
    es2021: true,
  },
  extends: ["plugin:react/recommended", "standard-with-typescript"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
  },
  plugins: ["react"],
  rules: {
    "@typescript-eslint/quotes": [2, "single", { avoidEscape: true }],
    "@typescript-eslint/comma-dangle": [2, "always-multiline"],
    "@typescript-eslint/semi": [2, "always"],
    "@typescript-eslint/space-before-function-paren": [2, "never"],
    "@typescript-eslint/member-delimiter-style": [2,
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": true
        },
        "overrides": {
          "interface": {
            "multiline": {
              "delimiter": "semi",
              "requireLast": true
            }
          }
        }
      }],
    "@typescript-eslint/consistent-type-definitions": [2, "interface"],
    "@typescript-eslint/consistent-type-imports": [2, { prefer: "no-type-imports" }],
  },
};
