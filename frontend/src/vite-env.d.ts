/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;  // remove `?` — enforce it's always set
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export { };