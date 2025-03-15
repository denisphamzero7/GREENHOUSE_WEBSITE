// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  // devtools: { enabled: true },
  modules:[
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  pinia:{
  storesDirs:['./stores/**']
  },
  app: {
    pageTransition: false,
    layoutTransition: false
  },
 
  runtimeConfig:{
    APIURL:"https://localhost:8080/api",
    public:{
      APIURL:"https://localhost:8080/api",
    }
  },
  
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: ["~/plugins/fontawesome.js"]
})
