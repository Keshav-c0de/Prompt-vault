import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Popup from '@/components/popup.vue'
import './assets/style.css'

const app = createApp(Popup)
app.use(createPinia())
app.mount('#app')