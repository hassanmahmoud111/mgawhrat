<template>
  <div class="signup-wrapper">
    <div class="signup-card">
      <div class="signup-header">
        <h1>إنشاء حساب جديد</h1>
        <p>انضمي إلينا واستمتعي بتجربة تسوق فاخرة</p>
      </div>

      <form @submit.prevent="handleRegister" class="signup-form">
        <div class="form-group">
          <label>الاسم الكامل</label>
          <input
            v-model="form.full_name"
            type="text"
            placeholder="أدخلي اسمك الكامل"
            required
          />
        </div>

        <div class="form-group">
          <label>الدولة</label>
          <div class="custom-select" :class="{ open: countryDropdownOpen }" ref="countrySelectRef">
            <button
              type="button"
              class="custom-select-trigger"
              @click="toggleCountryDropdown"
            >
              <span class="select-chevron">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="selected-text" :class="{ placeholder: !selectedCountry }">
                <span class="selected-country-display" v-if="selectedCountry">
                  <span class="country-flag" v-if="selectedCountry.flag">{{ selectedCountry.flag }}</span>
                  <span>{{ selectedCountry.name?.ar || selectedCountry.name }}</span>
                </span>
                <span v-else>اختر الدولة</span>
              </span>
            </button>

            <transition name="dropdown-fade">
              <ul class="custom-select-options" v-if="countryDropdownOpen">
                <li
                  v-for="country in countries"
                  :key="country.id"
                  class="custom-select-option"
                  :class="{ active: selectedCountry && selectedCountry.id === country.id }"
                  @click="selectCountry(country)"
                >
                  <div class="country-option-content">
                    <span class="country-info">
                      <span class="country-flag" v-if="country.flag">{{ country.flag }}</span>
                      <span class="country-name">{{ country.name?.ar || country.name }}</span>
                    </span>
                    <span class="country-code" dir="ltr">{{ country.code }}</span>
                  </div>
                </li>
                <li v-if="!countries.length" class="custom-select-option empty">
                  لا توجد دول متاحة
                </li>
              </ul>
            </transition>
          </div>
        </div>

        <div class="form-group">
          <label>البريد الإلكتروني</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label>رقم الهاتف</label>
          <div class="phone-input-group">
            <input
              v-model="form.phone"
              type="tel"
              :placeholder="phonePlaceholder"
              @input="handlePhoneInput"
              required
              class="phone-input"
            />
            <button
              type="button"
              class="phone-code clickable"
              v-if="selectedCountry"
              @click="toggleCountryDropdown"
              title="تغيير الدولة"
            >
              <span v-if="selectedCountry.flag" class="phone-code-flag">{{ selectedCountry.flag }}</span>
              <span dir="ltr">{{ selectedCountry.code }}</span>
            </button>
          </div>
          <span class="hint-text" v-if="phoneHint">{{ phoneHint }}</span>
        </div>

        <!-- Terms and Conditions Checkbox -->
        <div class="terms-group">
          <label class="terms-label">
            <input
              type="checkbox"
              v-model="agreeTerms"
              class="terms-checkbox"
              @change="clearErrors"
            />
            <span>
              أوافق على
              <NuxtLink :to="localePath('/terms')" target="_blank" class="terms-link">الشروط والأحكام</NuxtLink>
              و
              <NuxtLink :to="localePath('/privacy')" target="_blank" class="terms-link">سياسة الخصوصية</NuxtLink>
            </span>
          </label>
        </div>

        <p v-if="validationError || authStore.error" class="error-message">
          {{ validationError || authStore.error }}
        </p>

        <button type="submit" class="submit-btn" :disabled="authStore.loading">
          <span v-if="authStore.loading" class="spinner"></span>
          {{ authStore.loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب' }}
        </button>
      </form>

      <div class="signup-footer">
        <p>
          عندك حساب بالفعل؟
          <NuxtLink :to="localePath('/auth/login')">تسجيل الدخول</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import signupCollection from '~~/services/signup/signup'

definePageMeta({
  hideHeader: true
})

const authStore = useAuthStore()
const localePath = useLocalePath()

const defaultCountries = [
  {
    id: 1,
    backendId: 1,
    iso: 'SA',
    code: '+966',
    flag: '🇸🇦',
    name: { ar: 'المملكة العربية السعودية', en: 'Saudi Arabia' }
  },
  {
    id: 'eg',
    backendId: 1,
    iso: 'EG',
    code: '+20',
    flag: '🇪🇬',
    name: { ar: 'جمهورية مصر العربية', en: 'Egypt' }
  }
]

const countries = ref([...defaultCountries])
const loadingCountries = ref(false)
const selectedCountry = ref(defaultCountries[0])
const agreeTerms = ref(false)
const validationError = ref('')
const countryDropdownOpen = ref(false)
const countrySelectRef = ref(null)

const form = reactive({
  full_name: '',
  phone: '',
  email: '',
  country_id: 1,
  phone_country_id: 1,
  city_id: 1,
})

const normalizeDigits = (val) => {
  if (!val) return ''
  const eastern = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']
  return String(val).replace(/[٠-٩]/g, d => eastern.indexOf(d).toString())
}

const isSaudi = (country) => {
  if (!country) return false
  const code = String(country.code || '').replace(/\D/g, '')
  const nameAr = country.name?.ar || country.name || ''
  const nameEn = (country.name?.en || '').toLowerCase()
  const iso = (country.iso || '').toUpperCase()
  return (
    code === '966' ||
    iso === 'SA' ||
    nameAr.includes('سعود') ||
    nameEn.includes('saudi') ||
    country.id === 1
  )
}

const isEgypt = (country) => {
  if (!country) return false
  const code = String(country.code || '').replace(/\D/g, '')
  const nameAr = country.name?.ar || country.name || ''
  const nameEn = (country.name?.en || '').toLowerCase()
  const iso = (country.iso || '').toUpperCase()
  return (
    code === '20' ||
    iso === 'EG' ||
    nameAr.includes('مصر') ||
    nameEn.includes('egypt') ||
    country.id === 'eg'
  )
}

const phonePlaceholder = computed(() => {
  if (isEgypt(selectedCountry.value)) return '01xxxxxxxxx'
  if (isSaudi(selectedCountry.value)) return '5xxxxxxxx'
  return 'رقم الهاتف'
})

const phoneHint = computed(() => {
  if (isEgypt(selectedCountry.value)) {
    return 'رقم مصري: يبدأ بـ 01 ويتكون من 11 رقماً (مثال: 01012345678)'
  }
  if (isSaudi(selectedCountry.value)) {
    return 'رقم سعودي: يبدأ بـ 5 ويتكون من 9 أرقام (مثال: 512345678)'
  }
  return ''
})

const clearErrors = () => {
  validationError.value = ''
  if (authStore.error) authStore.error = null
}

const handlePhoneInput = () => {
  clearErrors()

  let clean = normalizeDigits(form.phone).replace(/[\s-]/g, '')
  form.phone = clean

  // Auto detect Egypt if starts with 01, 10, 11, 12, 15, +20, 0020, 20
  if (/^(\+20|0020|20|01|1[0125])[0-9]*$/.test(clean)) {
    if (!isEgypt(selectedCountry.value)) {
      const eg = countries.value.find(c => isEgypt(c))
      if (eg) {
        form.country_id = eg.id
        selectedCountry.value = eg
        form.phone_country_id = eg.id
      }
    }
  }
  // Auto detect Saudi if starts with 05, 5, +966, 00966, 966
  else if (/^(\+966|00966|966|05|5)[0-9]*$/.test(clean) && !clean.startsWith('01') && !clean.startsWith('1')) {
    if (!isSaudi(selectedCountry.value)) {
      const sa = countries.value.find(c => isSaudi(c))
      if (sa) {
        form.country_id = sa.id
        selectedCountry.value = sa
        form.phone_country_id = sa.id
      }
    }
  }
}

const fetchCountries = async () => {
  loadingCountries.value = true
  try {
    const data = await signupCollection.getCountries()
    const apiList = data?.data || data || []

    const list = []

    // 1. Saudi Arabia
    const saudiApi = apiList.find(c => isSaudi(c))
    const saudi = {
      id: saudiApi?.id || 1,
      backendId: saudiApi?.id || 1,
      iso: 'SA',
      code: saudiApi?.code || '+966',
      flag: '🇸🇦',
      name: {
        ar: saudiApi?.name?.ar || 'المملكة العربية السعودية',
        en: saudiApi?.name?.en || 'Saudi Arabia'
      }
    }
    list.push(saudi)

    // 2. Egypt
    const egyptApi = apiList.find(c => isEgypt(c))
    const egypt = {
      id: egyptApi?.id || 'eg',
      backendId: egyptApi?.id || saudi.backendId || 1,
      iso: 'EG',
      code: egyptApi?.code || '+20',
      flag: '🇪🇬',
      name: {
        ar: egyptApi?.name?.ar || 'جمهورية مصر العربية',
        en: egyptApi?.name?.en || 'Egypt'
      }
    }
    list.push(egypt)

    // 3. Any additional countries from API
    for (const item of apiList) {
      if (!isSaudi(item) && !isEgypt(item)) {
        list.push({
          ...item,
          backendId: item.id,
          flag: '🌐'
        })
      }
    }

    countries.value = list

    if (!selectedCountry.value || selectedCountry.value.id === 1) {
      selectedCountry.value = saudi
      form.country_id = saudi.id
      form.phone_country_id = saudi.id
    }
  } catch (error) {
    console.error('FETCH COUNTRIES ERROR:', error)
    countries.value = [...defaultCountries]
    if (!selectedCountry.value) {
      selectedCountry.value = defaultCountries[0]
      form.country_id = defaultCountries[0].id
      form.phone_country_id = defaultCountries[0].id
    }
  } finally {
    loadingCountries.value = false
  }
}

const toggleCountryDropdown = () => {
  countryDropdownOpen.value = !countryDropdownOpen.value
}

const closeCountryDropdown = () => {
  countryDropdownOpen.value = false
}

const selectCountry = (country) => {
  form.country_id = country.id
  selectedCountry.value = country
  form.phone_country_id = country.id
  clearErrors()
  closeCountryDropdown()
}

const handleClickOutside = (event) => {
  if (countrySelectRef.value && !countrySelectRef.value.contains(event.target)) {
    closeCountryDropdown()
  }
}

onMounted(() => {
  fetchCountries()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const validateForm = () => {
  clearErrors()

  if (!form.full_name || form.full_name.trim().length < 3) {
    validationError.value = 'يرجى إدخال الاسم الكامل (3 أحرف على الأقل)'
    return false
  }

  if (!form.country_id) {
    validationError.value = 'يرجى اختيار الدولة'
    return false
  }

  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    validationError.value = 'يرجى إدخال بريد إلكتروني صحيح'
    return false
  }

  if (!form.phone) {
    validationError.value = 'يرجى إدخال رقم الهاتف'
    return false
  }

  let cleanPhone = normalizeDigits(form.phone).replace(/[\s-]/g, '')

  // Remove international prefixes if entered
  if (cleanPhone.startsWith('+20')) cleanPhone = cleanPhone.slice(3)
  else if (cleanPhone.startsWith('0020')) cleanPhone = cleanPhone.slice(4)
  else if (cleanPhone.startsWith('+966')) cleanPhone = cleanPhone.slice(4)
  else if (cleanPhone.startsWith('00966')) cleanPhone = cleanPhone.slice(5)

  const isEgyptNumber = /^(01|1)[0125][0-9]{8}$/.test(cleanPhone)
  const isSaudiNumber = /^(05|5)[0-9]{8}$/.test(cleanPhone)

  // Smart auto switch if typed number matches other country
  if (isEgyptNumber && !isEgypt(selectedCountry.value)) {
    const eg = countries.value.find(c => isEgypt(c))
    if (eg) selectCountry(eg)
  } else if (isSaudiNumber && !isSaudi(selectedCountry.value)) {
    const sa = countries.value.find(c => isSaudi(c))
    if (sa) selectCountry(sa)
  }

  // Validate based on active country
  if (isEgypt(selectedCountry.value)) {
    if (!isEgyptNumber) {
      validationError.value = 'رقم الهاتف غير صالح لمصر. يجب أن يتكون من 11 رقماً ويبدأ بـ 01 (مثال: 01012345678)'
      return false
    }
  } else if (isSaudi(selectedCountry.value)) {
    if (!isSaudiNumber) {
      validationError.value = 'رقم الهاتف غير صالح للسعودية. يجب أن يبدأ بـ 5 ويتكون من 9 أرقام (مثال: 512345678)'
      return false
    }
  } else {
    if (!isEgyptNumber && !isSaudiNumber && !/^[0-9]{7,15}$/.test(cleanPhone)) {
      validationError.value = 'يرجى إدخال رقم هاتف صحيح'
      return false
    }
  }

  if (!agreeTerms.value) {
    validationError.value = 'يجب الموافقة على الشروط والأحكام وسياسة الخصوصية للمتابعة'
    return false
  }

  return true
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  try {
    let cleanPhone = normalizeDigits(form.phone).replace(/[\s-]/g, '')

    // Strip international code if entered
    if (cleanPhone.startsWith('+20')) cleanPhone = cleanPhone.slice(3)
    else if (cleanPhone.startsWith('0020')) cleanPhone = cleanPhone.slice(4)
    else if (cleanPhone.startsWith('+966')) cleanPhone = cleanPhone.slice(4)
    else if (cleanPhone.startsWith('00966')) cleanPhone = cleanPhone.slice(5)

    let phoneToSend = cleanPhone
    if (isSaudi(selectedCountry.value)) {
      if (phoneToSend.startsWith('05')) {
        phoneToSend = phoneToSend.substring(1) // 5XXXXXXXX
      }
    } else if (isEgypt(selectedCountry.value)) {
      if (phoneToSend.startsWith('1') && phoneToSend.length === 10) {
        phoneToSend = '0' + phoneToSend // 01XXXXXXXXX
      }
    }

    const backendCountryId = selectedCountry.value?.backendId || (typeof form.country_id === 'number' ? form.country_id : 1)

    await authStore.registerUser({
      ...form,
      country_id: backendCountryId,
      phone_country_id: backendCountryId,
      phone: phoneToSend
    })
  } catch (error) {
    // Error is set in authStore.error
  }
}
</script>

<style scoped>
.signup-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0c14b 0%, #d4a017 55%, #b8860b 100%);
  padding: 24px;
  direction: rtl;
  font-family: 'Cairo', 'Tajawal', sans-serif;
}

.signup-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(184, 134, 11, 0.35);
  position: relative;
  overflow: hidden;
}

.signup-card::before {
  content: '';
  position: absolute;
  top: -60px;
  left: -60px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(240, 193, 75, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.signup-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.signup-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: #0b1120;
  margin: 0 0 8px;
}

.signup-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  padding: 14px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.form-group input:focus {
  outline: none;
  border-color: #f0c14b;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(240, 193, 75, 0.15);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.custom-select {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  color: #1f2937;
  text-align: center;
}

.custom-select-trigger:hover {
  border-color: #d1d5db;
}

.custom-select.open .custom-select-trigger {
  border-color: #f0c14b;
  box-shadow: 0 0 0 4px rgba(240, 193, 75, 0.15);
}

.selected-text {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-text.placeholder {
  color: #9ca3af;
  font-weight: 500;
}

.select-chevron {
  color: #9ca3af;
  display: flex;
  flex-shrink: 0;
  transition: transform 0.2s ease, color 0.2s ease;
}

.custom-select.open .select-chevron {
  color: #d4a017;
  transform: rotate(180deg);
}

.custom-select-options {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  margin: 0;
  padding: 8px;
  list-style: none;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(11, 17, 32, 0.15);
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #f0c14b #f3f4f6;
  cursor: default;
}

.custom-select-options::-webkit-scrollbar {
  width: 6px;
}

.custom-select-options::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 8px;
}

.custom-select-options::-webkit-scrollbar-thumb {
  background: #f0c14b;
  border-radius: 8px;
}

.custom-select-option {
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 500;
  color: #374151;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.custom-select-option:hover {
  background: #fdf6e3;
  color: #b8860b;
}

.custom-select-option.active {
  background: linear-gradient(135deg, #f0c14b 0%, #e0a92f 100%);
  color: #0b1120;
  font-weight: 700;
}

.custom-select-option.empty {
  color: #9ca3af;
  cursor: default;
}

.custom-select-option.empty:hover {
  background: transparent;
  color: #9ca3af;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.selected-country-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.country-option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.country-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.country-flag {
  font-size: 18px;
  line-height: 1;
}

.country-name {
  font-size: 14.5px;
}

.country-code {
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
  direction: ltr;
}

.custom-select-option.active .country-code {
  color: #0b1120;
}

.phone-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.phone-code {
  padding: 14px 12px;
  background: #f3f4f6;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 700;
  color: #374151;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  font-size: 14px;
}

.phone-code.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.phone-code.clickable:hover {
  background: #fdf6e3;
  border-color: #f0c14b;
  color: #b8860b;
}

.phone-code-flag {
  font-size: 16px;
  line-height: 1;
}

.phone-input-group .phone-input {
  flex: 1;
}

.hint-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: -4px;
}

.terms-group {
  margin-top: 4px;
  padding: 4px 2px;
}

.terms-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
}

.terms-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #f0c14b;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
}

.terms-link {
  color: #d4a017;
  font-weight: 700;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #b8860b;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

.submit-btn {
  background: linear-gradient(135deg, #f0c14b 0%, #e0a92f 100%);
  color: #0b1120;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 16px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(240, 193, 75, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(11, 17, 32, 0.3);
  border-top-color: #0b1120;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.signup-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.signup-footer p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.signup-footer a {
  color: #d4a017;
  font-weight: 700;
  text-decoration: none;
}

.signup-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .signup-card {
    padding: 32px 24px;
    border-radius: 20px;
  }
}
</style>