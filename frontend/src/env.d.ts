/// <reference types="vite/client" />
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

import type { Browser } from 'web-ext-types';

declare global {
  const browser: typeof chrome; 
}
export {};