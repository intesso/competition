/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SHARED_SERVER_HOSTNAME: string
  readonly SHARED_SERVER_PORT: string
  readonly SHARED_SERVER_RECONNECT_TIMER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
