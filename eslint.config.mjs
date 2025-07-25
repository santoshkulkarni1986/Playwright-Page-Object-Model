import { defineFlatConfig } from "eslint-define-config";

export default defineFlatConfig([
  {
    languageOptions: {
      parser: "@typescript-eslint/parser",
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
]);
