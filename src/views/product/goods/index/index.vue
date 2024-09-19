<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="商品名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入商品名称"
          style="width: 250px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="商品分类">
        <a-cascader
          v-model:value="table.query.categoryIds"
          :options="table.categoryOpts"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择商品分类"
          style="width: 250px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="品牌">
        <a-select
          v-model:value="table.query.brandId"
          :options="table.brandOpts"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择品牌"
          style="width: 250px"
          allow-clear
        ></a-select>
      </a-form-item>
      <a-form-item label="状态">
        <a-select
          v-model:value="table.query.status"
          :options="table.statusOpts"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择状态"
          style="width: 250px"
          allow-clear
        ></a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="reset">重置</a-button>
      </a-form-item>
    </a-form>
  </app-header>

  <app-body>
    <a-card title="商品列表" :bordered="false">
      <template #extra>
        <a-button type="link" @click="router.push({ name: 'GoodsAdd' })"
        >添加商品
        </a-button
        >
      </template>

      <a-table
        :columns="columns"
        :data-source="table.list"
        :loading="table.loading"
        row-key="id"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'firstImg'">
            <a-image :width="66" :src="record.firstImg"/>
          </template>
          <template v-if="column.key === 'price'">
            ￥{{ record.price }}
          </template>
          <template v-if="column.key === 'linePrice'">
            ￥{{ record.linePrice }}
          </template>
          <template v-if="column.key === 'status'">
            <a-popconfirm
              :title="`是否${record.status === 1 ? '下架' : '上架'}该商品`"
              @confirm="changeSpuStatus(record)"
            >
              <a-switch
                :checked="record.status"
                :checked-value="1"
                :un-checked-value="0"
                checked-children="已上架"
                un-checked-children="已下架"
                :loading="record.switchLoading"
              />
            </a-popconfirm>
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              :disabled="record.status === 1"
              @click="
                router.push({ name: 'GoodsUpdate', query: { id: record.id } })
              "
            >
              编辑
            </a-button>
            <a-popconfirm
              title="是否删除该商品"
              :disabled="record.status === 1"
              @confirm="delSpu(record.id)"
            >
              <a-button danger type="link" :disabled="record.status === 1">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <app-pagination
        v-model:page-num="table.query.pageNum"
        v-model:page-size="table.query.pageSize"
        :total="table.total"
        @change="getSpuPage"
      />
    </a-card>
  </app-body>
</template>

<script setup lang="ts" name="Goods">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import router from '@/router'
import { columns } from './const'
import * as spuApi from '@/api/admin/spu'
import * as cateApi from '@/api/admin/category'
import * as CateTypes from '@/api/admin/category/types'
import * as brandApi from '@/api/admin/brand'
import * as SpuTypes from '@/api/admin/spu/types'
import * as BrandTypes from '@/api/admin/brand/types'

type SpuPageItem = SpuTypes.SpuPageItem & {
  switchLoading: boolean
}

const statusOpts = [
  {
    name: '已上架',
    id: 1,
  },
  {
    name: '未上架',
    id: 0,
  },
]
const table = reactive({
  query: {
    name: '',
    brandId: undefined,
    categoryIds: [],
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  },
  brandOpts: [] as BrandTypes.Brand[],
  categoryOpts: [] as CateTypes.CategoryTreeItem[],
  statusOpts,
  list: [] as SpuPageItem[],
  total: 0,
  loading: false,
})

const getCategoryTree = () => {
  cateApi
    .getCategoryTree()
    .then((res) => {
      table.categoryOpts = res.data.data
    })
    .catch(() => {
    })
}

const getBrandList = () => {
  brandApi
    .getBrandList({})
    .then((res) => {
      table.brandOpts = res.data.data
    })
    .catch(() => {
      table.loading = false
    })
}

const getSpuPage = () => {
  table.loading = true
  const { categoryIds, ...rest } = table.query
  const params = {
    categoryId: categoryIds?.length ? categoryIds[categoryIds.length - 1] : '',
    ...rest,
  }
  spuApi
    .getSpuPage(params)
    .then((res) => {
      const { list, total } = res.data.data
      table.list = list.map(item => ({
          ...item,
          switchLoading: false
        }
      ))
      table.total = total
      table.loading = false
    })
    .catch(() => {
      table.loading = false
    })
}

const changeSpuStatus = (record: SpuPageItem) => {
  if (record.switchLoading) return
  record.switchLoading = true
  spuApi
    .changeSpuStatus({
      id: record.id,
      status: record.status === 1 ? 0 : 1,
    })
    .then(() => {
      record.switchLoading = false
      message.success(record.status === 1 ? '下架成功' : '上架成功')
      getSpuPage()
    })
    .catch(() => {
      record.switchLoading = false
    })
}

const delSpu = (id: ID) => {
  spuApi
    .delSpu(id)
    .then(() => {
      message.success('删除成功')
      getSpuPage()
    })
    .catch(() => {
    })
}

const search = () => {
  table.query.pageNum = 1
  getSpuPage()
}

const reset = () => {
  table.query = {
    name: '',
    brandId: undefined,
    categoryIds: [],
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  }
  getSpuPage()
}

const init = () => {
  getSpuPage()
  getCategoryTree()
  getBrandList()
}

init()
</script>
