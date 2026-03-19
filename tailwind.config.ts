import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#050816",
        panel: "#0b1023",
        line: "#1e293b",
        accent: {
          DEFAULT: "#22d3ee",
          warm: "#fb7185",
          gold: "#fbbf24"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.16), 0 24px 80px rgba(2,6,23,0.55)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(34,211,238,0.18), transparent 28%), radial-gradient(circle at 80% 20%, rgba(251,113,133,0.16), transparent 20%), linear-gradient(135deg, rgba(15,23,42,0.95), rgba(2,6,23,1))"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
