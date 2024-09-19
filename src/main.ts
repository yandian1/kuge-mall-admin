import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import plugins from '@/plugins'
import '@/style/index.less'

const app = createApp(App)

plugins(app).use(router).mount('#app')
