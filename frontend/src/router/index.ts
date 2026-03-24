import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 
import LoginView from '../components/Login.vue'
import PopupView from '../components/popup.vue'




const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/welcome', 
            name: 'landingPage', 
            component: LoginView 
        },
       
        { 
            path: '/dashboard', 
            name: 'prompt-vault', 
            component: () => import('../components/Prompt.vue') 
        },
      
        {
            path: '/popup', 
            component: PopupView
        },
        {
            path: '/',
            redirect: '/welcome'
        }

    ]
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()
    if (!auth.isInitialized) {
      await auth.checkAuth()
    }
    if (to.path === '/dashboard' && !auth.isAuthenticated) {
      return '/welcome'
    }
    if (to.path === '/welcome' && auth.isAuthenticated) {
      return '/dashboard'
    }
  })

  export default router