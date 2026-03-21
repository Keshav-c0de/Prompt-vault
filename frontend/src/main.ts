import './assets/style.css' 
import { useAuthStore } from './stores/auth'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router' 

const app = createApp(App)

app.use(createPinia())
app.use(router) 

if (localStorage.getItem('token')) {
  const authStore = useAuthStore()
  authStore.fetchUser()
}

app.mount('#app')