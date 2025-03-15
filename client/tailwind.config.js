/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    screens:{
      xs:"614px",
      sm: "768px",
      md: "992px",
      lg: "1200px",
      xl: "1440px",
    },
    extend: {
      colors:{
        primary:{
          "50": "#E6F4E6",
          "100": "#C1E4C1",
          "200": "#9BD49B",
          "300": "#76C476",
          "400": "#51B351",
          "500": "#2CA32C",
          "600": "#238223",
          "700": "#1A611A",
          "800": "#124012",
          "900": "#091F09",
        },
        secondary:{
          "50": "#FFF7D1",
          "100": "#FFE89A",
          "200": "#FFD700",
          "300": "#F1C40F",
          "400": "#E2A400",
          "500": "#C98A00",
        },
        earth:{
          "50": "#F5EDE1",
          "100": "#EADBC8",
          "200": "#D2B48C",
          "300": "#A67B5B",
          "400": "#8B5A2B",
        },
        neutral:{
          "50": "#F8F9FA",
          "100": "#EAEDED",
          "200": "#BDC3C7",
          "300": "#95A5A6",
        },
      },
      spacing:{
        "48":"22rem",
        "96":"44rem",
        "128":"56rem",
      },
      fontFamily:{
        sans:"Poppins, Arial, sans-serif",
      },
      maxWidth:{
        "xl":"1440px",
      },
      borderRadius:{
        "xl":"20px",
      },
      transitionDuration:{
        "default":"0.3s",
      },
    },
  },
  plugins: [],
}
