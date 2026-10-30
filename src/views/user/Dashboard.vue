<script setup lang="ts">
import { watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { authenUser } from '@/stores/authen'
import { useUserStore } from '@/stores/user'
import { useLevelStore } from '@/stores/level'
import UserService from '@/service/UserService'
import LevelService from '@/service/LevelService'

const authen = authenUser()
const userStore = useUserStore()
const levelStore = useLevelStore()
const router = useRouter()

// the logged-in user comes from the backend (JWT), not from a username lookup
watchEffect(() => {
  if (authen.token) {
    UserService.getMyProfile()
      .then((response) => userStore.setUser(response.data))
      .catch((error) => console.error(error))
  }
})

function logout() {
  authen.logout()
  router.push({ name: 'login' })
}

// Realtime Level Upgrade
watch(
  () => userStore.user?.level,
  (newLevel) => {
    if (newLevel) {
      // runs again whenever the level changes (e.g. after passing the exam) -> no re-login needed
      LevelService.getMyBenefits().then((res) => (levelStore.benefits = res.data))
      LevelService.getMyServices().then((res) => (levelStore.services = res.data))
      LevelService.getMyElearning().then((res) => (levelStore.elearning = res.data))
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-screen bg-blue-50/50 flex flex-col">
    <header class="bg-blue-700 text-white shadow-md sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <span class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            CA?T Passport
          </span>

          <nav class="flex items-center gap-2 text-sm font-medium">
            <RouterLink
              :to="{ name: 'dashboard-info' }"
              active-class="bg-blue-800 text-white shadow-inner"
              class="px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors text-blue-100 hover:text-white"
            >
              Home
            </RouterLink>

            <RouterLink
              :to="{ name: 'e-learning' }"
              active-class="bg-blue-800 text-white shadow-inner"
              class="px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors text-blue-100 hover:text-white"
            >
              ELearning
            </RouterLink>

            <RouterLink
              :to="{ name: 'exam' }"
              active-class="bg-blue-800 text-white shadow-inner"
              class="px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors text-blue-100 hover:text-white"
            >
              Exam
            </RouterLink>
          </nav>
        </div>

        <!-- Avatar + ชื่อ -->
        <div class="flex items-center gap-3">
        <RouterLink
          :to="{ name: 'user-profile' }"
          title="View profile"
          active-class="!bg-blue-900 ring-1 ring-white/60"
          class="flex items-center gap-3 bg-blue-800/80 px-3 py-1.5 rounded-full border border-blue-500/40 shadow-sm hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <img
            :src="userStore.user?.profileImage[0]"
            alt="Avatar"
            class="w-8 h-8 rounded-full object-cover border border-white/60 bg-blue-900"
          />
          <div class="text-left leading-tight hidden sm:block">
            <p class="font-semibold text-white text-xs truncate max-w-[120px]">
              {{ userStore.user?.name }} {{ userStore.user?.surname }}
            </p>
            <span class="inline-block text-[10px] text-blue-200 font-bold uppercase tracking-wider">
              Level {{ userStore.user?.level ?? 1 }}
            </span>
          </div>
          <span
            class="sm:hidden bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold"
          >
            {{ userStore.user?.level ?? 1 }}
          </span>
        </RouterLink>
        <button
          @click="logout"
          class="text-sm font-medium px-3 py-1.5 rounded-md bg-blue-800/80 hover:bg-blue-600 transition-colors"
        >
          Logout
        </button>
        </div>
      </div>
    </header>

    <!-- พื้นที่แสดง RouterView -->
    <main class="flex-1 flex justify-center items-start py-8 px-4">
      <div class="w-full max-w-2xl bg-white border border-blue-100 p-6 rounded-xl shadow-sm">
        <RouterView />
      </div>
    </main>
  </div>
</template>
