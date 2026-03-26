import axios from 'axios';

const api = axios.create({
  baseURL: "https://www.prompt-vault.dev/api",
});

interface TokenData {
  access_token: string;
}

api.interceptors.request.use(async (config) => {
  let rawData: any = null;

  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    const result = await chrome.storage.local.get('token');
    rawData = result.token; 
  }
  else if (typeof browser !== "undefined" && browser.storage?.local) {
    const result = await browser.storage.local.get('token');
    rawData = result.token; 
  }
  
  else {
    rawData = localStorage.getItem('token');
  }

  let token: string | null = null;

  
  if (rawData) {
    try {
      
      const parsedData: TokenData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      token = parsedData.access_token || rawData; 
    } catch (e) {
     
      token = rawData;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;