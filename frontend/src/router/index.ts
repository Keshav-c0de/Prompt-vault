import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 
import RegisterView from '../components/Register.vue'
import LoginView from '../components/Login.vue'
import PopupView from '../components/popup.vue'




const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/login', 
            name: 'landingPage', 
            component: LoginView 
        },
        { 
            path: '/register', 
            name: 'register', 
            component: RegisterView 
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
            redirect: '/login'
        }

    ]
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()
    if (!auth.isInitialized) {
      await auth.checkAuth()
    }
    if (to.path === '/dashboard' && !auth.isAuthenticated) {
      return '/login'
    }
    if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
      return '/dashboard'
    }
  })

  export default router