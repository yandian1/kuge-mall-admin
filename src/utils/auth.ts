import * as AuthTypes from "@/api/auth/types"
import { useUserStore } from "@/store/user.ts";

export function getFirstMenuPath(menuPaths: string[]) {
  for (let menuPath of menuPaths) {
    const firstIdx = menuPath.indexOf("/")
    const secondIdx = menuPath.indexOf("/", firstIdx + 1)
    if (firstIdx !== secondIdx && firstIdx !== -1 && secondIdx !== -1) {
      return menuPath
    }
  }

  return menuPaths[0]
}

export function getMenuPaths(menus: AuthTypes.AdminInfo['menus']) {

  const recur = (menus: AuthTypes.AdminInfo['menus']) => {
    const list: string[] = []

    for (const menu of menus) {
      list.push(menu.path)
      if (menu.children?.length) {
        list.push(...recur(menu.children))
      }
    }

    return list
  }

  return recur(menus)
}

export function getMenuIds(menus: AuthTypes.AdminInfo['menus']) {

  const recur = (menus: AuthTypes.AdminInfo['menus']) => {
    const list: ID[] = []

    for (const menu of menus) {
      list.push(menu.id)
      if (menu.children?.length) {
        list.push(...recur(menu.children))
      }
    }

    return list
  }

  return recur(menus)
}

export function canGo(toPath: string) {
  const userStore= useUserStore()
  return userStore.menuPaths.some((path) => {
    return toPath === path || (toPath.startsWith(path) && toPath.replace(path, '').indexOf('/') <= 0)
  })
}