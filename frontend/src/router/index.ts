import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 
import LoginView from '../components/Login.vue'





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
            component: () => import('../components/popup.vue') 
        },
        {
            path: '/',
            redirect: '/welcome'
        },
        {
          path: '/login',
          redirect: '/welcome'
        },
        {
          path: '/privacypolicy',
          name: 'privacyPolicy',
          component: () => import('../components/PrivacyPolicy.vue')
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