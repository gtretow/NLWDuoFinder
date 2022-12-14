/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    fontFamily: { sans: ["Inter, sans-serif"] },
    extend: {
      corlors: {},
      backgroundImage: {
        galaxy: "url('/background.png')",
        gradientSpecial:
          "linear-gradient(90deg, #9572FC 0%, #43E7AD 50.52%, #E2D45C 100%)",
        gameGradient:
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 67.08%)",
      },
    },
  },
  plugins: [],
};
