<template>
  <div class="min-h-screen bg-[#F9F6F0] text-gray-800 pt-28 pb-16 px-6 md:px-12" :dir="locale === 'ar' ? 'rtl' : 'ltr'" :class="locale === 'ar' ? 'font-ibm' : 'font-sans'">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-[#D4A017] font-bold text-sm tracking-widest uppercase mb-2 block">برنامج التسويق بالعمولة</span>
        <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900">انضم كمسوق في جولد استور</h1>
        <p class="text-gray-500 mt-3 text-lg">شاركي أحدث تشكيلات المجوهرات مع جمهورك واحصلي على عمولات مجزية لكل مبيعة</p>
        <div class="w-20 h-1 bg-[#F3C650] mx-auto mt-4 rounded-full"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white p-8 rounded-3xl shadow-md border border-stone-200 text-center">
          <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D4A017] text-2xl font-bold">1</div>
          <h3 class="font-bold text-xl text-gray-900 mb-2">سجلي حسابك</h3>
          <p class="text-gray-500 text-sm">قدمي طلب الانضمام إلى برنامج التسويق بالعمولة في دقائق معدودة.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-md border border-stone-200 text-center">
          <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D4A017] text-2xl font-bold">2</div>
          <h3 class="font-bold text-xl text-gray-900 mb-2">شاركي رابطك</h3>
          <p class="text-gray-500 text-sm">احصلي على رابط تتبع خاص وكوبونات خصم مميزة لجمهورك.</p>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-md border border-stone-200 text-center">
          <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D4A017] text-2xl font-bold">3</div>
          <h3 class="font-bold text-xl text-gray-900 mb-2">احصلي على أرباحك</h3>
          <p class="text-gray-500 text-sm">اكسب عمولة تصل إلى 15% على كل طلب يتم عبر رابطك أو كوبونك.</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 shadow-md border border-stone-200 max-w-2xl mx-auto">
        <h3 class="text-2xl font-bold text-center mb-6 text-gray-900">نموذج التسجيل</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">الاسم الكامل</label>
            <input type="text" required class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#F3C650]" placeholder="ادخلي اسمك الثلاثي" />
          </div>
          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">البريد الإلكتروني</label>
            <input type="email" required class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#F3C650]" placeholder="name@example.com" />
          </div>
          <div>
            <label class="block text-sm font-bold mb-2 text-gray-700">حسابات التواصل الاجتماعي / المنصة</label>
            <input type="text" required class="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-[#F3C650]" placeholder="رابط حسابك على إنستغرام / تيك توك" />
          </div>
          <button type="submit" class="w-full py-4 bg-[#F3C650] hover:bg-amber-400 text-gray-950 font-bold rounded-xl transition shadow-lg text-lg">
            إرسال طلب الانضمام
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'التسويق بالعمولة - جولد استور',
});

function handleSubmit() {
  alert("تم استلام طلبك بنجاح! سنقوم بالتواصل معك قريباً.");
}
</script>
