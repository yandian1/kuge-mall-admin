import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'
import { AdminInfo } from '@/api/auth/types'
import { getFirstMenuPath, getMenuIds, getMenuPaths } from "@/utils/auth"

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      user: {} as AdminInfo['user'],
      roleIds: [] as AdminInfo['roleIds'],
      menus: [] as AdminInfo['menus'],
    }
  },

  getters: {
    menuPaths(state) {
      return getMenuPaths(state.menus)
    },
    menuIds(state) {
      return getMenuIds(state.menus)
    },
    firstMenuPath() {
      return getFirstMenuPath(this.menuPaths as unknown as string[])
    },
  },

  actions: {
    login(params: Recordable) {
      return authApi
        .login(params)
        .then((res) => {
          const data = res.data.data
          this.token = data.token
          this.user = data.user
          this.roleIds = data.roleIds
          this.menus = data.menus
          return res
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    logout() {
      return authApi
        .logout()
        .then(() => {
          this.$reset()
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },

    getAdminInfo() {
      return authApi
        .getAdminInfo()
        .then((res) => {
          const data = res.data.data
          this.token = data.token
          this.user = data.user
          this.roleIds = data.roleIds
          this.menus = data.menus
          return res
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
  },
  persist: {
    paths: ['token'],
  },
})
