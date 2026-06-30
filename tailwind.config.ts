import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        newsprint: "#f4edd4",
        "newsprint-accent": "#ebdcae",
        ink: "#1a1a1a",
        "ink-faded": "#3d3d3d",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Arial", "Helvetica", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #000000",
        "hard-sm": "2px 2px 0px 0px #000000",
        "hard-lg": "6px 6px 0px 0px #000000",
      },
    },
  },
  plugins: [],
};

export default config;