<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

const username = ref(''); 
const email = ref('');   
const password = ref('');
const error = ref('')
const isLoading = ref(false)

const router = useRouter()
const auth = useAuthStore()

const handleRegister = async () => {
    error.value = ''; 
    isLoading.value = true;
    
    try {
        const formData = new FormData();
        formData.append("name", username.value);
        formData.append("username", email.value); 
        formData.append("password", password.value);

        await api.post("/register", formData);
        
        formData.delete("name");
        
        await auth.login(formData);
        router.push("/Prompt"); 
    }
    catch (err: any) {
        error.value = err.response?.data?.detail || "Registration failed. Try a different email.";
    }
    finally {
        isLoading.value = false;
    }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
    <div class="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
      <h2 class="text-3xl font-bold text-white text-center mb-8">Create Account</h2>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Username</label>
          <input v-model="username" type="text" required class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded border border-red-900/50">
          {{ error }}
        </div>

        <button :disabled="isLoading" type="submit" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition transform active:scale-95 disabled:opacity-50">
          {{ isLoading ? 'Creating Account...' : 'Open Your Vault' }}
        </button>
      </form>
      
      <p class="mt-6 text-center text-slate-400">
        Already have a vault? <RouterLink to="/login" class="text-blue-500 hover:underline italic">Login</RouterLink>
      </p>
    </div>
  </div>
</template>