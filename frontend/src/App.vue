<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
const auth =useAuthStore()
onMounted(async () => {
  if (!auth.isInitialized) {
    await auth.checkAuth();
  }
});
</script>
<template>
  <main class="bg-slate-900 min-h-screen">
    <div class="text-center">
  <b-spinner v-if="!auth.isInitialized" variant="primary" label="Text Centered"></b-spinner>
    <RouterView v-else />
  </div>
  </main>
</template>