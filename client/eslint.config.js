import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { settings: { react: { version: "detect" } } },
  { languageOptions: { globals: globals.browser } },
  { ignores: ["src/panda/**", "dist/**"] },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "_",
          argsIgnorePattern: "_",
          caughtErrorsIgnorePattern: "_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
