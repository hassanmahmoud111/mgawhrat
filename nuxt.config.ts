// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  // ⬇️ القسم الناقص - ده اللي كان بيخلي config.public.apiBase = undefined
  runtimeConfig: {
    public: {
      // بيتقرا من .env كـ NUXT_PUBLIC_API_BASE، ولو مش موجود بياخد القيمة الافتراضية دي
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api'
    }
  },

  experimental: {
    appManifest: false
  },

  vite: {
    server: {
      hmr: {
        overlay: false
      }
    }
  },

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Readex+Pro:wght@300;400;500;600;700&family=Almarai:wght@400;700;800&family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap'
        }
      ]
    }
  },

  nitro: {
    prerender: {
      failOnError: false
    }
  },

  i18n: {
    locales: [
      {
        code: 'ar',
        name: 'العربية',
        dir: 'rtl',
        file: 'ar.json'
      },
      {
        code: 'en',
        name: 'English',
        dir: 'ltr',
        file: 'en.json'
      }
    ],
    defaultLocale: 'ar',
    strategy: 'prefix',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'ar'
    }
  }
})