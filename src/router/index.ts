import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/views/constant/Login.vue'
import NotFound from '@/views/constant/NotFound.vue'
import { installGuard } from './guard'

const modules: Recordable = import.meta.glob('./modules/*.ts', {
  eager: true,
})
const moduleRoutes: RouteRecordRaw[] = []

for (const key in modules) {
  moduleRoutes.push(...modules[key].default)
}

const routes = [
  ...moduleRoutes,
  { path: '/login', name: '登录', component: Login },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

installGuard(router)

export { moduleRoutes }

export default router
