<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="手机号">
        <a-input
          v-model:value="table.query.phone"
          placeholder="请输入手机号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="订单号">
        <a-input
          v-model:value="table.query.orderNo"
          placeholder="请输入订单号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="商品名称">
        <a-input
          v-model:value="table.query.goodsName"
          placeholder="请输入商品名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="售后状态">
        <a-select
          v-model:value="table.query.status"
          :options="statusOpts"
          :field-names="{ label: 'msg', value: 'code' }"
          placeholder="请选择售后状态"
          style="width: 200px"
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
    <a-card title="售后列表" :bordered="false">
      <a-table
        :dataSource="table.list"
        :columns="columns"
        :loading="table.loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'skuImg'">
            <a-image :width="66" :src="record.skuImg"/>
          </template>
          <template v-if="column.key === 'skuPrice'">
            ￥{{ record.skuPrice }}
          </template>
          <template v-if="column.key === 'statusDesc'">
            <a-typography-text type="danger">{{ record.statusDesc }}</a-typography-text>
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="
                router.push({
                  name: 'AfterSaleDetail',
                  query: { id: record.id },
                })
              "
            >详情
            </a-button
            >
          </template>
        </template>
      </a-table>

      <app-pagination
        v-model:page-num="table.query.pageNum"
        v-model:page-size="table.query.pageSize"
        :total="table.total"
        @change="getAfterSalePage"
      />
    </a-card>
  </app-body>
</template>

<script setup lang="ts" name="AfterSale">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { columns } from './const'
import * as afterSaleApi from '@/api/admin/afterSale'
import * as AfterSaleTypes from '@/api/admin/afterSale/types'
import { AfterSaleStatus } from '@/constant'

const router = useRouter()
const table = reactive({
  query: {
    phone: '',
    orderNo: '',
    goodsName: '',
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as AfterSaleTypes.AfterSale[],
  total: 0,
  loading: false,
})

const statusOpts = Object.keys(AfterSaleStatus).map((key) => {
  return AfterSaleStatus[key as keyof typeof AfterSaleStatus]
})

const getAfterSalePage = () => {
  table.loading = true
  afterSaleApi
    .getAfterSalePage(table.query)
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

const search = () => {
  table.query.pageNum = 1
  getAfterSalePage()
}

const reset = () => {
  table.query = {
    phone: '',
    orderNo: '',
    goodsName: '',
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  }
  getAfterSalePage()
}

const init = () => {
  getAfterSalePage()
}

init()
</script>
