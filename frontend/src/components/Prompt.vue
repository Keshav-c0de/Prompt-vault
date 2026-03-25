<script setup lang="ts">
  import { usePromptStore } from '@/stores/promptStore'
  import { onMounted, ref, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'


  const promptStore = usePromptStore()
  const auth = useAuthStore()
  const formData = ref({
  title: '',
  description: '',
  prompt: ''
  })
  const isEditing = ref(false)
  const currentEditId = ref(0)
  const isCopied = ref(new Set())
  const isInvaild = ref(false)
  const errorMessage = ref('')
  const expand = ref(new Set())
  const adding = ref(false)


  onMounted(() => {
    promptStore.loadPrompts()
    auth.fetchUser()
  })

  const change = (p: number) => {
    if (expand.value.has(p)) {
      expand.value.delete(p)
    } else {
      expand.value.add(p)
    }
}
  const copy= async (text: string, id:number) => {
    try{
    const success = await promptStore.copyPrompt(text)
    if (success) {
      isCopied.value.add(id)
    } }
    catch (err) {
      console.error("Failed to copy prompt:", err)
    }
    finally {
      setTimeout(() => {
        isCopied.value.delete(id)
      }, 2000)
    }
  }
  const startEdit = (prompt: any) => {
  adding.value = true
  isEditing.value = true
  
  currentEditId.value = prompt.id
  
  formData.value = { 
    title: prompt.title, 
    description: prompt.description, 
    prompt: prompt.prompt 
  }
}

const clear = () => {
  formData.value = { title: '', description: '', prompt: '' }
      isEditing.value = false
      adding.value = false
    }
  const toggle = () => {
  adding.value = !adding.value
    }

  const savePrompt = async () => {
    if (!formData.value.title.trim() || !formData.value.prompt.trim()) {
    isInvaild.value = true;
    errorMessage.value = "Title and Prompt cannot be empty.";
    setTimeout(() => { isInvaild.value = false; }, 2000);
    return;
    }
    let success = false;
    if (isEditing.value) {
      const success = await promptStore.editprompt(currentEditId.value ,formData.value)
      if (success) {
        clear()
      }}
    else  {
    const success = await promptStore.addPrompt(formData.value)
    if (success) {
      clear()
      return
    }
   }}

</script>


<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
    
    <header class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <h2 class="text-xl font-black bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent tracking-tight shrink-0">
          PROMPT VAULT
        </h2>

        <div class="flex-1 max-w-2xl relative">
          <span class="absolute left-3 top-2.5 text-slate-500">🔍</span>
          <input 
            v-model="promptStore.searchQuery" 
            placeholder="Search titles, tags, or content..." 
            class="w-full rounded-full bg-slate-800 py-2 pl-10 pr-4 text-sm border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <button @click="auth.logout()" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Logout
        </button>
      </div>
    </header>

    <main class="flex-1  p-6">
      <section>
        <h3 class="block text-2xl font-black uppercase tracking-tight text-slate-500 mb-2">Welcome ,  {{ auth.user?.name }}</h3>
        <hr class="my-4 h-px border-t-0 bg-slate-400" />
        <br>
      </section>

      <section v-if="adding" class="mb-12 max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h3 class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Create New Prompt</h3>
        <div class="space-y-3">
          <input v-model="formData.title" placeholder="Title" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-lg font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none" />
          <input v-model="formData.description" placeholder="Brief description of what this does..." class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-300 outline-none" />
          <textarea v-model="formData.prompt" placeholder="Paste your prompt here..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-xs font-mono text-emerald-400 min-h-30 outline-none focus:border-emerald-500/50"></textarea>
          
          <div class="flex items-center justify-between pt-2">
            <span v-if="isInvaild" class="text-red-400 text-xs italic">{{ errorMessage }}</span>
            <div class="flex gap-2 ml-auto">
              <button @click="clear()" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">cancel</button>
              <button @click.prevent="savePrompt" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20">
                {{ isEditing ? "Update Prompt" : "Save to Vault" }}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section v-else>
        <div class="flow-root">
        <button @click="toggle" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 mb-8 float-left ">
          + Add New
        </button>
        </div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="p in promptStore.paginatedPrompts" :key="p.id" 
             class="group relative bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
          
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-bold text-lg text-slate-100 group-hover:text-blue-400 transition-colors leading-tight">{{ p.title }}</h3>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="startEdit(p)" class="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-yellow-400">✏️</button>
              <button @click="promptStore.clearprompt(p.id)" class="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400">🗑️</button>
            </div>
          </div>

          <p class="text-slate-400 text-xs mb-4 line-clamp-2 h-8">{{ p.description }}</p>
          <div 
    :class="[
      'overflow-y-auto custom-scrollbar transition-all duration-500',
      expand.has(p.id) ? 'max-h-96' : 'max-h-24'
    ]"
  >

          <div class="relative bg-black/40 rounded-lg p-3 border border-slate-800 group-hover:border-slate-700 transition-colors mb-4">
            <code v-if="expand.has(p.id) " class="text-emerald-500/90 text-[11px] m-2 font-mono  leading-relaxed whitespace-pre-wrap">
              {{ p.prompt }}
            </code>
            <code v-else class="text-emerald-500/90 text-[11px] m-2 font-mono line-clamp-4 leading-relaxed whitespace-pre-wrap">
              {{ p.prompt }}
            </code>
        </div>
              <button @click= change(p.id) class="absolute bottom-1 right-4 text-[10px] text-blue-400 hover:underline">
                {{ expand.has(p.id) ? 'Show Less ↑' : 'Show More ↓' }}
              </button>
          </div>

          <button @click="copy(p.prompt, p.id)" 
                  class="w-full py-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold tracking-widest uppercase transition-all">
                {{ isCopied.has(p.id) ? '✨ Copied!' : 'Copy Prompt' }}
          </button>
        </div>
      </div>

      <div v-if="promptStore.prompts.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-600">
        <span class="text-6xl mb-4 mt-4">🧊</span>
        <p class="text-4xl font-medium ">Your vault is empty</p>
        <p class="text-ml ">Start by adding prompt</p>
      </div>
    </main>
  <footer class="mt-4 mb-6 flex items-center justify-center gap-4">
  <button 
    @click="promptStore.currentPage--" 
    :disabled="promptStore.currentPage === 1"
    class="px-2 py-1 bg-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
  >
    ← Prev
  </button>

  <span class="text-slate-400 text-sm font-mono">
     {{ promptStore.currentPage }} of {{ promptStore.totalPages }}
  </span>

  <button 
    @click="promptStore.currentPage++" 
    :disabled="promptStore.currentPage >= promptStore.totalPages"
    class="px-2 py-1 bg-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
  >
    Next →
  </button>
</footer>
  </div>
</template>
<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b; /* slate-800 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3b82f6; /* blue-500 */
}
</style>