<script setup lang="ts">
import { ref } from 'vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import ImageUpload from '@/components/ImageUpload.vue'
import type { User, UpdateUserForm } from '@/type'

const props = defineProps<{
  user: User
  showStatus?: boolean // admin only: allows activating / deactivating the account
  showLevel?: boolean // admin only: allows changing the user's level
}>()

const emit = defineEmits<{
  save: [payload: { form: UpdateUserForm; isActive: boolean; level: number }]
}>()

const validationSchema = yup.object({
  name: yup.string().required('Name is required').max(100),
  surname: yup.string().required('Surname is required').max(100),
  email: yup.string().required('Email is required').email('Input must be an email.'),
  province: yup.string().required('Province is required'),
})
const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    name: props.user.name,
    surname: props.user.surname,
    email: props.user.email ?? '',
    province: props.user.province,
  },
})
const { value: name } = useField<string>('name')
const { value: surname } = useField<string>('surname')
const { value: email } = useField<string>('email')
const { value: province } = useField<string>('province')

const images = ref<string[]>([]) // new profile picture (optional)
const isActive = ref(props.user.isActive)
const level = ref<number>(props.user.level ?? 1)

const save = handleSubmit((values) => {
  emit('save', {
    form: {
      firstname: values.name,
      lastname: values.surname,
      email: values.email,
      province: values.province,
      profileImage: images.value[0], // undefined = keep the current picture
    },
    isActive: isActive.value,
    level: level.value,
  })
})
</script>

<template>
  <form @submit.prevent="save" class="flex flex-col gap-3">
    <div>
      <label class="block text-sm mb-1">Name</label>
      <input v-model="name" type="text" class="input w-full" />
      <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
    </div>
    <div>
      <label class="block text-sm mb-1">Surname</label>
      <input v-model="surname" type="text" class="input w-full" />
      <p v-if="errors.surname" class="text-red-600 text-sm mt-1">{{ errors.surname }}</p>
    </div>
    <div>
      <label class="block text-sm mb-1">Email</label>
      <input v-model="email" type="text" class="input w-full" />
      <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
    </div>
    <div>
      <label class="block text-sm mb-1">Province</label>
      <input v-model="province" type="text" class="input w-full" />
      <p v-if="errors.province" class="text-red-600 text-sm mt-1">{{ errors.province }}</p>
    </div>
    <div>
      <label class="block text-sm mb-1">Change profile image (optional)</label>
      <ImageUpload v-model="images" :max="1" />
    </div>
    <div v-if="showLevel">
      <label class="block text-sm mb-1">Level</label>
      <select v-model.number="level" class="input w-full bg-white">
        <option v-for="n in 4" :key="n" :value="n">Level {{ n }}</option>
      </select>
    </div>
    <div v-if="showStatus" class="flex items-center gap-2 mt-2">
      <input v-model="isActive" type="checkbox" id="isActive" class="w-4 h-4" />
      <label for="isActive" class="text-sm">Active Account</label>
    </div>

    <button
      type="submit"
      class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
    >
      Save
    </button>
  </form>
</template>
