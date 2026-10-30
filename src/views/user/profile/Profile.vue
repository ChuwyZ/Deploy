<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import html2canvas from 'html2canvas'

const userStore = useUserStore()
const certificateRef = ref<HTMLElement | null>(null)
const isGenerating = ref(false)

// แปลง DOM เกียรติบัตรเป็น PNG ผ่าน html2canvas แล้วดาวน์โหลดไฟล์ลงเครื่อง
const downloadCertificate = async () => {
  // ป้องกันการทำงานหากไม่พบ element เกียรติบัตรหรือข้อมูลผู้ใช้
  if (!certificateRef.value || !userStore.user) return
  isGenerating.value = true

  try {
    // เรนเดอร์ DOM เป็น canvas
    const canvas = await html2canvas(certificateRef.value, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    })

    // แปลง canvas เป็น data URL และดาวน์โหลดรูปภาพ
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = 'CatPass_Certificate.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    alert(err)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div v-if="userStore.user" class="flex flex-col items-center w-full relative">
    <!-- ข้อมูลโปรไฟล์หลัก -->
    <img
      :src="userStore.user.profileImage[0]"
      alt="Profile Image"
      class="w-24 h-24 rounded-full border border-gray-300 shadow-sm"
    />
    <h1 class="text-2xl font-bold text-gray-800 mt-4">
      {{ userStore.user.name }} {{ userStore.user.surname }}
    </h1>
    <p class="text-gray-600 mt-1">Level {{ userStore.user.level ?? 1 }}</p>

    <!-- ปุ่ม Download Certificate -->
    <button
      @click="downloadCertificate"
      :disabled="isGenerating"
      class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md shadow-sm text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
    >
      <span>Download Certificate</span>
    </button>

    <!-- Navbar -->
    <div class="flex gap-6 mt-6 font-semibold text-gray-500">
      <RouterLink :to="{ name: 'profile-info' }" exact-active-class="text-blue-600 underline">
        Info
      </RouterLink>
      <RouterLink :to="{ name: 'profile-history' }" exact-active-class="text-blue-600 underline">
        History
      </RouterLink>
      <RouterLink :to="{ name: 'profile-badges' }" exact-active-class="text-blue-600 underline">
        Badges
      </RouterLink>
      <RouterLink :to="{ name: 'profile-services' }" exact-active-class="text-blue-600 underline">
        Services
      </RouterLink>
      <RouterLink :to="{ name: 'profile-edit' }" exact-active-class="text-blue-600 underline">
        Edit
      </RouterLink>
    </div>

    <!-- พื้นที่เนื้อหาย่อย -->
    <div class="w-full max-w-2xl bg-gray-50 border border-gray-200 p-6 rounded-lg mt-6">
      <RouterView />
    </div>

    <!-- Certificate -->
    <!-- ซ่อน Certificate -->
    <div class="fixed left-[-9999px] top-0 pointer-events-none">
      <div
        ref="certificateRef"
        class="w-[800px] h-[560px] bg-[#ffffff] border-[16px] border-[#2563eb] flex flex-col justify-center items-center font-sans box-border"
      >
        <!-- หัวข้อ -->
        <h1 class="text-[#1e3a8a] text-6xl font-bold mb-10 uppercase tracking-[0.2em]">
          Certificate
        </h1>

        <!-- ชื่อ นามสกุล-->
        <h2 class="text-[#111827] text-5xl font-bold mb-5">
          {{ userStore.user.name }} {{ userStore.user.surname }}
        </h2>

        <!-- level ปัจจุบัน -->
        <p class="text-[#d97706] text-4xl font-bold m-0">Level {{ userStore.user.level ?? 1 }}</p>
      </div>
    </div>
  </div>
</template>
