<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LevelService from '@/service/LevelService'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const levelId = Number(route.params.id)
const editBenefits = ref<any[]>([])
const loading = ref(true)
const schema = yup.object({
  benefits: yup.array().of(
    yup.object({
      title: yup.string().trim().required('Benefit title is required'),
      description: yup.string().trim().required('Benefit description is required'),
    }),
  ).min(1, 'At least one benefit is required').required(),
})

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
})

onMounted(() => {
  LevelService.getBenefits(levelId)
    .then((res) => {
      editBenefits.value = res.data.map((benefit: any) => ({
        ...benefit,
        title: benefit.title ?? '',
        description: benefit.description ?? '',
      }))

      setValues({
        benefits: editBenefits.value.map((benefit) => ({
          title: benefit.title,
          description: benefit.description,
        })),
      })
    })
    .catch((err) => {
      console.error('Load benefits failed:', err)
      alert('Failed to load benefits.')
    })
    .finally(() => {
      loading.value = false
    })
})

const save = handleSubmit((values: any) => {
  Promise.all(
    editBenefits.value.map((benefit, index) =>
      LevelService.updateBenefit(benefit.id, {
        title: values.benefits[index].title,
        description: values.benefits[index].description,
        level: { id: levelId },
      }),
    ),
  )
    .then(() => {
      router.push({
        name: 'admin-levelBenefit',
        params: { id: levelId },
      })
    })
    .catch((err) => {
      console.error('Save benefits failed:', err.response?.data || err)
      alert('Failed to save benefits.')
    })
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Edit Benefits</h2>

    <p v-if="loading" class="text-gray-500">Loading benefits...</p>

    <div v-else-if="editBenefits.length === 0" class="text-gray-500">
      No benefits available to edit.
    </div>

    <form
      v-else
      @submit.prevent="save"
      class="flex flex-col gap-4"
    >
      <div
        v-for="(benefit, index) in editBenefits"
        :key="benefit.id"
        class="border border-gray-300 rounded p-4 flex flex-col gap-4"
      >
        <h3 class="font-bold text-gray-800">
          Benefit {{ index + 1 }}
        </h3>

        <div>
          <label class="block font-bold mb-1">
            Benefit Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="benefit.title"
            @input="setValues({
              benefits: editBenefits.map((item) => ({
                title: item.title,
                description: item.description,
              })),
            })"
            type="text"
            required
            class="input w-full"
            :class="{ 'border-red-500': errors[`benefits[${index}].title`] }"
            placeholder="Enter benefit title"
          />
          <span class="text-red-500 text-sm mt-1 block">
            {{ errors[`benefits[${index}].title`] }}
          </span>
        </div>

        <div>
          <label class="block font-bold mb-1">
            Description <span class="text-red-500">*</span>
          </label>
          <input
            v-model="benefit.description"
            @input="setValues({
              benefits: editBenefits.map((item) => ({
                title: item.title,
                description: item.description,
              })),
            })"
            type="text"
            required
            class="input w-full"
            :class="{ 'border-red-500': errors[`benefits[${index}].description`] }"
            placeholder="Enter benefit description"
          />
          <span class="text-red-500 text-sm mt-1 block">
            {{ errors[`benefits[${index}].description`] }}
          </span>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-4 border-t pt-4">
        <button
          type="button"
          @click="router.push({
            name: 'admin-levelBenefit',
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
