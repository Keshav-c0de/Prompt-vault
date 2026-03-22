<script setup lang="ts">
  import { usePromptStore } from '@/stores/promptStore'
  import { onMounted, ref, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'


  const promptStore = usePromptStore()
  const formData = ref({
  title: '',
  description: '',
  prompt: ''
  })
  const isEditing = ref(false)
  const currentEditId = ref(0)
  const isAdding = ref(false)
  const isCopied = ref(false)

  onMounted(() => {
    promptStore.loadPrompts()
  })

  const copy= async (text: string) => {
    try{
    const success = await promptStore.copyPrompt(text)
    if (success) {
      isCopied.value = true
    } }
    catch (err) {
      console.error("Failed to copy prompt:", err)
    }
    finally {
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    }
  }
  const startEdit = (prompt: any) => {
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
      isAdding.value = false
      isEditing.value = false
    }

  const savePrompt = async () => {
    if (isEditing.value && isAdding.value) {
      const success = await promptStore.editprompt(currentEditId.value ,formData.value)
      if (success) {
        clear()
      }}
    else if (isAdding.value) {
    const success = await promptStore.addPrompt(formData.value)
    if (success) {
      clear()
      return
    }
   }}

</script>


  <template>
  <div class="p-6 bg-slate-900 min-h-screen text-white">
    <div class="p-4 bg-slate-900">
    <input 
      v-model="promptStore.searchQuery" 
      placeholder="Search by title or description..." 
      class="w-full rounded bg-slate-700 p-2 text-white border border-slate-600 focus:border-blue-500 outline-none"
    />
    </div>
    <h2 class="text-2xl mb-4">AI Prompt Vault</h2>
    <form @submit.prevent="savePrompt" class="mb-8 p-4 bg-slate-800 rounded">
      <input v-model="formData.title" placeholder="Title" class="font-bold text-xl text-blue-300 w-full mb-2 p-2 bg-slate-700 rounded" />
      <input v-model="formData.description" placeholder="Description" class="font-bold text-xl text-blue-300 w-full mb-2 p-2 bg-slate-700 rounded" />
      <textarea v-model="formData.prompt" placeholder="The Prompt" class=" text-xs font-mono text-emerald-400 w-full mb-2 p-2 bg-slate-700 rounded"></textarea>
      <button type="submit" @click="isAdding= true" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">{{ isEditing ? "update Prompt" : "save Prompt" }}</button>
      <button  @click="clear()" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
        clear prompt
      </button>
    </form>

    <hr class="border-slate-700 mb-8" />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="p in promptStore.filteredPrompts" :key="p.id" class="p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
        <h3 class="font-bold text-xl text-blue-300">{{ p.title }}</h3>
        <p class="text-slate-300 text-sm mb-2">{{ p.description }}</p>
        <div class="bg-black/30 p-2 rounded text-xs font-mono text-emerald-400">
          {{ p.prompt }}
        </div>
        <button type="submit" @click="promptStore.clearprompt(p.id)" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Delete Prompt</button>
        <button type="submit" @click="startEdit(p)" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Edit Prompt</button>
        <button type="submit" @click= "copy(p.prompt)" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">Copy Prompt</button>
      </div>
      <span v-if="isCopied" class="text-gray-500 italic text-2xl">Copy</span>
    </div>

    <div v-if="promptStore.prompts.length === 0" class="text-center text-slate-500 mt-10">
      No prompts found. Your vault is empty!
    </div>
  </div>
</template>