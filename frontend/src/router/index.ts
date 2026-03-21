import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 
import RegisterView from '../components/Register.vue'
import LoginView from '../components/Login.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/login', 
            name: 'login', 
            component: LoginView 
        },
        { 
            path: '/register', 
            name: 'register', 
            component: RegisterView 
        },
        /*
        { 
            path: '/verify', 
            name: 'verify', 
            component: () => import('../components/Verify.vue') 
        },*/
        { 
            path: '/prompts', 
            name: 'prompt-vault', 
            component: () => import('../components/Prompt.vue') 
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
    if (to.path === '/prompts' && !auth.isAuthenticated) {
      return '/login'
    }
    if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
      return '/prompts'
    }
  })
  export default router