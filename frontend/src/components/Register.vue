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
      <div >
      <h2 class="text-3xl font-black text-white text-center mb-2 tracking-tighter">Create Account</h2>
      <p class="text-slate-500 text-center text-sm mb-8">Signup to get free access.</p>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Username</label>
          <input v-model="username" type="text" required class="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
          <input v-model="password" type="password" required class="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" />
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded border border-red-900/50">
          {{ error }}
        </div>

        <button :disabled="isLoading" type="submit" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition transform active:scale-95 disabled:opacity-50">
          {{ isLoading ? 'Creating Account...' : 'Open Your Vault' }}
        </button>
      </form>
      </div>

</template>