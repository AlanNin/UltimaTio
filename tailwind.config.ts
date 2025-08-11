import { type Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        jersey: ["'Jersey 15'", "sans-serif"],
        lilita: ["'Lilita One'", "sans-serif"],
        viga: ["'Viga'", "sans-serif"],
        saira: ["'Saira Stencil One'", "sans-serif"],
        mochiy: ["'Mochiy Pop One'", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        robotocon: ["Roboto-Condensed", "sans-serif"],
      },
      backgroundImage: {
        "signin-background": "url('/backgrounds/signin.jpg')",
        "signup-background": "url('/backgrounds/signup.jpg')",
        "signup-background-mobile": "url('/backgrounds/signup-mobile.jpg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
