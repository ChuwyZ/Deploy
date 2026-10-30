<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import LevelService from '@/service/LevelService'

const route = useRoute()
const router = useRouter()
const levelId = Number(route.params.id)

const schema = yup.object({
  title: yup.string().trim().required('Title is required'),
  videoUrl: yup.string().url('Enter a valid video URL').required('Video URL is required'),
  description: yup.string().trim().required('Description is required'),
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: title } = useField<string>('title')
const { value: videoUrl } = useField<string>('videoUrl')
const { value: description } = useField<string>('description')

const save = handleSubmit((values) => {
  LevelService.addElearning({
    title: values.title,
    videoUrl: values.videoUrl,
    description: values.description,
    level: { id: levelId },
  })
    .then(() => {
      router.push({
        name: 'admin-levelElearning',
        params: { id: levelId },
      })
    })
    .catch((error) => {
      console.error(error)
      alert('Failed to add eLearning content.')
    })
})
</script>

<template>
  <div class="w-full">
    <h2 class="text-xl mb-4 font-bold text-gray-800">
      Add New eLearning Content
    </h2>

    <form @submit.prevent="save" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm mb-1">Title</label>
        <input
          v-model="title"
          type="text"
          class="input w-full"
          placeholder="Enter title"
        />
        <p v-if="errors.title" class="text-red-500 text-sm mt-1">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label class="block text-sm mb-1">Video URL</label>
        <input
          v-model="videoUrl"
          type="url"
          class="input w-full"
          placeholder="Enter video URL"
        />
        <p v-if="errors.videoUrl" class="text-red-500 text-sm mt-1">
          {{ errors.videoUrl }}
        </p>
      </div>

      <div>
        <label class="block text-sm mb-1">Description</label>
        <input
          v-model="description"
          type="text"
          class="input w-full"
          placeholder="Enter description"
        />
        <p v-if="errors.description" class="text-red-500 text-sm mt-1">
          {{ errors.description }}
        </p>
      </div>

      <div class="flex justify-end gap-3 mt-2">
        <button
          type="button"
          @click="router.push({ name: 'admin-levelElearning', params: { id: levelId } })"
          class="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button type="submit" class="btn-main">Save</button>
      </div>
    </form>
  </div>
</template>
