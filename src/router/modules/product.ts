import { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import goodsList from '@/views/product/goods/index/index.vue'
import goodsDetail from '@/views/product/goods/detail/index.vue'
import category from '@/views/product/category/index.vue'
import brand from '@/views/product/brand/index.vue'

export default [
  {
    path: '/product',
    name: 'Product',
    component: layout,
    meta: {
      title: '商品管理',
      icon: 'product'
    },
    children: [
      {
        path: 'category',
        name: 'Category',
        component: category,
        meta: {
          title: '分类管理',
        },
      },
      {
        path: 'brand',
        name: 'Brand',
        component: brand,
        meta: {
          title: '品牌管理',
        },
      },
      {
        path: 'goods',
        name: 'Goods',
        component: goodsList,
        meta: {
          title: '商品管理',
        },
      },
      {
        path: 'goods/add',
        name: 'GoodsAdd',
        component: goodsDetail,
        meta: {
          title: '添加商品',
          hidden: true,
        },
      },
      {
        path: 'goods/update',
        name: 'GoodsUpdate',
        component: goodsDetail,
        meta: {
          title: '编辑商品',
          hidden: true,
        },
      },
    ],
  },
] as RouteRecordRaw[]
