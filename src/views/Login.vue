<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { authenUser } from '@/stores/authen'

const router = useRouter()
const authen = authenUser()
const errorMessage = ref(sessionStorage.getItem('authError') ?? '')
sessionStorage.removeItem('authError')

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})
const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: { username: '', password: '' },
})
const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')

const useLogin = handleSubmit(async (values) => {
  errorMessage.value = ''
  try {
    await authen.login(values.username, values.password)
    // the role from the backend decides the landing page
    router.push({ path: authen.role === 'admin' ? '/admin' : '/dashboard' })
  } catch (err) {
    console.error('login failed', err)
    if (!axios.isAxiosError(err) || !err.response) {
      errorMessage.value = 'Cannot reach the server. Is the backend running on port 8080?'
    } else if (err.response.status === 403) {
      errorMessage.value = 'This account has been deactivated'
    } else if (err.response.status === 401) {
      errorMessage.value = 'Invalid username or password'
    } else {
      errorMessage.value = `Server error (${err.response.status}). Check the backend console.`
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-blue-100">
    <h1 class="text-3xl font-bold text-blue-800 mb-6">The CA?T Passport</h1>
    <div class="w-[400px] p-[30px] bg-white rounded-[10px]">
      <h1 class="text-center mb-[25px] text-xl font-bold">Login</h1>

      <form @submit.prevent="useLogin">
        <div class="mb-[25px]">
          <label>Username</label>
          <input
            v-model="username"
            class="input w-full"
            type="text"
            placeholder="Enter your username"
          />
          <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
        </div>

        <div class="mb-[25px]">
          <label>Password</label>
          <input
            v-model="password"
            class="input w-full"
            type="password"
            placeholder="Enter your password"
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm mb-4 text-center">{{ errorMessage }}</p>

        <button class="btn-main w-full mb-[25px]" type="submit">Login</button>

        <p class="register">
          Don't have an account?
          <RouterLink :to="{ name: 'register' }" class="text-blue-500 underline decoration-blue-500"
            >Register</RouterLink
          >
        </p>
      </form>
    </div>
  </div>
</template>
