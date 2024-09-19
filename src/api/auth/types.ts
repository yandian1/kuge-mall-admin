type Menu = {
  id: ID
  name: string
  path: string
  children: Menu[]
}

export type AdminInfo = {
  token: string
  user: {
    id: ID
    name: string
    account: string
  }
  roleIds: ID[]
  menus: Menu[]
}