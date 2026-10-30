<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { authenUser } from '@/stores/authen'

const authen = authenUser()
const router = useRouter()

function logout() {
  authen.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div :class="authen.role === 'admin' ? 'bg-blue-100 min-h-screen' : ''">
    <nav v-if="authen.role === 'admin'" class="bg-blue-700 text-white shadow-md sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 h-16 grid grid-cols-3 items-center">
        <!-- โลโก้ / ชื่อระบบ -->
        <p class="text-xl font-bold tracking-tight text-white">Admin Panel</p>

        <!-- เมนูนำทางแบบปุ่ม (Pill) ที่ตัวอักษรใหญ่และกว้างขึ้น -->
        <div class="flex items-center gap-4 text-lg font-bold justify-self-center">
          <RouterLink
            :to="{ name: 'admin-userList' }"
            active-class="bg-blue-800 text-white shadow-inner"
            class="px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-blue-100 hover:text-white"
          >
            User List
          </RouterLink>
          <RouterLink
            :to="{ name: 'admin-levelList' }"
            active-class="bg-blue-800 text-white shadow-inner"
            class="px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-blue-100 hover:text-white"
          >
            Level List
          </RouterLink>
        </div>

        <div class="justify-self-end">
          <button
            @click="logout"
            class="px-4 py-2 rounded-md font-bold text-blue-100 hover:bg-blue-600 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>
