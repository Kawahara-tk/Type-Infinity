import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#3b82f6", // Blue-500
        secondary: "#10b981", // Emerald-500
        background: "#0f172a", // Slate-900
        surface: "#1e293b", // Slate-800
        text: "#f8fafc", // Slate-50
        muted: "#94a3b8", // Slate-400
        error: "#ef4444", // Red-500
      }
    },
  },
  plugins: [],
};
export default config;
