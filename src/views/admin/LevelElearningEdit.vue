<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LevelService from '@/service/LevelService'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const levelId = Number(route.params.id)

const editElearning = ref<any[]>([])
const loading = ref(true)

const schema = yup.object({
  elearning: yup.array().of(
    yup.object({
      title: yup.string().trim().required('Title is required'),
      videoUrl: yup.string().trim().required('Video URL is required').url('Please enter a valid URL'),
      description: yup.string().trim().required('Description is required'),
    }),
  ).min(1, 'At least one e-learning content is required').required(),
})

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
})

onMounted(() => {
  LevelService.getElearning(levelId)
    .then((res) => {
      editElearning.value = res.data.map((item: any) => ({
        ...item,
        title: item.title ?? '',
        videoUrl: item.videoUrl ?? '',
        description: item.description ?? '',
      }))

      setValues({
        elearning: editElearning.value.map((item) => ({
          title: item.title,
          videoUrl: item.videoUrl,
          description: item.description,
        })),
      })
    })
    .catch((err) => {
      console.error('Load e-learning failed:', err)
      alert('Failed to load e-learning content.')
    })
    .finally(() => {
      loading.value = false
    })
})

const save = handleSubmit((values: any) => {
  Promise.all(
    editElearning.value.map((item, index) =>
      LevelService.updateElearning(item.id, {
        title: values.elearning[index].title,
        videoUrl: values.elearning[index].videoUrl,
        description: values.elearning[index].description,
        level: { id: levelId },
      }),
    ),
  )
    .then(() => {
      router.push({
        name: 'admin-levelElearning',
        params: { id: levelId },
      })
    })
    .catch((err) => {
      console.error('Save e-learning failed:', err.response?.data || err)
      alert('Failed to save e-learning content.')
    })
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Edit E-learning Content</h2>

    <p v-if="loading" class="text-gray-500">Loading e-learning content...</p>

    <div v-else-if="editElearning.length === 0" class="text-gray-500">
      No e-learning content available to edit.
    </div>

    <form
      v-else
      @submit.prevent="save"
      class="flex flex-col gap-4"
    >
      <div
        v-for="(item, index) in editElearning"
        :key="item.id"
        class="border border-gray-300 rounded p-4 flex flex-col gap-4"
      >
        <h3 class="font-bold text-gray-800">
          E-learning {{ index + 1 }}
        </h3>

        <div>
          <label class="block font-bold mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="item.title"
            @input="setValues({
              elearning: editElearning.map((content) => ({
                title: content.title,
                videoUrl: content.videoUrl,
                description: content.description,
              })),
            })"
            type="text"
            required
            class="input w-full"
            :class="{ 'border-red-500': errors[`elearning[${index}].title`] }"
            placeholder="Enter title"
          />
          <span class="text-red-500 text-sm mt-1 block">
            {{ errors[`elearning[${index}].title`] }}
          </span>
        </div>

        <div>
          <label class="block font-bold mb-1">
            Video URL <span class="text-red-500">*</span>
          </label>
          <input
            v-model="item.videoUrl"
            @input="setValues({
              elearning: editElearning.map((content) => ({
                title: content.title,
                videoUrl: content.videoUrl,
                description: content.description,
              })),
            })"
            type="url"
            required
            class="input w-full"
            :class="{ 'border-red-500': errors[`elearning[${index}].videoUrl`] }"
            placeholder="https://example.com/video"
          />
          <span class="text-red-500 text-sm mt-1 block">
            {{ errors[`elearning[${index}].videoUrl`] }}
          </span>
        </div>

        <div>
          <label class="block font-bold mb-1">
            Description <span class="text-red-500">*</span>
          </label>
          <input
            v-model="item.description"
            @input="setValues({
              elearning: editElearning.map((content) => ({
                title: content.title,
                videoUrl: content.videoUrl,
                description: content.description,
              })),
            })"
            type="text"
            required
            class="input w-full"
            :class="{ 'border-red-500': errors[`elearning[${index}].description`] }"
            placeholder="Enter description"
          />
          <span class="text-red-500 text-sm mt-1 block">
            {{ errors[`elearning[${index}].description`] }}
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-4 border-t pt-4">
        <button
          type="button"
          @click="router.push({
            name: 'admin-levelElearning',
            params: { id: levelId },
          })"
          class="bg-gray-400 text-white py-2 px-5 rounded hover:bg-gray-500 transition-colors font-semibold"
        >
          Cancel
        </button>

        <button type="submit" class="btn-main px-6">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</template>
