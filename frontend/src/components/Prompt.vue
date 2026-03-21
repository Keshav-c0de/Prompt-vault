<script setup lang="ts">
  import { usePromptStore } from '@/stores/promptStore'
  import { onMounted, ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'


  const auth = useAuthStore()
  const promptStore = usePromptStore()
  const formData = ref({
  title: '',
  description: '',
  prompt: ''
}) 

  onMounted(() => {
    promptStore.loadPrompts()
  })

  const savePrompt = async () => {
    const success = await promptStore.addPrompt(formData.value)
    if (success) {
      formData.value = { title: '', description: '', prompt: '' }
    } else {
      alert('Failed to save prompt. Please try again.')
    }
  }
</script>

<template>
  <h2 class="text-4xl font-bold m-4">Welcome Back, {{ auth.user?.name }}</h2>
  <div>
    <p>enter your prompt:</p>
    <form @submit.prevent="savePrompt" class="p-4">
    <label for="title">Title:</label><br>
    <input v-model="formData.title" type="text" id="title" class="border p-2 rounded w-full"><br>
    <label for="description">Description:</label><br>
    <input v-model="formData.description" type="text" id="description" class="border p-2 rounded w-full"><br>
    <label for="prompt">Prompt:</label><br>
    <textarea v-model="formData.prompt" id="prompt" class="border p-2 rounded w-full"></textarea><br><br>
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Submit
    </button>
  </form>
  </div>
  
  <div v-for="p in promptStore.prompts" :key="p.id" class="bg-blue-600 m-4 box-content rounded-md text-2xl">
    <h3 >Title: {{ p.title }}</h3><br>
    <p>description: {{ p.description }}</p><br>
    <p>prompt: {{ p.prompt }}</p><br>
    <p>updated_at: {{ p.updated_at }}</p>
  </div>
</template>