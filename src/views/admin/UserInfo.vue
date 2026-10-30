<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import UserService from '@/service/UserService'

const userStore = useUserStore()
const errorMessage = ref('')

// admin accounts have level === null and cannot be deactivated
const toggleStatus = async () => {
  const u = userStore.user
  if (!u) return
  errorMessage.value = ''
  try {
    const res = u.isActive
      ? await UserService.deactivateUser(u.id)
      : await UserService.reactivateUser(u.id)
    userStore.setUser(res.data)
  } catch {
    errorMessage.value = 'Could not change the status of this user'
  }
}
</script>

<template>
  <div>
    <h1 class="text-xl mb-4 font-bold text-gray-800">User Information</h1>

    <p class="mb-2"><strong>Username:</strong> {{ userStore.user?.username }}</p>
    <p class="mb-2"><strong>Email:</strong> {{ userStore.user?.email }}</p>
    <p class="mb-2"><strong>Province:</strong> {{ userStore.user?.province }}</p>
    <p class="mb-2"><strong>Level:</strong> {{ userStore.user?.level || 'Admin' }}</p>
    <p>
      <strong>Status: </strong>
      <span :class="userStore.user?.isActive ? 'text-green-600' : 'text-red-600'">
        {{ userStore.user?.isActive ? 'Active' : 'Deactivated' }}
      </span>
    </p>

    <button
      v-if="userStore.user && userStore.user.level !== null"
      @click="toggleStatus"
      class="mt-4 py-2 px-4 rounded text-white transition-colors"
      :class="userStore.user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'"
    >
      {{ userStore.user.isActive ? 'Deactivate user' : 'Reactivate user' }}
    </button>
    <p v-if="errorMessage" class="text-red-600 text-sm mt-2">{{ errorMessage }}</p>
  </div>
</template>
