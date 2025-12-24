/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "var(--primary-500)",
          600: "var(--primary-600)",
        },
      },
    },
  },
  plugins: [],
}

