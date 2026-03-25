<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Register from '@/components/Register.vue';

const isOpen = ref(false);
const entrystate = ref<'login' | 'register'>('login');
const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const auth = useAuthStore();
const router = useRouter();

const openModal = (state: 'login' | 'register') => {
    entrystate.value = state;
    isOpen.value = true;
    error.value = ''; 
};

const openregister = () => {
    entrystate.value = 'register';
    isOpen.value = true;
    error.value = '';
};

const handleLogin = async () => {
    isLoading.value = true;
    error.value = '';

    try {
        const formData = new FormData();
        formData.append('username', username.value); 
        formData.append('password', password.value);
        
        const success = await auth.login(formData);
        if (success) {
            isOpen.value = false;
            router.push('/dashboard');
        }
    } catch (err) {
        error.value = "Access Denied: Invalid email or password.";
    } finally {
        isLoading.value = false;
    }
};

const copySample = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard!");
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
    
    <nav class="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-slate-900/50">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">V</div>
        <span class="text-xl font-bold tracking-tight text-slate-100">PromptVault</span>
      </div>
      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="https://github.com/Keshav-c0de/Prompt-vault" target="_blank" class="hover:text-white transition-colors">GitHub</a>
        <a href="mailto:kingkeshav06@gmail.com" class="hover:text-white transition-colors">Support</a>
        <button @click="openModal('login')" class="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-5 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
          Login to Vault
        </button>
      </div>
    </nav>

    <main class="relative pt-24 pb-32 px-6">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[25%] left-1/2 -translate-x-1/2 w-250 h-150 bg-blue-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div class="relative max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400 mb-8 shadow-inner">
          <span class="text-blue-500">★</span> Open Source & Community Supported
        </div>

        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05]">
          Your AI Prompts, <br />
          <span class="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">Organized in Seconds</span>
        </h1>

        <p class="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate extension for prompt engineers. Store, search, and copy your best AI instructions across any website effortlessly.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button class="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all shadow-2xl shadow-white/5">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" class="w-6 h-6" />
            Add to Chrome
          </button>
          
          <button @click="openModal('login')" class="w-full sm:w-auto bg-slate-900 border border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all">
            ✨ Get Started Free
          </button>
        </div>
      </div>

      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 border-t border-slate-900 pt-16">
        <div class="text-center group">
          <div class="text-3xl font-black mb-1 group-hover:text-blue-400 transition-colors">100%</div>
          <div class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Privacy First</div>
        </div>
        <div class="text-center border-x border-slate-900 group">
          <div class="text-3xl font-black mb-1 group-hover:text-blue-400 transition-colors">∞</div>
          <div class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Unlimited Prompts</div>
        </div>
        <div class="text-center group">
          <div class="text-3xl font-black mb-1 group-hover:text-blue-400 transition-colors">Local</div>
          <div class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Fast Processing</div>
        </div>
      </div>
    </main>

    <section class="bg-black py-20 px-6 border-y border-slate-900">
       <div class="max-w-6xl mx-auto bg-slate-900/50 rounded-3xl border border-slate-800 p-4 shadow-2xl">
         <img src='@/assets/screenshot.gif' alt="Dashboard Preview" class="w-full rounded-2xl opacity-90 grayscale hover:grayscale-0 transition-all duration-700" />
       </div>
    </section>

