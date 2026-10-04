<template>
  <div class="tabs-card" dir="ltr">

    <!-- Tabs header -->
    <div class="tabs-header">
      <button
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === 'specs' }"
        @click="activeTab = 'specs'"
      >
        المواصفات
      </button>
      <button
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === 'description' }"
        @click="activeTab = 'description'"
      >
        الوصف
      </button>
    </div>

    <!-- Tab content -->
    <div class="tabs-body">

      <ul v-if="activeTab === 'description'" class="bullet-list">
        <li v-for="(point, i) in description" :key="i">{{ point }}</li>
      </ul>

      <div v-else class="specs-list">
        <p v-for="(spec, i) in specifications" :key="i">{{ spec.label }} : {{ spec.value }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Pass real data in via props if this is reused across products —
// left as local refs here to match "exactly this" as a drop-in first.
const activeTab = ref('description');

const description = ref([
  'يتميز الخاتم بتفاصيل دقيقة ولمسات عصرية تعكس الذوق الرفيع، مع جودة تصنيع عالية تمنح القطعة متانة ولمعانًا يدوم طويلًا. تصميمه الأنيق يجعله خيارًا مثاليًا للباحثات عن قطعة مجوهرات تضيف لمسة من الأناقة والفخامة إلى إطلالتهن.',
  'خامة عالية الجودة من الفضة عيار 926',
  'تصميم ملكي عصري يناسب جميع الأذواق',
  'مريح للاستخدام اليومي والمناسبات',
  'تشطيب فاخر بلمعان راقٍ',
  'خيار مثالي للإهداء والتألق في المناسبات الخاصة',
]);

const specifications = ref([
  { label: 'النوع', value: 'فضه' },
  { label: 'العيار', value: '925' },
  { label: 'اللون', value: 'أبيض' },
  { label: 'الجنس', value: 'رجالي' },
  { label: 'المقاس', value: '11' },
  { label: 'الوزن', value: '3 جرام' },
]);
</script>

<style scoped>
.tabs-card {
  background: #f8f3ee;
  border-radius: 32px;
  padding: 28px 34px;
  border: 1px solid #ece3d7;
  margin: 90px 90px;
}

/* Tabs */

.tabs-header {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd3c8;
}

.tab-btn {
  background: #fff;
  color: #444;
  border: 1px solid #ddd3c8;
  border-radius: 999px;
  padding: 12px 34px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: .3s;
}

.tab-btn:hover {
  background: #f3e8dc;
}

.tab-btn--active {
  background: #e8d8cb;
  color: #222;
  border-color: #e8d8cb;
}

/* Body */

.tabs-body {
  display: flex;
  justify-content: center;
}

/* Description */

.bullet-list {
  width: 80%;
  list-style: none;
  margin: 0;
  padding: 0;
}

.bullet-list li {
  position: relative;
  padding-right: 18px;
  margin-bottom: 14px;
  line-height: 2;
  color: #222;
  text-align: right;
  font-size: 17px;
}

.bullet-list li::before {
  content: "";
  width: 6px;
  height: 6px;
  background: #000;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 16px;
}

/* Specs */

.specs-list {
  width: 75%;
}

.specs-list p {
  margin-bottom: 14px;
  text-align: right;
  line-height: 2;
  color: #222;
  font-size: 17px;
}

/* Mobile */

@media (max-width:768px){

  .tabs-card{
    padding:20px;
    border-radius:24px;
  }

  .tabs-header{
    justify-content:center;
  }

  .bullet-list,
  .specs-list{
    width:100%;
  }

  .bullet-list li,
  .specs-list p{
    font-size:15px;
    line-height:1.9;
  }

  .tab-btn{
    padding:10px 22px;
    font-size:14px;
  }
  .content-wrapper{
    width:75%;
    margin:0 auto;
  }

}
</style>