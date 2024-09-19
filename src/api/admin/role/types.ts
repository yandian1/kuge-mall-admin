export type Role = {
  id: ID
  name: string
  status: number
  createTime: string
  updateTime: string
  menuIds: ID[]
}


export type RoleListItem = {
  id: ID
  name: string
}