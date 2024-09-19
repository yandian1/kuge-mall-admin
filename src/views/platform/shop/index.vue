<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="店铺名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入店铺名称"
          allow-clear
        />
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
    <a-card title="店铺列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: '' }"
          >
          添加店铺
        </a-button>
      </template>

      <a-table
        :dataSource="table.list"
        :columns="columns"
        :loading="table.loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="addUpdateProps = { visible: true, id: record.id }"
              >编辑</a-button
            >
            <a-popconfirm
              title="确认删除该店铺？"
              @confirm="delShop(record.id)"
            >
              <a-button danger type="link">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <app-pagination
        v-model:page-num="table.query.pageNum"
        v-model:page-size="table.query.pageSize"
        :total="table.total"
        @change="getShopPage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getShopPage"
  />
</template>

<script setup lang="ts" name="Shop">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import * as shopApi from '@/api/admin/shop'
import * as ShopTypes from '@/api/admin/shop/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'

const table = reactive({
  query: {
    name: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as ShopTypes.ShopPageItem[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: '',
})

const getShopPage = () => {
  table.loading = true
  shopApi
    .getShopPage(table.query)
    .then((res) => {
      const { list, total } = res.data.data
      table.list = list
      table.total = total
      table.loading = false
    })
    .catch(() => {
      table.loading = false
    })
}

const delShop = (id: ID) => {
  shopApi
    .delShop(id)
    .then(() => {
      message.success('删除店铺成功')
      getShopPage()
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getShopPage()
}

const reset = () => {
  table.query = {
    name: '',
    pageNum: 1,
    pageSize: 10,
  }
  getShopPage()
}

const init = () => {
  getShopPage()
}

init()
</script>
