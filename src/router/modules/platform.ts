import { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import homepage from '@/views/platform/homepage/index.vue'
import freight from '@/views/platform/freight/index.vue'
import shop from '@/views/platform/shop/index.vue'

export default [
  {
    path: '/platform',
    name: 'Platform',
    component: layout,
    meta: {
      title: '平台管理',
      icon: 'platform'
    },
    children: [
      {
        path: 'homepage',
        name: 'Homepage',
        component: homepage,
        meta: {
          title: '首页配置',
        },
      },
      {
        path: 'freight',
        name: 'Freight',
        component: freight,
        meta: {
          title: '运费模板',
        },
      },
      {
        path: 'shop',
        name: 'Shop',
        component: shop,
        meta: {
          title: '店铺管理',
        },
      },
    ],
  },
] as RouteRecordRaw[]
