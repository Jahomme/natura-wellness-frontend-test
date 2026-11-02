import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "23.4375rem", // 375px — primary phone baseline
      sm: "40rem",      // 640px — large phones / small tablets
      md: "48rem",      // 768px — tablets
      lg: "64rem",      // 1024px — desktop two-column transition
      xl: "75rem",      // 1200px — exact Part B reference viewport width
    },
    extend: {
      colors: {
        brand: {
          cream: "#FBF8F3",         // Page background
          forest: "#17402F",        // Primary brand green (title, active border, CTA, checkmarks)
          "forest-hover": "#123325",
          "forest-active": "#0E281D",
          sage: "#F3F6F2",          // Selected subscription card fill & active summary tint
          ink: "#1C2420",           // Primary UI text & prices
          slate: "#4A5550",         // Secondary body copy & trust labels
          muted: "#6B7A70",         // Eyebrow, review count, strikethrough price, fine print
          border: "#E7E1D6",        // Image frame border & section divider
          "card-border": "#E1DBCF", // Unselected option card border
          "input-border": "#CFD6D0",// Select & quantity stepper border
          radio: "#8A948E",         // Unselected radio ring
          gold: "#D8A23A",          // 5-star rating fill
          badge: {
            bg: "#F6E7C4",          // "BEST VALUE" & paused badge fill
            text: "#7A5A12",        // "BEST VALUE" & paused badge text
          },
        },
        status: {
          active: {
            bg: "#E6F0EB",
            text: "#17402F",
            border: "#B8D4C5",
          },
          paused: {
            bg: "#FEF6E4",
            text: "#7A5A12",
            border: "#ECCF8B",
          },
          cancelled: {
            bg: "#F1F0EC",
            text: "#4A5550",
            border: "#D8D5CD",
          },
          error: {
            bg: "#FDF2F2",
            text: "#991B1B",
            border: "#F5C2C2",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      fontSize: {
        // Fluid mobile-first display heading: 32px (2rem) at 375px -> exact 42px (2.625rem) at desktop
        "display-fluid": [
          "clamp(2rem, 1.5rem + 2vw, 2.625rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "card-title": [
          "clamp(1.375rem, 1.2rem + 0.75vw, 1.625rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
      },
      borderRadius: {
        frame: "1rem",        // 16px — Left product image card & mobile bottom sheet top corners
        option: "0.75rem",    // 12px — Purchase option cards & Part A sections
        control: "0.625rem",  // 10px — Quantity stepper & Add to cart CTA
      },
      maxWidth: {
        buybox: "75rem",      // 1200px
      },
      minHeight: {
        tap: "3rem",          // 48px mobile coarse-pointer tap target
      },
      minWidth: {
        tap: "3rem",          // 48px mobile coarse-pointer tap target
      },
      boxShadow: {
        card: "0 1px 3px rgba(28, 36, 32, 0.04), 0 6px 16px rgba(28, 36, 32, 0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
