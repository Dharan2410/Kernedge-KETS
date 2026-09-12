export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0C0B0A",      // near-black — dark section backgrounds / dark text on gold
        paper: "#F6F1E7",    // warm off-white — light section backgrounds / light text on dark
        charcoal: "#1B1815", // elevated dark surface — modal & card backgrounds
        gold: {
          DEFAULT: "#F2B705",
          deep: "#C98F00",
          pale: "#FFE28A",
        },
      },
    },
  },
  plugins: [],
}
 