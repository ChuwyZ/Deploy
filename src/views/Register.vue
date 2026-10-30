<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import ImageUpload from '@/components/ImageUpload.vue'
import { authenUser } from '@/stores/authen'

const router = useRouter()
const authen = authenUser()
const errorMessage = ref('')

const validationSchema = yup.object({
  name: yup.string().required('Name is required').max(100),
  surname: yup.string().required('Surname is required').max(100),
  province: yup.string().required('Province is required'),
  email: yup.string().required('Email is required').email('Input must be an email.'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'The password must be at least 6 characters.'),
  images: yup.array().of(yup.string().required()).min(1, 'Profile image is required'),
})
const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    surname: '',
    province: '',
    email: '',
    password: '',
    images: [] as string[],
  },
})
const { value: name } = useField<string>('name')
const { value: surname } = useField<string>('surname')
const { value: province } = useField<string>('province')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: images } = useField<string[]>('images')

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = ''
  try {
    await authen.register({
      firstname: values.name,
      lastname: values.surname,
      province: values.province,
      email: values.email,
      password: values.password,
      profileImage: (values.images as string[])[0] ?? '', // storage key of the uploaded picture
    })
    router.push({ path: '/dashboard' }) // new users start at Level 1 and are already logged in
  } catch (err) {
    console.error('register failed', err)
    if (!axios.isAxiosError(err) || !err.response) {
      errorMessage.value = 'Cannot reach the server. Is the backend running on port 8080?'
    } else if (err.response.status === 409) {
      errorMessage.value = 'This email is already registered'
    } else if (err.response.status === 400) {
      errorMessage.value = 'Please check your input and the profile image'
    } else {
      errorMessage.value = `Server error (${err.response.status}). Check the backend console.`
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-blue-100 py-8">
    <h1 class="text-3xl font-bold text-blue-800 mb-6">The CA?T Passport</h1>
    <div class="w-[400px] p-[30px] bg-white rounded-[10px]">
      <h1 class="text-center mb-[25px] text-xl font-bold">Register</h1>

      <form @submit.prevent="onSubmit">
        <div class="mb-[25px]">
          <label>Name</label>
          <input v-model="name" class="input w-full" placeholder="Enter your name" />
          <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div class="mb-[25px]">
          <label>Surname</label>
          <input v-model="surname" class="input w-full" placeholder="Enter your surname" />
          <p v-if="errors.surname" class="text-red-600 text-sm mt-1">{{ errors.surname }}</p>
        </div>

        <div class="mb-[25px]">
          <label>Province</label>
          <input v-model="province" class="input w-full" placeholder="Enter your province" />
          <p v-if="errors.province" class="text-red-600 text-sm mt-1">{{ errors.province }}</p>
        </div>

        <div class="mb-[25px]">
          <label>Email (used as your username)</label>
          <input v-model="email" class="input w-full" placeholder="Enter your email" />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
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

        <div class="mb-[25px]">
          <label>Profile image</label>
          <ImageUpload v-model="images" :max="1" />
          <p v-if="errors.images" class="text-red-600 text-sm mt-1">{{ errors.images }}</p>
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm mb-4 text-center">{{ errorMessage }}</p>

        <button class="btn-main w-full mb-[25px]" type="submit">Register</button>

        <p>
          Already have an account?
          <RouterLink :to="{ name: 'login' }" class="text-blue-500 underline decoration-blue-500"
            >Login</RouterLink
          >
        </p>
      </form>
    </div>
  </div>
</template>
