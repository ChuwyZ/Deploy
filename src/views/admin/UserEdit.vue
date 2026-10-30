<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserService from '@/service/UserService'
import UserEditForm from '@/components/EditForm.vue'
import type { UpdateUserForm } from '@/type'
import { apiErrorText } from '@/service/apiError'

const userStore = useUserStore()
const router = useRouter()
const errorMessage = ref('')

const saveUser = async (payload: { form: UpdateUserForm; isActive: boolean; level: number }) => {
  const u = userStore.user
  if (!u) return
  errorMessage.value = ''
  try {
    let res = await UserService.updateUser(u.id, payload.form)
    // level is changed by the admin through its own endpoint (users can never change it themselves)
    if (u.level !== null && res.data.level !== payload.level) {
      res = await UserService.updateUserLevel(u.id, payload.level)
    }
    // status is saved through its own endpoints (admin accounts cannot be deactivated)
    if (u.level !== null && res.data.isActive !== payload.isActive) {
      res = payload.isActive
        ? await UserService.reactivateUser(u.id)
        : await UserService.deactivateUser(u.id)
    }
    userStore.setUser(res.data) // shared with the nested routes through Pinia
    router.push({ name: 'admin-userInfo' })
  } catch (err) {
    console.error('save failed', err)
    errorMessage.value = `Could not save the changes (${apiErrorText(err)})`
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl mb-4 font-bold text-gray-800">Edit User</h2>
    <UserEditForm
      v-if="userStore.user"
      :user="userStore.user"
      :show-status="userStore.user.level !== null"
      :show-level="userStore.user.level !== null"
      @save="saveUser"
    />
    <p v-if="errorMessage" class="text-red-600 text-sm mt-2">{{ errorMessage }}</p>
  </div>
</template>
