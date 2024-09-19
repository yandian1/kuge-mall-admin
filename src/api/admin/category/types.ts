export type CategoryPageItem = {
  id: ID
  pid: ID
  name: string
  img: string
  createTime: string
  updateTime: string
  children: CategoryPageItem[]
}

export type CategoryTreeItem = {
  id: ID
  pid: ID
  name: string
  children: CategoryTreeItem[]
}

export type CategoryDetail = {
  id: ID
  pid: ID
  pids: ID[]
  name: string
  img: string
  sort: number
}