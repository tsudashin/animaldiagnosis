/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      // コンポーネントで使っているカスタムサイズを追加
      spacing: {
        "11": "2.75rem", // 44px
        "13": "3.25rem", // 52px
        "15": "3.75rem", // 60px
        "18": "4.5rem",  // 72px
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
