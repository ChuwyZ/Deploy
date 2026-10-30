<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserService from '@/service/UserService'
import type { User } from '@/type'
import UserCard from '@/components/admin/UserCard.vue'

const PAGE_SIZE = 5
const route = useRoute()
const router = useRouter()
const users = ref<User[] | null>(null)
const totalUser = ref(0)

// page + filters live in the URL query: ?page=2&firstname=..&lastname=..&province=..&level=..
const page = computed(() => parseInt(route.query.page as string) || 1)
const inputFirstname = ref((route.query.firstname as string) || '')
const inputLastname = ref((route.query.lastname as string) || '')
const inputProvince = ref((route.query.province as string) || '')
const inputLevel = ref((route.query.level as string) || 'default')

const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalUser.value / PAGE_SIZE)
  return page.value < totalPages
})

const filter = () => {
  router.push({
    name: 'admin-userList',
    query: {
      page: 1,
      firstname: inputFirstname.value.trim() || undefined,
      lastname: inputLastname.value.trim() || undefined,
      province: inputProvince.value.trim() || undefined,
      level: inputLevel.value !== 'default' ? inputLevel.value : undefined,
    },
  })
}

const clearFilter = () => {
  inputFirstname.value = ''
  inputLastname.value = ''
  inputProvince.value = ''
  inputLevel.value = 'default'
  router.push({ name: 'admin-userList', query: { page: 1 } })
}

watchEffect(() => {
  users.value = null
  UserService.getUsers(PAGE_SIZE, page.value, {
    firstname: route.query.firstname as string | undefined,
    lastname: route.query.lastname as string | undefined,
    province: route.query.province as string | undefined,
    level: route.query.level as string | undefined,
  })
    .then((response) => {
      users.value = response.data
      totalUser.value = parseInt(response.headers['x-total-count']) || 0
    })
    .catch((error) => {
      console.error(error)
    })
})
</script>

<template>
  <div class="flex flex-col items-center mt-8">
    <h1 class="text-2xl mb-2 font-bold">User List</h1>
    <p class="text-sm text-gray-600 mb-4">{{ totalUser }} users found</p>

    <form @submit.prevent="filter" class="w-[400px] mb-6 grid grid-cols-2 gap-2">
      <input v-model="inputFirstname" class="input w-full text-sm" placeholder="Name" />
      <input v-model="inputLastname" class="input w-full text-sm" placeholder="Surname" />
      <input v-model="inputProvince" class="input w-full text-sm" placeholder="Province" />
      <select v-model="inputLevel" class="p-2.5 border border-gray-300 rounded text-sm bg-white">
        <option value="default">All levels</option>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
        <option value="4">Level 4</option>
      </select>
      <button type="submit" class="btn-main">Filter</button>
      <button type="button" @click="clearFilter" class="btn-main !bg-gray-400 hover:!bg-gray-500">
        Clear
      </button>
    </form>

    <div class="flex flex-col gap-4 w-[400px]">
      <UserCard v-for="user in users" :key="user.id" :user="user" />
      <p v-if="users && users.length === 0" class="text-center text-gray-500">
        No users match your filters.
      </p>
    </div>

    <!-- Prev / Next are hidden on the first / last page -->
    <div class="flex gap-4 mt-8 mb-8">
      <RouterLink
        v-if="page > 1"
        :to="{ name: 'admin-userList', query: { ...route.query, page: page - 1 } }"
        class="btn-main"
      >
        &#60; Prev Page
      </RouterLink>

      <RouterLink
        v-if="hasNextPage"
        :to="{ name: 'admin-userList', query: { ...route.query, page: page + 1 } }"
        class="btn-main"
      >
        Next Page &#62;
      </RouterLink>
    </div>
  </div>
</template>
