import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        landing: "url('/Animated.svg')",
      },
      fontFamily: {
        sans: ["'Open Sans'", ...fontFamily.sans], // Set Open Sans as the primary sans font
      },
    },
  },
  plugins: [require("daisyui")],
};

export default config;
