import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#245C45",
        secondary: "#3B8062",
        lightgreen: "#E7F2EB",
        page: "#F5F7F5",
        card: "#FFFFFF",
        ink: "#25332B",
        muted: "#6B7870",
        line: "#DDE5DF",
        success: "#DDF3E4",
        warning: "#FFF1CC",
        error: "#FCE3E1",
        info: "#E1EDFC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        bangla: ["var(--font-noto-bengali)", "sans-serif"],
      },
      fontSize: {
        h1: ["28px", { lineHeight: "1.25", fontWeight: "700" }],
        h2: ["22px", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        label: ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "1.5", fontWeight: "400" }],
        btn: ["14px", { lineHeight: "1.4", fontWeight: "600" }],
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(37,51,43,0.04), 0 8px 24px rgba(37,51,43,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
