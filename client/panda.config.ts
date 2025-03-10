import { defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  ":root": {
    background: "background",
    "font-family": "Inter",
    color: "text",
    "font-size": "14px",
    sm: { "font-size": "16px" },
  },
  button: {
    background: "text",
    color: "background",
    cursor: "pointer",
    "border-radius": "4px",
    padding: "2px 4px",
    "&:disabled": { cursor: "not-allowed" },
    "&:focus": { outline: "none" },
  },
  h1: { "font-size": "4rem", "font-weight": 800 },
  h2: { "font-size": "2.5rem", "font-weight": 700 },
  h3: { "font-size": "1.5rem", "font-weight": 600 },
  h4: { "font-size": "1.25rem", "font-weight": 600 },
  h5: { "font-size": "1.125rem", "font-weight": 500 },
  h6: { "font-size": "1rem", "font-weight": 500 },
  p: { "line-height": "1.5" },
  fieldset: {
    padding: "8px",
    "border-radius": "4px",
    outline: "neutral",
  },
  "*::placeholder": { color: "textNeutral" },
  legend: { "padding-inline": "4px", "margin-inline": "-4px" },
  "label:has(input[required])::after": {
    content: '"*"',
    color: "textError",
    "margin-left": "4px",
  },
  "input, select, textarea": {
    "font-size": "1rem",
    border: "neutral",
    "border-radius": "4px",
    "&:focus": { outline: "none" },
  },
});

export default defineConfig({
  preflight: true,
  globalCss,
  include: ["./src/**/*.{ts,tsx}"],
  exclude: [],
  jsxFramework: "react",
  conditions: {
    light: "& prefers-color-scheme: light",
    dark: "& prefers-color-scheme: dark",
  },
  theme: {
    tokens: {
      colors: {
        dark: { value: "#000" },
        light: { value: "#fff" },
        neutral: { value: "#ccc" },
        neutral2: { value: "#777" },
        red: { value: "#b00" },
      },
    },
    semanticTokens: {
      borders: {
        neutral: {
          value: {
            base: "1px solid {colors.neutral}",
            _osDark: "1px solid {colors.neutral2}",
          },
        },
      },
      colors: {
        background: {
          value: { base: "{colors.light}", _osDark: "{colors.dark}" },
        },
        text: {
          value: { base: "{colors.dark}", _osDark: "{colors.light}" },
        },
        textNeutral: {
          value: { base: "{colors.neutral}", _osDark: "{colors.neutral2}" },
        },
        textError: {
          value: { base: "{colors.red}", _osDark: "{colors.red}" },
        },
      },
    },
  },
  outdir: "src/panda",
});
