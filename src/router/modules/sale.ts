import { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import coupon from '@/views/sale/coupon/index/index.vue'
import couponDetail from '@/views/sale/coupon/detail/index.vue'
import seckill from '@/views/sale/seckill/index/index.vue'
import seckillDetail from '@/views/sale/seckill/detail/index.vue'
import activity from '@/views/sale/activity/index/index.vue'
import activityDetail from '@/views/sale/activity/detail/index.vue'

export default [
  {
    path: '/saleManage',
    name: 'SaleManage',
    component: layout,
    meta: {
      title: '营销管理',
      icon: 'sale'
    },
    children: [
      {
        path: 'coupon',
        name: 'Coupon',
        component: coupon,
        meta: {
          title: '优惠券管理',
        },
      },
      {
        path: 'coupon/create',
        name: 'CouponCreate',
        component: couponDetail,
        meta: {
          title: '新增优惠券',
        },
      },
      {
        path: 'coupon/edit',
        name: 'CouponEdit',
        component: couponDetail,
        meta: {
          title: '编辑优惠券',
        },
      },
      {
        path: 'seckill',
        name: 'Seckill',
        component: seckill,
        meta: {
          title: '秒杀管理',
        },
      },
      {
        path: 'seckill/create',
        name: 'SeckillCreate',
        component: seckillDetail,
        meta: {
          title: '新增秒杀活动',
        },
      },
      {
        path: 'seckill/edit',
        name: 'SeckillEdit',
        component: seckillDetail,
        meta: {
          title: '编辑秒杀活动',
        },
      },
      {
        path: 'activity',
        name: 'Activity',
        component: activity,
        meta: {
          title: '活动管理',
        },
      },
      {
        path: 'activity/create',
        name: 'ActivityCreate',
        component: activityDetail,
        meta: {
          title: '新增活动',
        },
      },
      {
        path: 'activity/edit',
        name: 'ActivityEdit',
        component: activityDetail,
        meta: {
          title: '编辑活动',
        },
      },
    ],
  },
] as RouteRecordRaw[]
