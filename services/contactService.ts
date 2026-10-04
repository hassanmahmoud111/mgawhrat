export interface ContactInfoResponse {
  email?: string
  phone?: string
  work_hours?: string
  work_days?: string
  commercial_register?: string
  address?: string
  social?: {
    linkedin?: string
    youtube?: string
    instagram?: string
    twitter?: string
    facebook?: string
  }
  [key: string]: any
}

export const fetchContactInfo = async (): Promise<ContactInfoResponse> => {
  const config = useRuntimeConfig()
  return await $fetch('contacts', {
    baseURL: config.public.apiBase // ⚠️ TODO: تأكد إن الاسم ده صح عندك في nuxt.config.ts
  })
}