export default {
  theme: {
    extend: {
      colors: {
        background: "#ffffff",              // HSL(223.8136 -172.5242% 100%)
        foreground: "#05060b",              // HSL(223.8136 0% 3.9388%)
        card: "#ffffff",                    // same as background
        "card-foreground": "#05060b",       // same as foreground
        popover: "#ffffff",
        "popover-foreground": "#05060b",

        primary: "#111319",                // HSL(223.8136 0% 9.0527%)
        "primary-foreground": "#f3f6fd",   // HSL(223.8136 0.0004% 98.0256%)

        secondary: "#f3f6fd",              // HSL(223.8136 0.0002% 96.0587%)
        "secondary-foreground": "#111319",

        muted: "#f3f6fd",
        "muted-foreground": "#6f7482",     // HSL(223.8136 0% 45.1519%)

        accent: "#f3f6fd",
        "accent-foreground": "#111319",

        destructive: "#d2284a",            // HSL(351.7303 123.6748% 40.5257%)
        "destructive-foreground": "#ffffff",

        border: "#e4e7f0",                 // HSL(223.8136 0.0001% 89.8161%)
        input: "#e4e7f0",
        ring: "#9aa3b7",                   // HSL(223.8136 0% 63.0163%)

        // Chart colors
        "chart-1": "#7dbdff",              // HSL(211.7880 101.9718% 78.6759%)
        "chart-2": "#6199e9",              // HSL(217.4076 91.3672% 59.5787%)
        "chart-3": "#577fbf",              // HSL(221.4336 86.3731% 54.0624%)
        "chart-4": "#51679a",              // HSL(223.6587 78.7180% 47.8635%)
        "chart-5": "#465275",              // HSL(226.5426 70.0108% 39.9224%)

        // Sidebar
        sidebar: "#f3f6fd",
        "sidebar-foreground": "#05060b",
        "sidebar-primary": "#111319",
        "sidebar-primary-foreground": "#f3f6fd",
        "sidebar-accent": "#f3f6fd",
        "sidebar-accent-foreground": "#111319",
        "sidebar-border": "#e4e7f0",
        "sidebar-ring": "#9aa3b7",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "'Helvetica Neue'",
          "Arial",
          "'Noto Sans'",
          "sans-serif",
          "'Apple Color Emoji'",
          "'Segoe UI Emoji'",
          "'Segoe UI Symbol'",
          "'Noto Color Emoji'",
        ],
        serif: [
          "ui-serif",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      borderRadius: {
        DEFAULT: "0.625rem",
      },
      boxShadow: {
        "2xs": "0 1px 3px 0px rgba(0, 0, 0, 0.05)",
        xs: "0 1px 3px 0px rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0px rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)",
        DEFAULT: "0 1px 3px 0px rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)",
        md: "0 1px 3px 0px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.10)",
        lg: "0 1px 3px 0px rgba(0, 0, 0, 0.10), 0 4px 6px -1px rgba(0, 0, 0, 0.10)",
        xl: "0 1px 3px 0px rgba(0, 0, 0, 0.10), 0 8px 10px -1px rgba(0, 0, 0, 0.10)",
        "2xl": "0 1px 3px 0px rgba(0, 0, 0, 0.25)",
      },
      letterSpacing: {
        normal: "0em",
      },
      spacing: {
        base: "0.25rem",
      },
    },
    spacing: {
      px: "1px",
      0: "0",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      56: "224px",
      60: "240px",
      64: "256px",
      72: "288px",
      80: "320px",
      96: "384px",
    },
  },
};
