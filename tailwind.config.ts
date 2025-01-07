import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
  plugins: [require("daisyui"), nextui()],
};

export default config;
