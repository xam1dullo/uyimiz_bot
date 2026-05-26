/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["data-theme", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "#f7faf8",
        "bg-soft": "#edf9f2",
        surface: "#ffffff",
        "surface-soft": "#f0f7f3",
        "surface-mint": "#effbf4",
        text: "#203547",
        "text-soft": "#31485a",
        muted: "#82919d",
        line: "#e4edf0",
        mint: "#55c77a",
        "mint-strong": "#26bf69",
        "mint-soft": "#dff7e9",
        red: "#ef6461",
        "red-soft": "#fff0ef",
        blue: "#7d8ff4",
        "blue-soft": "#eef1ff",
        purple: "#9b6df1",
        "purple-soft": "#f3edff",
        yellow: "#f6bd4a",
        "yellow-soft": "#fff6dc",
      },
      borderRadius: {
        xl: "34px",
        lg: "28px",
        md: "22px",
      },
      boxShadow: {
        lg: "0 24px 80px rgba(24, 49, 73, .12)",
        soft: "0 12px 38px rgba(28, 56, 78, .08)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      fontWeight: {
        heavy: "950",
        "920": "920",
        "930": "930",
      },
    },
  },
  plugins: [],
};
