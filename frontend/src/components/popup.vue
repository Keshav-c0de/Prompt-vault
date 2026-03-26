<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePromptStore } from '@/stores/promptStore';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';


const promptStore = usePromptStore();
const authStore = useAuthStore();
const copiedId = ref<number | null>(null); 
const route = useRouter()
const expand = ref(new Set<number>());
const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);


onMounted(async () => {
  await authStore.checkAuth();
  if (authStore.isAuthenticated) {
    await promptStore.loadPrompts();
  }
});

const handleLogin = async () => {
    isLoading.value = true;
    error.value = '';

    try {
        const formData = new FormData();
        formData.append('username', username.value); 
        formData.append('password', password.value);
        
        const success = await authStore.login(formData);
        if (success) {
          await promptStore.loadPrompts();
        }
    } catch (err) {
        error.value = "Access Denied: Invalid email or password.";
    } finally {
        isLoading.value = false;
    }
};


const change = (id: number) => {
  if (expand.value.has(id)) {
    expand.value.delete(id);
  } else {
    expand.value.add(id);
  }
}

const handleCopy = async (text: string, id: number) => {
  try {
    await navigator.clipboard.writeText(text);
    
    copiedId.value = id;
    setTimeout(() => {
      copiedId.value = null;
    }, 1500);
  } catch (err) {
    console.error("Failed to copy!", err);
  }
};

const openDashboard = () => {
  const url = "https://www.prompt-vault.dev/dashboard";
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.create({ url });
  }
  else if (typeof browser !== "undefined" && browser.tabs) {
    browser.tabs.create({ url });
  }
   else {
    window.open(url, '_blank');
  }
};

</script>

<template>
  <div class="popup-wrapper bg-slate-900 text-slate-100 flex flex-col rounded-2xl">
      <header class="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
        <h2 class="text-xl font-black bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent tracking-tight shrink-0 text-center items-center mb-2">
          PROMPT VAULT
        </h2>
      </header>
    <main class="flex-1 overflow-y-auto p-4 custom-scrollbar">
      
      <div v-if="!authStore.isAuthenticated" class=" py-5">
                  <form @submit.prevent="handleLogin" class="space-y-5">
                      <div>
                          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ">Email</label>
                          <input type="text" v-model="username" required class="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"/>
                      </div>
                      <div>
                          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
                          <input type="password" v-model="password" required class="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"/>
                      </div>
                      
                      <div v-if="error" class="text-red-400 text-xs text-center font-bold bg-red-900/10 py-3 rounded-lg border border-red-900/20">
                          {{ error }}
                      </div>

                      <button :disabled="isLoading" type="submit" 
                          class="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50">
                          {{ isLoading ? 'Unlocking...' : 'Login to Vault' }}
                      </button>
                  </form>
             <p class="text-slate-500 text-center text-sm m-4">Login to access your private vault.</p>   
        </div>
      
      <div v-else class="space-y-5">
        <input 
        v-model="promptStore.searchQuery"
        type="text"
        placeholder="Search here"
        autofocus
        class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors z-10 sticky top-0 "
      />
      <div v-if="promptStore.filteredPrompts.length === 0" class="text-center py-10 text-slate-500">
        No prompts saved.
      </div>
      <div v-else class="space-y-3">
        <div 
          v-for="p in promptStore.filteredPrompts" 
          :key="p.id" 
          class="bg-slate-800 border border-slate-700 rounded-xl p-3 hover:border-slate-500 transition-all group"
        >
          <div class="flex justify-between items-start mb-1">
            <p class="text-sm font-semibold text-blue-300 truncate pr-2">{{ p.title }}</p>
            <div class="flex flex-col">
            <button 
              @click="handleCopy(p.prompt, p.id)"
              :class="copiedId === p.id ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'"
              class="text-[10px] m-2 uppercase tracking-wider font-bold px-2 py-1 rounded transition-colors min-w-15"
            >
              {{ copiedId === p.id ? 'COPIED!' : 'COPY' }}
            </button>
    
        </div> 
          </div>
          <p v-if="expand.has(p.id)" class="text-xs text-yellow-200 line-clamp-none "  >{{ p.prompt }}</p>
          <p v-else class="text-xs text-yellow-200 line-clamp-4 "  >{{ p.prompt }}</p>
          <button @click= change(p.id) class="text-[10px] mt-1 text-blue-400 hover:underline">
            {{ expand.has(p.id) ? 'Show Less' : 'Show More' }}
          </button>
        </div>
      </div>
      </div>  
    </main>

    <footer class="p-3 border-t border-slate-800 text-center bg-slate-800/50">
      <button @click="openDashboard" class="text-[11px] text-slate-500 hover:text-blue-400 flex items-center justify-center w-full gap-1">
        Register Free / Add New <span>↗</span>
      </button>
    </footer>
  </div>
</template>

<style scoped>
.popup-wrapper {
  width: 350px;
  height: 500px;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>