<section class="py-24 px-6 bg-slate-950 relative overflow-hidden ">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent"></div>
    <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Master Your Workflow</h2>
                <p class="text-slate-400 max-w-xl mx-auto">Start with our community favorites. High-performance prompts designed for speed and precision.</p>
            </div>


        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="group bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full">
                <div class="flex items-center gap-3 mb-4">

                    <span class="p-2 bg-blue-600/10 rounded-lg text-blue-400 text-lg">💻</span>
                    <h3 class="font-bold text-slate-100">The Senior Debugger</h3>

                </div>
            <p class="text-sm text-slate-400 mb-6 grow italic">"Acts as a Senior Full-stack Engineer to identify logical flaws in your component logic."</p>
                    <div class="bg-black/40 rounded-xl p-4 border border-slate-800 mb-6 group-hover:border-slate-700 transition-colors">
                        <code class="text-[10px] font-mono text-emerald-400/80 leading-relaxed line-clamp-3">Analyze this code for race conditions and potential memory leaks. Provide three specific refactoring suggestions...</code>
                    </div>
                    <button @click='copySample("Analyze this code for race conditions and potential memory leaks. Provide three specific refactoring suggestions...")' class="w-full py-3 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-xs font-black uppercase tracking-widest transition-all">Copy to Clipboard</button>
        </div>

        <div class="group bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full shadow-2xl shadow-indigo-500/5">
            <div class="flex items-center gap-3 mb-4">
                <span class="p-2 bg-indigo-600/10 rounded-lg text-indigo-400 text-lg">📈</span>
                <h3 class="font-bold text-slate-100">Growth Strategist</h3>
            </div>
        <p class="text-sm text-slate-400 mb-6 grow italic">"Generates high-converting SaaS headlines using the AIDA framework."</p>
            <div class="bg-black/40 rounded-xl p-4 border border-slate-800 mb-6 group-hover:border-slate-700 transition-colors">
                <code class="text-[10px] font-mono text-emerald-400/80 leading-relaxed line-clamp-3">Using the Attention-Interest-Desire-Action model, draft 5 variants of a landing page headline for...</code>
            </div>

        <button @click="copySample('Using the Attention-Interest-Desire-Action model, draft 5 variants of a landing page headline for...')" class="w-full py-3 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-xs font-black uppercase tracking-widest transition-all">Copy to Clipboard</button>
        </div>

        <div class="group bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full">
        <div class="flex items-center gap-3 mb-4">
            <span class="p-2 bg-purple-600/10 rounded-lg text-purple-400 text-lg">🎨</span>
            <h3 class="font-bold text-slate-100">Image Architect</h3>
        </div>
        <p class="text-sm text-slate-400 mb-6 grow italic">"Hyper-detailed Midjourney prompts for architectural visualization."</p>
        <div class="bg-black/40 rounded-xl p-4 border border-slate-800 mb-6 group-hover:border-slate-700 transition-colors">
            <code class="text-[10px] font-mono text-emerald-400/80 leading-relaxed line-clamp-3">
            Minimalist glass house in a pine forest, cinematic lighting, 8k resolution, photorealistic, architectural...</code>
        </div>
            <button @click="copySample('Minimalist glass house in a pine forest, cinematic lighting, 8k resolution, photorealistic, architectural...')" class="w-full py-3 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-xs font-black uppercase tracking-widest transition-all">Copy to Clipboard</button>
        </div>
    </div>
   

        <div class="mt-16 text-center">
            <p class="text-slate-500 text-sm mb-6">Want to store your own?</p>
            <button @click="openregister" class="text-blue-400 font-bold hover:text-blue-300 transition-colors underline decoration-blue-500/30 underline-offset-8">
                Create your free vault account →
            </button>  
        </div>
    </div>
</section>

    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div @click="isOpen = false" class="absolute inset-0 bg-slate-950/90 backdrop-blur-md"></div>
          
          <div class="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl shadow-blue-500/10">
              
              <button @click="isOpen = false" class="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors text-xl">✕</button>

              <div v-if="entrystate === 'login'">
                  <h2 class="text-3xl font-black text-white text-center mb-2 tracking-tighter">Welcome Back</h2>
                  <p class="text-slate-500 text-center text-sm mb-8">Login to access your private vault.</p>

                  <form @submit.prevent="handleLogin" class="space-y-5">
                      <div>
                          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email</label>
                          <input type="text" v-model="username" required class="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"/>
                      </div>
                      <div>
                          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
                          <input type="password" v-model="password" required class="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"/>
                      </div>
                      
                      <div v-if="error" class="text-red-400 text-xs text-center font-bold bg-red-900/10 py-3 rounded-lg border border-red-900/20">
                          {{ error }}
                      </div>

                      <button :disabled="isLoading" type="submit" 
                          class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50">
                          {{ isLoading ? 'Unlocking...' : 'Login to Vault' }}
                      </button>
                  </form>

                  <p class="mt-8 text-center text-xs font-bold text-slate-500"> 
                      New here? 
                      <button @click="entrystate = 'register'" class="text-blue-500 hover:underline">Create an Account</button> 
                  </p>
              </div>

              <div v-else>
                  <Register @success="entrystate = 'login'" /> 
                  <p class="mt-8 text-center text-xs font-bold text-slate-500">
                      Already a member? 
                      <button @click="entrystate = 'login'" class="text-blue-500 hover:underline">Sign In</button>
                  </p>
              </div>
          </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>