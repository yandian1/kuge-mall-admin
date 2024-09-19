import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { App } from 'vue'

const piniaInstance = createPinia()
piniaInstance.use(piniaPluginPersistedstate)

export function pinia(app: App) {
  app.use(piniaInstance)
}
