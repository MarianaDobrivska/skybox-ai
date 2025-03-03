import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".text-outline-sm": {
          textShadow: `
            -2px -2px  0 rgba(127, 44, 154, 0.3),
            2px -2px 0 rgba(127, 44, 154, 0.3),
           -2px 2px 0 rgba(127, 44, 154, 0.3),
            2px 2px 0 rgba(127, 44, 154, 0.3)
          `,
        },
      };

      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
