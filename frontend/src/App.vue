<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
const auth =useAuthStore()
onMounted(async () => {
  if (!auth.isInitialized) {
    await auth.checkAuth();
  }
});



</script>
<template>
  <div >
      <div v-if ="!auth.isInitialized" class="space-y-10 ">
          <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617;">
          <div class="loader"></div>
      </div>
      </div>
      <router-view />
  </div>
</template>
<style>
.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>