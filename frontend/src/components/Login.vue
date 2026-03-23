<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'


const username = ref('');
const password = ref('');
const error = ref('')
const isLoading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
    isLoading.value = true
    error.value = ''

    try{
        const formData = new FormData()
        formData.append('username', username.value) 
        formData.append('password', password.value)
        const success =await auth.login(formData)
        if (success) {
            router.push('/dashboard')
        }
    }
    catch (err) {
        error.value = "Access Denied: Invalid email or password."
    }
    finally {
        isLoading.value = false
    }
}



</script>
<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div class="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 ">
            <h2 class="text-3xl font-bold text-white text-center mb-2">AI Prompt Vault</h2>
        <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
                <label for="email" class="block text-sm font-medium text-slate-300 mb-1">Email:</label>
                <input type="text" v-model="username" required class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"/>
            </div>
            <div>
                <label for="password" class="block text-sm font-medium text-slate-300 mb-1">Password:</label>
                <input type="password" v-model="password" required class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"/>
            </div>
            <div v-if="error" class="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded">
                    {{ error }}
             </div>
            <button :disabled="isLoading" type="submit" 
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition transform active:scale-95 disabled:opacity-50">
          {{ isLoading ? 'Unlocking...' : 'Login to Vault' }}
            </button>
        </form>
        <p class="mt-6 text-center  text-slate-400"> Don't have an account? <a href="./register" class="hover:underline text-blue-500 italic"> Register for free.</a>  </p>
        </div>
    </div>
</template>