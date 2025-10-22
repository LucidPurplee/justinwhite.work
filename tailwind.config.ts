import daisyui from "daisyui"

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      mono: ["Space Mono", "ui-monospace", "monospace"],
    },
  },
  plugins: [daisyui, require('@tailwindcss/aspect-ratio'),],
}