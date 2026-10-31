<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useLevelStore } from '@/stores/level'

const userStore = useUserStore()
const levelStore = useLevelStore()
</script>

<template>
  <div v-if="userStore.user" class="flex flex-col items-center mt-10">
    <h1 class="text-2xl font-bold mb-6">
      Welcome, {{ userStore.user.name }} {{ userStore.user.surname }}
    </h1>
    <div class="w-[400px] p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-bold mb-3">Current Level</h2>
      <p class="mb-3">Level {{ userStore.user.level }}</p>
      <h2 class="text-xl font-bold mb-3 mt-6">Benefits</h2>
      <div v-for="benefit in levelStore.benefits" :key="benefit.id" class="mb-4">
        <p class="font-bold">
          {{ benefit.title }}
        </p>
        <p>
          {{ benefit.description }}
        </p>
      </div>
      <h2 class="text-xl font-bold mb-3 mt-6">Available Services</h2>
      <div v-for="service in levelStore.services" :key="service.id" class="mb-3">
        <p class="font-semibold">{{ service.batch }}</p>
        <p class="text-sm">{{ service.description }}</p>
      </div>
    </div>
  </div>
</template>
