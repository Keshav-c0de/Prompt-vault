import { fetchPrompts, createPrompt } from '@/api/promptAPI';
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

  return { prompts , loadPrompts , addPrompt}
})