// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";

export default tseslint.config(
  {
    ignores: ["**/*.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  perfectionist.configs["recommended-natural"],
  {
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
    },
  },
);
