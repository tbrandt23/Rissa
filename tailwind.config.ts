import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "foreground-cool": "var(--foreground-cool)",
        muted: "var(--muted)",
        border: "var(--border)",
        "border-soft": "var(--border-soft)",
      },
      fontFamily: {
        display: ["Cabinet Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Satoshi", "ui-sans-serif", "system-ui", "sans-serif"],
        accent: ["Fraunces", "ui-serif", "Georgia", "serif"],
      },
      letterSpacing: {
        "tightest-display": "-0.04em",
        "tight-display": "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
