module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: ["prettier", "@typescript-eslint"],
  ignorePatterns: ["**/dist/**/*.js", "**/dist/**/*.d.ts"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-loss-of-precision": "off",
    "no-prototype-builtins": "off",
    "no-case-declarations": "off",
    "no-mixed-spaces-and-tabs": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "array-simple"
      }
    ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          Object: {
            message:
              "Avoid using the `Object` type. Did you mean `object`?"
          },
          Function: {
            message:
              "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
          },
          Boolean: {
            message:
              "Avoid using the `Boolean` type. Did you mean `boolean`?"
          },
          Number: {
            message:
              "Avoid using the `Number` type. Did you mean `number`?"
          },
          String: {
            message:
              "Avoid using the `String` type. Did you mean `string`?"
          },
          Symbol: {
            message:
              "Avoid using the `Symbol` type. Did you mean `symbol`?"
          },
          ["{}"]: false,
          ["object"]: false
        }
      }
    ],
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/explicit-member-accessibility": [
      "off",
      {
        accessibility: "explicit"
      }
    ],
    "@typescript-eslint/member-delimiter-style": [
      "off",
      {
        multiline: {
          delimiter: "none",
          requireLast: true
        },
        singleline: {
          delimiter: "semi",
          requireLast: false
        }
      }
    ],
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-param-reassign": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-unused-expressions": "warn",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/prefer-for-of": "off",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/quotes": ["off", "double"],
    "@typescript-eslint/semi": ["off", null],
    "@typescript-eslint/triple-slash-reference": [
      "error",
      {
        path: "always",
        types: "prefer-import",
        lib: "always"
      }
    ],
    "@typescript-eslint/unified-signatures": "error",
    "arrow-body-style": "off",
    "arrow-parens": ["off", "always"],
    camelcase: "off",
    "comma-dangle": "off",
    complexity: "off",
    "constructor-super": "error",
    curly: "off",
    "default-case": "error",
    eqeqeq: ["warn", "always"],
    "guard-for-in": "error",
    "id-blacklist": [
      "warn",
      "any",
      "Number",
      "String",
      "Boolean",
      "Undefined"
    ],
    "id-match": "error",
    "import/no-default-export": "off",
    "import/no-deprecated": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-internal-modules": "off",
    "import/order": "off",
    "max-classes-per-file": ["error", 2],
    "max-len": "off",
    "max-lines": ["error", 1500],
    "new-parens": "error",
    "no-bitwise": "off",
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-console": [
      "warn",
      {
        allow: [
          "warn",
          "dir",
          "time",
          "timeEnd",
          "timeLog",
          "trace",
          "assert",
          "clear",
          "count",
          "countReset",
          "group",
          "groupEnd",
          "table",
          "debug",
          "info",
          "dirxml",
          "error",
          "groupCollapsed",
          "Console",
          "profile",
          "profileEnd",
          "timeStamp",
          "context"
        ]
      }
    ],
    "no-debugger": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-empty": "off",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-fallthrough": "off",
    "no-invalid-this": "off",
    "no-magic-numbers": "off",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-redeclare": "warn",
    "no-return-await": "error",
    "no-sequences": "error",
    "no-shadow": [
      "off",
      {
        hoist: "all"
      }
    ],
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-underscore-dangle": "off",
    "no-unsafe-finally": "error",
    "no-unused-labels": "error",
    "no-var": "error",
    "no-void": "off",
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "prefer-const": "error",
    "prefer-spread": "off",
    "prefer-object-spread": "off",
    "quote-props": "off",
    radix: "off",
    "space-in-parens": ["error", "never"],
    "use-isnan": "error",
    "valid-typeof": "off"
  },
  overrides: [
    {
      files: ["*.test.js", "*.test.ts"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off"
      }
    }
  ]
};
