<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import LevelService from '@/service/LevelService'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const levelId = Number(route.params.id)
const schema = yup.object({
  title: yup.string().trim().required('Benefit title is required'),
  description: yup.string().trim().required('Benefit description is required'),
})
const { handleSubmit, errors } = useForm({validationSchema: schema,})

const { value: title } = useField<string>('title')
const { value: description } = useField<string>('description')

const save = handleSubmit((values) => {
  LevelService.addBenefit({
    title: values.title,
    description: values.description,
    level: { id: levelId },
  })
    .then(() => {
      router.push({
        name: 'admin-levelBenefit',
        params: { id: levelId },
      })
    })
    .catch((err) => {
      console.error('Add benefit failed:', err.response?.data || err)
      alert('Failed to add benefit.')
    })
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Add New Benefit</h2>

    <form @submit.prevent="save" class="flex flex-col gap-4">
      <div>
        <label class="block font-bold mb-1">
          Benefit Title <span class="text-red-500">*</span>
        </label>
        <input
          v-model="title"
          type="text"
          class="input w-full"
          :class="{ 'border-red-500': errors.title }"
          placeholder="Enter benefit title"
        />
        <span class="text-red-500 text-sm mt-1 block">
          {{ errors.title }}
        </span>
      </div>

      <div>
        <label class="block font-bold mb-1">
          Description <span class="text-red-500">*</span>
        </label>
        <input
          v-model="description"
          type="text"
          class="input w-full"
          :class="{ 'border-red-500': errors.description }"
          placeholder="Enter benefit description"
        />
        <span class="text-red-500 text-sm mt-1 block">
          {{ errors.description }}
        </span>
      </div>

      <div class="flex justify-end gap-3 mt-4 border-t pt-4">
        <RouterLink
          :to="{ name: 'admin-levelBenefit', params: { id: levelId } }"
          class="bg-gray-400 text-white py-2 px-5 rounded hover:bg-gray-500 transition-colors font-semibold no-underline text-center"
        >
          Cancel
        </RouterLink>

        <button type="submit" class="btn-main px-6">Save</button>
      </div>
    </form>
  </div>
</template>
