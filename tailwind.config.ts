import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Core palette — do not add colours outside this set. */
        primary: {
          DEFAULT: "#1F5D3A",
          hover: "#174A2E",
        },
        accent: {
          DEFAULT: "#C2571A",
          hover: "#A94A14",
        },
        page: "#FAF7F2",
        card: "#FFFFFF",
        line: "#E6E0D6",
        ink: "#1E2A24",
        muted: "#5B665F",
        cream: "#F3EDE2",
        softgreen: "#E3F2E8",
        risk: {
          safe: "#2E7D4F",
          "safe-bg": "#E3F2E8",
          soon: "#9A6414",
          "soon-bg": "#FBF0D9",
          review: "#B3382C",
          "review-bg": "#FBE4E1",
        },

        /* Compatibility aliases so the inner pages keep working until they
           are migrated. These resolve to palette values above. */
        secondary: "#1F5D3A",
        lightgreen: "#E3F2E8",
        success: "#E3F2E8",
        warning: "#FBF0D9",
        error: "#FBE4E1",
        info: "#F3EDE2",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "Cambria", "serif"],
        bangla: ["var(--font-hind-siliguri)", "Noto Sans Bengali", "sans-serif"],
      },
      fontSize: {
        h1: ["32px", { lineHeight: "1.18", fontWeight: "600", letterSpacing: "-0.015em" }],
        h2: ["25px", { lineHeight: "1.24", fontWeight: "600", letterSpacing: "-0.01em" }],
        h3: ["19px", { lineHeight: "1.36", fontWeight: "600" }],
        lead: ["18px", { lineHeight: "1.65", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.65", fontWeight: "400" }],
        small: ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        label: ["14px", { lineHeight: "1.45", fontWeight: "500" }],
        caption: ["12.5px", { lineHeight: "1.5", fontWeight: "400" }],
        btn: ["15px", { lineHeight: "1.4", fontWeight: "600" }],
      },
      borderRadius: {
        lg: "8px",
        xl: "12px",
        "2xl": "12px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(30, 42, 36, 0.04), 0 8px 24px rgba(30, 42, 36, 0.05)",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
