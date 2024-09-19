import { Router } from 'vue-router'
import { canGo } from "@/utils/auth"
import { useUserStore } from '@/store/user'

export function installGuard(router: Router) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const token = userStore.token

    // 已登录
    if (token) {
      if (!userStore.menuPaths.length) {
        await userStore.getAdminInfo()
        return canGo(to.path) ? true : userStore.firstMenuPath
      }

      if (canGo(to.path)) {
        return true
      }

      if (to.path === '/404') {
        return true
      }

      return '/404'
    }

    // 未登录
    if (to.path === '/login') {
      return true
    }

    return '/login'
  })
}
