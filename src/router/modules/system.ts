import { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import user from '@/views/system/user/index.vue'
import role from '@/views/system/role/index.vue'
import menu from '@/views/system/menu/index.vue'
import dictType from '@/views/system/dict/type/index.vue'
import dictValue from '@/views/system/dict/value/index.vue'

export default [
  {
    path: '/system',
    name: 'System',
    component: layout,
    meta: {
      title: '系统管理',
      icon: 'system',
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: user,
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'role',
        name: 'Role',
        component: role,
        meta: {
          title: '角色管理',
        },
      },
      {
        path: 'menu',
        name: 'Menu',
        component: menu,
        meta: {
          title: '菜单管理',
        },
      },
      {
        path: 'dict/type',
        name: 'DictType',
        component: dictType,
        meta: {
          title: '字典管理',
        },
      },
      {
        path: 'dict/type/value',
        name: 'DictValue',
        component: dictValue,
        meta: {
          title: '字典值管理',
          hidden: true
        },
      },
    ],
  },
] as RouteRecordRaw[]
