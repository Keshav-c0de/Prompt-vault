import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios' 


interface User {
  id: number;
  name: string;
  username: string;
}

export const useAuthStore = defineStore('auth', () => { 
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isInitialized = ref(false) 
  const isAuthenticated = ref(false)
  

async function login(formData: FormData): Promise<boolean> {
  try {
    if (user.value) {
      await fetchUser();
      return true; 
    }
    const response = await api.post('/login', formData);
    const accessToken = response.data.access_token;
    
    token.value = accessToken;
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        chrome.storage.local.set({ token: accessToken });
        console.log("Token stored in Chrome storage");
      }
    localStorage.setItem('token', accessToken);
    isAuthenticated.value = true;
    await fetchUser(); 
    return true;
  } catch (error) {
    console.error("Login Error:", error);
    localStorage.removeItem('token');
    isAuthenticated.value = false; 
    return false; 
  }
}

  async function fetchUser() {
    try {
      const response = await api.get('/me')
      user.value = response.data
    }
    catch (error) {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.remove('token');
      console.log("Token removed from Chrome storage");
    }
    window.location.href = '/login'
  }

  async function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    isInitialized.value = true;
    isAuthenticated.value = false;
    return;
  }

  try {
    const response = await api.get('/me');
    user.value = response.data;
    isAuthenticated.value = true;
  } catch (error) {
    localStorage.removeItem('token');
    isAuthenticated.value = false;
  } finally {
    isInitialized.value = true;
  }
}
  return { user, token, isAuthenticated, login, fetchUser, logout , isInitialized ,checkAuth}
})