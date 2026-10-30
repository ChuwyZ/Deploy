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

const saveUser = async (payload: { form: UpdateUserForm; isActive: boolean }) => {
  errorMessage.value = ''
  try {
    const res = await UserService.updateMyProfile(payload.form)
    userStore.setUser(res.data)
    router.push({ name: 'profile-info' }) // back to the profile after saving
  } catch (err) {
    console.error('save failed', err)
    errorMessage.value = `Could not save the changes (${apiErrorText(err)})`
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl mb-4 font-bold text-gray-800">Edit Profile</h2>
    <UserEditForm v-if="userStore.user" :user="userStore.user" @save="saveUser" />
    <p v-if="errorMessage" class="text-red-600 text-sm mt-2">{{ errorMessage }}</p>
  </div>
</template>
