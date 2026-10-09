/** @type {import('tailwindcss').Config} */
export default {
  // build.mjs is scanned too: the language switcher markup lives there.
  content: ["./src/template.html", "./src/news.html", "./src/press.html", "./build.mjs"],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f8fafc",
        card: "#071126",
        "card-foreground": "#f8fafc",
        primary: "#29AAE1",
        "primary-foreground": "#ffffff",
        secondary: "#00264C",
        "secondary-foreground": "#f8fafc",
        muted: "#0d1b38",
        "muted-foreground": "#94a3b8",
        accent: "#29AAE1",
        border: "rgba(255, 255, 255, 0.08)",
        ring: "#29AAE1",
        "brand-navy": "#00264C",
        "brand-navy-deep": "#00172e",
        "brand-red": "#CC1517",
        "brand-orange": "#F05A24",
        "brand-yellow": "#FFD012",
        "brand-green": "#39B44A",
        "brand-cyan": "#29AAE1",
        "brand-purple": "#92278E",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Montserrat", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
