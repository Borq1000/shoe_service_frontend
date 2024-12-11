/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        secondary: "var(--secondary)",
        "gray-light": "var(--gray-light)",
        "gray-lighter": "var(--gray-lighter)",
        "border-color": "var(--border-color)",
      },
      fontFamily: {
        sans: ["var(--font-cereal)", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 16px rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};
