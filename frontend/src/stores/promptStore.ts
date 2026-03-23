import { fetchPrompts, createPrompt, deletePrompt, updatePrompt } from '@/api/promptAPI';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePromptStore = defineStore('prompt', () => {
    const prompts = ref<any[]>([])
    const searchQuery = ref('')

  async function loadPrompts() {
    try {
      const data = await fetchPrompts()
      prompts.value= data 
    } catch (err) {
      console.error("Error loading prompts:", err)
    }
  }
  async function addPrompt(newPromptData: any) {
    try {
      const newPrompt = await createPrompt(newPromptData)
      prompts.value.push(newPrompt) 
      return true
    } catch (error) {
      console.error("Store failed to save prompt:", error)
      return false
    }
  }
  async function clearprompt(id : number) {
    try {
      await deletePrompt(id)
    }
    catch (err) {
      console.error("Error deleting prompt:", err)
    }
    finally {prompts.value = prompts.value.filter(p => p.id !== id)}
  }

  async function editprompt(id: number, updatedData: any) {
    try {
      const updatedPrompt = await updatePrompt(id, updatedData)
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = updatedPrompt 
        return true
      }
    } catch (err) {
      console.error("Error updating prompt:", err)
      return false
    }
  }
  async function copyPrompt(text: any) {
    try {
      await navigator.clipboard.writeText(text);
      return true; 
    } catch (err) {
      return false; 
    }
  };

  const filteredPrompts = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return prompts.value
    else{
    return prompts.value.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )}
  })

    const currentPage = ref(1);
    const itemsPerPage = ref(6); 
  
  const paginatedPrompts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredPrompts.value.slice(start, end);
    });
  
    const totalPages = computed(() => 
      Math.ceil(filteredPrompts.value.length / itemsPerPage.value)
    );
  

  return { prompts , loadPrompts , addPrompt , clearprompt , editprompt , copyPrompt , searchQuery, filteredPrompts, paginatedPrompts, itemsPerPage, currentPage, totalPages}
})
