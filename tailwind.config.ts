import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#fdfaf5",
          100: "#fdf6ef",
          200: "#f5ede0",
          300: "#e8d5c0",
          400: "#d4b896",
          500: "#c4a07a",
          600: "#b08050",
        },
        terracota: {
          100: "#f5dbc8",
          200: "#e8b898",
          300: "#d4956a",
          400: "#c4783a",
          500: "#8b4513",
          600: "#6b3510",
          700: "#4a2509",
        },
        oro: {
          100: "#fdf3d0",
          200: "#f8e4a0",
          300: "#f0c84a",
          400: "#d4a96a",
          500: "#b8922a",
          600: "#8a6e1a",
        },
        tinta: {
          100: "#8c6e5a",
          200: "#6b4f3c",
          300: "#4a3020",
          400: "#2c1810",
          500: "#1a0e08",
        },
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        garamond: ["var(--font-garamond)", "Georgia", "serif"],
      },
      backgroundImage: {
        "parchment-texture": "url('/textures/parchment.svg')",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spin-reverse 30s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "twinkle": "twinkle 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
