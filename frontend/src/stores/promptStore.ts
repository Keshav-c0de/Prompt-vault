import { fetchPrompts, createPrompt, deletePrompt, updatePrompt } from '@/api/promptAPI';
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePromptStore = defineStore('prompt', () => {
    const prompts = ref<any[]>([])

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
  async function copyPrompt (text: any) {
    try {
      await navigator.clipboard.writeText(text);
      return true; 
    } catch (err) {
      return false; 
    }
  };

  return { prompts , loadPrompts , addPrompt , clearprompt , editprompt , copyPrompt}
})