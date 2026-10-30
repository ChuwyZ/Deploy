<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div>
    <h2 class="text-xl mb-4 font-bold text-gray-800">User Information</h2>

    <p class="mb-2"><strong>Username:</strong> {{ userStore.user?.username }}</p>
    <p class="mb-2"><strong>Province:</strong> {{ userStore.user?.province }}</p>
    <p class="mb-2"><strong>Level:</strong> {{ userStore.user?.level }}</p>
    <p>
      <strong>Status:</strong>
      <span :class="userStore.user?.isActive ? 'text-green-600' : 'text-red-600'">
        {{ userStore.user?.isActive ? 'Active' : 'Deactivated' }}
      </span>
    </p>
  </div>
</template>
