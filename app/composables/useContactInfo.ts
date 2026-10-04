// composables/useContactInfo.ts
import { fetchContactInfo as apiFetchContactInfo, type ContactInfoResponse } from '~~/services/contactService'

interface ContactInfo {
  email: string
  phone: string
  workHours: string
  workDays: string
  commercialRegister: string
  address: string
  socialLinks: {
    linkedin?: string
    youtube?: string
    instagram?: string
    twitter?: string
    facebook?: string
  }
}

const cleanStr = (val: any): string => {
  if (val === null || val === undefined) return ''
  return String(val).trim()
}

// بيانات افتراضية تظهر لو الـ API فشل، عشان الصفحة متفضلش فاضية
const FALLBACK_DATA: ContactInfoResponse = {
  email: 'info@mogwharat.com',
  phone: '0096656876293',
  work_hours: 'من 10:00 إلى 22:00',
  work_days: 'الإثنين، الثلاثاء، الأربعاء، الخميس، الجمعة',
  commercial_register: '87542100',
  address: 'المملكه العربيه السعودية - الرياض'
}

export const useContactInfo = () => {
  const contactData = useState<ContactInfoResponse | null>('contact-info-data', () => null)
  const contactLoading = useState<boolean>('contact-info-loading', () => false)
  const contactError = useState<string | null>('contact-info-error', () => null)

  const fetchContactInfo = async () => {
    contactLoading.value = true
    contactError.value = null
    try {
      const data = await apiFetchContactInfo()
      const normalized = (data as any)?.data || data
      contactData.value = normalized && Object.keys(normalized).length > 0 ? normalized : FALLBACK_DATA
    } catch (err: any) {
      // نسجل الخطأ الحقيقي في الكونسول عشان نقدر نشخصه
      console.warn('fetchContactInfo warning, using fallback data:', err)
      contactError.value = err?.data?.message || err?.message || 'Failed to load contact info'
      // مهم: نستخدم الـ fallback عشان الصفحة تفضل شغالة حتى لو الـ API واقع
      contactData.value = FALLBACK_DATA
    } finally {
      contactLoading.value = false
    }
  }

  const contactInfo = computed<ContactInfo>(() => {
    const d = contactData.value || FALLBACK_DATA

    const pick = (...candidates: any[]) => {
      for (const c of candidates) {
        const v = cleanStr(c)
        if (v) return v
      }
      return ''
    }

    return {
      email: pick(d.email, d.contact_email, d.support_email),
      phone: pick(d.phone, d.contact_phone, d.phone_number, d.mobile),
      workHours: pick(d.work_hours, d.working_hours, d.business_hours),
      workDays: pick(d.work_days, d.working_days, d.business_days),
      commercialRegister: pick(d.commercial_register, d.cr_number, d.commercial_register_number),
      address: pick(d.address, d.platform_address, d.location),
      socialLinks: {
        linkedin: pick(d.social?.linkedin, d.linkedin_url, d.linkedin),
        youtube: pick(d.social?.youtube, d.youtube_url, d.youtube),
        instagram: pick(d.social?.instagram, d.instagram_url, d.instagram),
        twitter: pick(d.social?.twitter, d.twitter_url, d.x_url, d.twitter),
        facebook: pick(d.social?.facebook, d.facebook_url, d.facebook)
      }
    }
  })

  return {
    contactData,
    contactInfo,
    contactLoading,
    contactError,
    fetchContactInfo
  }
}