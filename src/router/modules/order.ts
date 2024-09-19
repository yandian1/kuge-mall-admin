import { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import order from '@/views/order/order/index/index.vue'
import orderDetail from '@/views/order/order/detail/index.vue'
import afterSale from '@/views/order/afterSale/index.vue'
import afterSaleDetail from '@/views/order/afterSale/detail.vue'

export default [
  {
    path: '/orderManage',
    name: 'OrderManage',
    component: layout,
    meta: {
      title: '订单管理',
      icon: 'order'
    },
    children: [
      {
        path: 'order',
        name: 'Order',
        component: order,
        meta: {
          title: '订单列表',
        },
      },
      {
        path: 'order/detail',
        name: 'OrderDetail',
        component: orderDetail,
        meta: {
          title: '订单详情',
        },
      },
      {
        path: 'afterSale',
        name: 'AfterSale',
        component: afterSale,
        meta: {
          title: '售后管理',
        },
      },
      {
        path: 'afterSale/detail',
        name: 'AfterSaleDetail',
        component: afterSaleDetail,
        meta: {
          title: '售后详情',
        },
      },
    ],
  },
] as RouteRecordRaw[]
