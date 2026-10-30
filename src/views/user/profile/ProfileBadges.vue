<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useUserStore } from '@/stores/user'
import UserService from '@/service/UserService'
import type { Badge } from '@/type'

const userStore = useUserStore()
const earnedBadges = ref<Badge[]>([])

watchEffect(() => {
  if (userStore.user) {
    UserService.getBadges(userStore.user.id)
      .then((res) => {
        earnedBadges.value = res.data
      })
      .catch((err) => console.error(err))
  }
})

// อ้างอิง 4 เลเวลพื้นฐานตามระบบ
const allLevels = [
  { level: 1, name: 'Beginner', image: 'https://placehold.co/50/gray/white?text=L1' },
  { level: 2, name: 'Intermediate', image: 'https://placehold.co/50/blue/white?text=L2' },
  { level: 3, name: 'Advanced', image: 'https://placehold.co/50/purple/white?text=L3' },
  { level: 4, name: 'Expert', image: 'https://placehold.co/50/gold/black?text=L4' },
]

const isUnlocked = (level: number) => {
  return (userStore.user?.level ?? 1) >= level
}
</script>

<template>
  <div>
    <h2 class="text-xl mb-6 font-bold text-gray-800">Your Badges</h2>
    <div class="grid grid-cols-2 gap-4 text-center">
      <div
        v-for="badge in allLevels"
        :key="badge.level"
        class="flex flex-col items-center justify-center p-3 rounded-lg border bg-white transition-all"
        :class="
          isUnlocked(badge.level) ? 'border-blue-400 shadow-sm' : 'border-gray-200 bg-gray-50'
        "
      >
        <img
          :src="badge.image"
          alt="Badge"
          class="w-14 h-14 mb-2 rounded-full object-cover transition-all duration-300"
          :class="
            isUnlocked(badge.level)
              ? 'ring-2 ring-blue-200'
              : 'grayscale opacity-40 ring-1 ring-gray-200'
          "
        />
        <p
          class="text-sm font-bold"
          :class="isUnlocked(badge.level) ? 'text-gray-800' : 'text-gray-400'"
        >
          Level {{ badge.level }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          {{ isUnlocked(badge.level) ? badge.name : 'Locked' }}
        </p>
      </div>
    </div>
  </div>
</template>
