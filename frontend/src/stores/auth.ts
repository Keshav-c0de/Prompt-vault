import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios' 
import router from '@/router';


interface User {
  id: number;
  name: string;
  username: string;
}

let EXTENSION_ID: string | null = null;

export const useAuthStore = defineStore('auth', () => { 
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isInitialized = ref(false) 
  const isAuthenticated = ref(false)
  const error = ref<string | null>(null)
  

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
      else if (typeof browser !== "undefined" && browser.storage?.local) {
        browser.storage.local.set({ token: accessToken });
        console.log("Token stored in Browser storage");
      }
    localStorage.setItem('token', accessToken);
    isAuthenticated.value = true;
    await fetchUser(); 
    return true;
  } 
  catch (error) {
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
    else if (typeof browser !== "undefined" && browser.storage?.local) {
      browser.storage.local.remove('token');
      console.log("Token removed from Browser storage");
    }
    window.location.href = '/login'
  }

  async function checkAuth() {
    let tokenValue: any = null;
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const result = await chrome.storage.local.get('token');
      tokenValue = result.token; 
    }else if (typeof browser !== "undefined" && browser.storage?.local) {
      const result = await browser.storage.local.get('token');
      tokenValue = result.token;
    }
     else {
      tokenValue = localStorage.getItem('token');
    }
  
  if (!tokenValue) {
    isInitialized.value = true;
    isAuthenticated.value = false;
    return;
  }

  try {
    const response = await api.get('/me');
    user.value = response.data;
    isAuthenticated.value = true;
  } catch (error) {
    console.error("Auth check failed:", error);
    localStorage.removeItem('token');
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
        chrome.storage.local.remove('token');
    }
    else if (typeof browser !== "undefined" && browser.storage?.local) {
        browser.storage.local.remove('token');
    }
    isAuthenticated.value = false;
  } finally {
    isInitialized.value = true;
  }
}

const handleLogin = async (credentials: { email: string; pass: string }) => {
    try {
      const response = await api.post('/login', credentials);
      const accessToken = response.data.access_token;
      token.value = accessToken;
      isAuthenticated.value = true;
      localStorage.setItem('token', accessToken);
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({ token: accessToken });
      }
      else if (typeof browser !== 'undefined' && browser.storage?.local) {
        await browser.storage.local.set({ token: accessToken });
      }
      router.push('/dashboard');
      
    } catch (error) {
      console.error("Login failed:", error);
      throw error; 
    }finally {
      await syncWithExtension();
    }
  };

  if (window.chrome && chrome.runtime) {
    EXTENSION_ID = "elmjkcoollflnaeaklglbfdjoknjpimh"
  }
  else if (window.browser && browser.runtime) {
    EXTENSION_ID = "prompt-vault@prompt-vault.dev"
  }

  const syncWithExtension =  async () => {
    if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(EXTENSION_ID, { 
        type: "AUTH_SUCCESS", 
        token: token.value 
      }, (response) => {
        console.log("Extension acknowledged sync:", response);
      });
    }
  };

  return { user, token, isAuthenticated, login, fetchUser, logout , isInitialized ,checkAuth, handleLogin, syncWithExtension}
})