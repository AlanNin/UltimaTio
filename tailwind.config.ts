import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
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
        "login-background": "url('/public_assets/LoginBackground.jpg')",
        "signup-background-mobile": "url('/public_assets/SignupBackgroundMobile.jpg')",
        "signup-background-desktop": "url('/public_assets/SignupBackgroundDesktop.jpg')",
      },
    },
  },
  plugins: [],
} satisfies Config;
