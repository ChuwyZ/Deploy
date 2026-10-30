<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 class="text-7xl font-bold mb-2">404</h1>
    <h1 class="text-2xl font-bold mb-4">Page Not Found</h1>

    <RouterLink
      to="/"
      class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm no-underline"
    >
      Go Back To Register
    </RouterLink>
  </div>
</template>
