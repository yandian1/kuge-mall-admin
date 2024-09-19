export type MenuPageItem = {
  id: ID
  pid: ID
  name: string
  path: string
  createTime: string
  updateTime: string
}

export type Menu = {
  id: ID
  pids: ID[]
  name: string
  path: string
  sort: number
  createTime: string
  updateTime: string
}


export type MenuTreeItem = {
  id: ID
  pid: ID
  name: string
  path: string
  children: MenuTreeItem[]
  createTime: string
  updateTime: string
}
