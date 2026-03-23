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
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const submitForm = async () => {
  errorMessage.value = '';
  try {
    await auth.handleLogin({ 
      email: email.value, 
      pass: password.value 
    });
  } catch (err) {
    errorMessage.value = "Invalid email or password. Try again!";
  }
}
</script>
<template>
  <div >
      <router-view />
  </div>

</template>