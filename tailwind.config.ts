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
        // Custom Palette: #6A89A7, #BDDDFC, #88BDF2, #384959
        brand: {
          steel: "#6A89A7",
          ice: "#BDDDFC",
          sky: "#88BDF2",
          navy: "#384959",
          deep: "#1a242f",
          surface: "#243240",
          card: "#2b3b4b",
          border: "#384959",
        },
        soc: {
          dark: "#1a242f",
          surface: "#243240",
          card: "#2b3b4b",
          border: "#384959",
          cyan: "#88BDF2",
          indigo: "#6A89A7",
          ice: "#BDDDFC",
          navy: "#384959",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          purple: "#88BDF2"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px -3px rgba(136, 189, 242, 0.35)",
        "glow-ice": "0 0 20px -3px rgba(189, 221, 252, 0.35)",
        "glow-red": "0 0 20px -5px rgba(244, 63, 94, 0.3)",
        "glow-amber": "0 0 20px -5px rgba(245, 158, 11, 0.3)",
        "glow-emerald": "0 0 20px -5px rgba(16, 185, 129, 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
