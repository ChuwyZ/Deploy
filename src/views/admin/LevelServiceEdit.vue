<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LevelService from '@/service/LevelService'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const levelId = Number(route.params.id)

const editServices = ref<any[]>([])
const loading = ref(true)

const schema = yup.object({
  services: yup.array().of(
    yup.object({
      batch: yup.string().trim().required('Service batch is required'),
      description: yup.string().trim().required('Service description is required'),
    }),
  ).min(1, 'At least one service is required').required(),
})

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
})

onMounted(() => {
  LevelService.getServices(levelId)
    .then((res) => {
      editServices.value = res.data.map((service: any) => ({
        ...service,
        batch: service.batch ?? '',
        description: service.description ?? '',
      }))

      setValues({
        services: editServices.value.map((service) => ({
          batch: service.batch,
          description: service.description,
        })),
      })
    })
    .catch((err) => {
      console.error('Load services failed:', err)
      alert('Failed to load services.')
    })
    .finally(() => {
      loading.value = false
    })
})

const save = handleSubmit((values: any) => {
  Promise.all(
    editServices.value.map((service, index) =>
      LevelService.updateService(service.id, {
        serviceName: service.serviceName,
        batch: values.services[index].batch,
        description: values.services[index].description,
        level: { id: levelId },
      }),
    ),
  )
    .then(() => {
      router.push({
        name: 'admin-levelService',
        params: { id: levelId },
      })
    })
    .catch((err) => {
      console.error('Save services failed:', err.response?.data || err)
      alert('Failed to save services.')
    })
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Edit Services</h2>

    <p v-if="loading" class="text-gray-500">Loading services...</p>

    <div v-else-if="editServices.length === 0" class="text-gray-500">
      No services available to edit.
    </div>

    <form
      v-else
      @submit.prevent="save"
      class="flex flex-col gap-4"
    >
      <div
        v-for="(service, index) in editServices"
        :key="service.id"
        class="border border-gray-300 rounded p-4 flex flex-col gap-4"
      >
        <h3 class="font-bold text-gray-800">
          Service {{ index + 1 }}
        </h3>

        <div>
          <label class="block font-bold mb-1">
            Batch <span class="text-red-500">*</span>
          </label>
          <input
            v-model="service.batch"
            @input="setValues({
              services: editServices.map((item) => ({
                batch: item.batch,
                description: item.description,
              })),
            })"
            type="text"
            required
            class="input w-full"
            :class="{ 'border-red-500': errors[`services[${index}].batch`] }"
            placeholder="Enter service batch"
          />
          <span class="text-red-500 text-sm mt-1 block">
            {{ errors[`services[${index}].batch`] }}
          </span>
        </div>

        <div>
          <label class="block font-bold mb-1">
            Description <span class="text-red-500">*</span>
          </label>
          <input
            v-model="service.description"
            @input="setValues({
              services: editServices.map((item) => ({
                batch: item.batch,
                description: item.description,
              })),
            })"
            type="text"
            required
            class="input w-full"
            :class="{ 'border-red-500': errors[`services[${index}].description`] }"
            placeholder="Enter service description"
          />
          <span class="text-red-500 text-sm mt-1 block">
            {{ errors[`services[${index}].description`] }}
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-4 border-t pt-4">
        <button
          type="button"
          @click="router.push({
            name: 'admin-levelService',
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
