/** @type {import('tailwindcss').Config} */
export default {
  // build.mjs is scanned too: the language switcher markup lives there.
  content: ["./src/template.html", "./build.mjs"],
  theme: {
    extend: {
      colors: {
        background: "oklch(98.5% 0.006 90 / <alpha-value>)",
        foreground: "oklch(20% 0.07 265 / <alpha-value>)",
        card: "oklch(100% 0 0 / <alpha-value>)",
        "card-foreground": "oklch(20% 0.07 265 / <alpha-value>)",
        primary: "oklch(24% 0.08 265 / <alpha-value>)",
        "primary-foreground": "oklch(98% 0.008 90 / <alpha-value>)",
        secondary: "oklch(95% 0.01 90 / <alpha-value>)",
        "secondary-foreground": "oklch(24% 0.08 265 / <alpha-value>)",
        muted: "oklch(95% 0.01 90 / <alpha-value>)",
        "muted-foreground": "oklch(45% 0.04 265 / <alpha-value>)",
        accent: "oklch(55% 0.21 25 / <alpha-value>)",
        border: "oklch(90% 0.015 90 / <alpha-value>)",
        input: "oklch(92% 0.012 90 / <alpha-value>)",
        ring: "oklch(55% 0.21 25 / <alpha-value>)",
        "brand-navy": "oklch(24% 0.08 265 / <alpha-value>)",
        "brand-navy-deep": "oklch(18% 0.07 265 / <alpha-value>)",
        "brand-red": "oklch(55% 0.21 25 / <alpha-value>)",
        "brand-gold": "oklch(78% 0.13 80 / <alpha-value>)",
        "brand-cream": "oklch(98% 0.008 90 / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
