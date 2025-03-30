import { type Config, defineConfig, defineGlobalStyles } from "@pandacss/dev";

const globalCss = defineGlobalStyles({
  ":root": {
    bg: "base",
    color: "text",
  },

  legend: { "padding-inline": "4px", "margin-inline": "-4px" },

  "*::selection": { bg: "text", color: "background" },
});

export const config = {
  eject: true,
  preflight: true,
  jsxFramework: "react",
  globalCss,
  include: ["./src/**/*.{ts,tsx}"],
  presets: ["@pandacss/preset-base"],
  conditions: {
    light: "& prefers-color-scheme: light",
    dark: "& prefers-color-scheme: dark",
  },
  utilities: {
    color: { values: "colors" },
    r: {
      className: "rounded",
      values: "radii",
      group: "Border",
      transform(value) {
        return { borderRadius: value };
      },
    },
    b: {
      className: "border",
      values: "borders",
      group: "Border",
      transform(value) {
        return { border: value };
      },
    },
    fd: {
      className: "flex-direction",
      values: "flexDirection",
      group: "Layout",
      transform(value) {
        return { flexDirection: value };
      },
    },
    ar: {
      className: "ratio",
      group: "Layout",
      transform(value) {
        return { aspectRatio: value };
      },
    },
    ln: {
      className: "outline",
      values: "borders",
      group: "Border",
      transform(value) {
        return { outline: value };
      },
    },
    o: {
      className: "opacity",
      group: "Color",
      transform(value) {
        return { opacity: value };
      },
    },
    g: {
      className: "gap",
      values: "spacing",
      group: "Layout",
      transform(value) {
        return { gap: value };
      },
    },
  },
  theme: {
    tokens: {
      colors: {
        dark: { value: "#020202" },
        light: { value: "#fff" },
        neutral: { value: "#040404" },
        neutral2: { value: "#222" },
        neutral3: { value: "#888" },
        neutral4: { value: "#ddd" },
        tonal: { value: "#f0f0f0" },
        tonal2: { value: "#f8f8f8" },
        tonal3: { value: "#ebebeb" },
        tomato: { value: "#ff6347" },
        green: { value: "#00ff00" },
        blue: { value: "#0000ff" },
        blue2: { value: "#0000cc" },
        lightBlue: { value: "#ebebfc" },
        purple: { value: "#800080" },
        orange: { value: "#ffa500" },
      },
      fonts: {
        body: { value: "'Inter', sans-serif" },
        mono: { value: "monospace" },
      },
    },
    semanticTokens: {
      borders: {
        neutral: {
          value: {
            base: "1px solid {colors.neutral4}",
            _osDark: "1px solid {colors.neutral2}",
          },
        },
        focus: {
          value: {
            base: "2px solid {colors.neutral4}",
            _osDark: "2px solid {colors.neutral4}",
          },
        },
        primary: {
          value: {
            base: "1px solid {colors.dark}",
            _osDark: "1px solid {colors.light}",
          },
        },
        error: {
          value: {
            base: "1px solid {colors.tomato}",
            _osDark: "1px solid {colors.tomato}",
          },
        },
        focusError: {
          value: {
            base: "2px solid {colors.tomato}",
            _osDark: "2px solid {colors.tomato}",
          },
        },
        transparent: {
          value: {
            base: "1px solid transparent",
            _osDark: "1px solid transparent",
          },
        },
      },
      radii: {
        xs: { value: "4px" },
        sm: { value: "8px" },
        md: { value: "16px" },
        lg: { value: "32px" },
        xl: { value: "64px" },
      },
      spacing: {
        xs: { value: "4px" },
        sm: { value: "8px" },
        md: { value: "16px" },
        lg: { value: "32px" },
        xl: { value: "64px" },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.25rem" },
        xl: { value: "1.5rem" },
      },
      colors: {
        base: {
          value: { base: "{colors.tonal2}", _osDark: "{colors.neutral}" },
        },
        background: {
          value: { base: "{colors.light}", _osDark: "{colors.dark}" },
        },
        surface: {
          value: { base: "{colors.tonal2}", _osDark: "{colors.neutral2}" },
        },
        highlight: {
          value: { base: "{colors.tonal3}", _osDark: "{colors.neutral}" },
        },
        text: {
          value: { base: "{colors.dark}", _osDark: "{colors.light}" },
        },
        text2: {
          value: { base: "{colors.neutral3}", _osDark: "{colors.neutral3}" },
        },
        text3: {
          value: { base: "{colors.neutral2}", _osDark: "{colors.neutral2}" },
        },
        textError: {
          value: { base: "{colors.tomato}", _osDark: "{colors.tomato}" },
        },
        outline: {
          value: { base: "{colors.neutral4}", _osDark: "{colors.neutral2}" },
        },
        primary: {
          // value: { base: "{colors.blue}", _osDark: "{colors.blue}" },
          value: { base: "{colors.dark}", _osDark: "{colors.light}" },
        },
        primary2: {
          // value: { base: "{colors.blue2}", _osDark: "{colors.blue2}" },
          value: { base: "{colors.neutral}", _osDark: "{colors.tonal}" },
        },
        onPrimary: {
          value: { base: "{colors.light}", _osDark: "{colors.dark}" },
        },
        primaryTonal: {
          // value: { base: "{colors.lightBlue}", _osDark: "{colors.lightBlue}" },
          value: { base: "{colors.tonal}", _osDark: "{colors.tonal}" },
        },
      },
    },
  },
  outdir: "src/panda",
} satisfies Config;

export default defineConfig(config);
