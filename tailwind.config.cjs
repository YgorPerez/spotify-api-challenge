/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-gray": "#999999",
        "dark-gray": "#161616",
        "white-gray": "#fafafa",
        "opacity-gray": "rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-brand-colors"),
    require("tailwindcss-debug-screens"),
  ],
};
