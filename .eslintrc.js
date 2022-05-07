module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.base.json",
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [ ".js", ".jsx", ".ts", ".tsx" ],
      },
    },
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@nrwl/nx",
    "@typescript-eslint",
    "import",
    "import-newlines",
  ],
  rules: {
    "consistent-return": "off",
    "object-curly-spacing": [ 2, "always" ],
    "array-bracket-spacing": [ 2, "always" ],
    quotes: [ "error", "double" ],
    "@typescript-eslint/quotes": [ "error", "double" ],
    "@typescript-eslint/naming-convention": "off",
    "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': [
      'warn', // or error
      { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    semi: [ "error", "always" ],
    indent: "off",
    camelcase: "off",
    "import/extensions": "off",
    "no-restricted-syntax": "off",
    "import/prefer-default-export": [ "off" ],
    "import/no-unresolved": [ 2, { ignore: [ "@\/.*" ] }],
    "import/no-extraneous-dependencies": "off", // Doesn't work with monorepo :/
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
      },
    ],
  },
  overrides: [
    {
      // Overrides for test files
      files: [ "*.spec.ts", "*.spec.js", "**/__tests__/*"],
      rules: {
        "dot-notation": "off",
      }
    }
  ]
};
