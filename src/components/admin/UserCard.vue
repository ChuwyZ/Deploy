<script setup lang="ts">
import type { User } from '@/type'

defineProps<{
  user: User
}>()
</script>

<template>
  <RouterLink
    class="no-underline text-black block"
    :to="{ name: 'admin-userDetail', params: { id: user.id } }"
  >
    <div
      class="border border-gray-400 p-4 rounded hover:shadow-lg flex items-center gap-4 bg-white cursor-pointer hover:scale-[1.01] transition-all"
    >
      <img :src="user.profileImage[0]" class="w-12 h-12 rounded-full" />
      <div class="flex-1">
        <p class="font-bold text-lg">{{ user.name }} {{ user.surname }}</p>
        <p class="text-sm text-gray-500">
          {{ user.province }}<span v-if="user.level"> · Level {{ user.level }}</span>
        </p>
      </div>
      <span
        class="text-xs font-semibold px-2 py-1 rounded-full"
        :class="user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
      >
        {{ user.isActive ? 'Active' : 'Deactivated' }}
      </span>
    </div>
  </RouterLink>
</template>
