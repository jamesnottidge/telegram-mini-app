import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-25": "#FDFAFF",
        "brand-200": "#ECD5FF",
        "brand-300": "#DDB4FE",
        "brand-700": "#8A22CE",

        "gray-50": "#FAFAFA",
        "gray-200": "#E9EAEB",
        "gray-400": "#A4A7AE",
        "gray-500": "#8B8F98",
        "gray-600": "#595E69",
        "gray-900": "#181D27",

        "success-50": "#ECFDF3",
        "success-200": "#ABEFC6",
        "success-600": "#079455",

        "error-25": "#FFFBFA",
        "error-50": "#FEF3F2",
        "error-200": "#FECDCA",
        "error-600": "#D92D20",

        "warning-25": "#FFFDF5",
        "warning-200": "#FFE785",
        "warning-600": "#F59D00",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      animation: {
        "zoom-in": "zoom-in 0.4s ease-in-out forwards",
        "fade-in-and-out":
          "fade-in-and-out 0.75s ease-in-out alternate infinite",
      },
      boxShadow: {
        xs: " 0px 1px 2px 0px rgba(10, 13, 18, 0.05)",
      },
      keyframes: {
        "zoom-in": {
          "0%": {
            transform: "scale(0)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "fade-in-and-out": {
          "0%": {
            opacity: "0.3",
          },
          "100%": {
            transform: "1",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
