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
      <a-form-item label="订单状态">
        <a-select
          v-model:value="table.query.status"
          :options="statusOpts"
          :field-names="{ label: 'msg', value: 'code' }"
          placeholder="请选择订单状态"
          style="width: 200px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="支付状态">
        <a-select
          v-model:value="table.query.payStatus"
          :options="payStatusOpts"
          :field-names="{ label: 'msg', value: 'code' }"
          placeholder="请选择支付状态"
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
    <a-card title="订单列表" :bordered="false">
      <a-table
        :dataSource="table.list"
        :columns="orderColumns"
        :loading="table.loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="router.push({name: 'OrderDetail', query: { id: record.id }})">详情</a-button>
          </template>
        </template>

        <template #expandedRowRender="{ record }">
          <a-empty v-if="!record.orderItems.length" description="暂无商品" />
          <a-table
            v-else
            :dataSource="record.orderItems"
            :columns="orderItemColumns"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'img'">
                <a-image :width="66" :src="record.img" />
              </template>
              <template v-if="column.key === 'action'">
                <a-button
                  type="link"
                  v-if="record.status === OrderStatus.unSend.code"
                  @click="deliverGoodsProps = { visible: true, id: record.id }"
                >
                  发货
                </a-button>
              </template>
            </template>
          </a-table>
        </template>
      </a-table>

      <app-pagination
        v-model:page-num="table.query.pageNum"
        v-model:page-size="table.query.pageSize"
        :total="table.total"
        @change="getOrderPage"
      />
    </a-card>
  </app-body>

  <deliver-goods
    v-model:visible="deliverGoodsProps.visible"
    :id="deliverGoodsProps.id"
    @success="getOrderPage"
  />
</template>

<script setup lang="ts" name="Order">
import { computed, reactive, ref } from 'vue'
import { useRouter } from "vue-router"
import * as orderApi from '@/api/admin/order'
import * as OrderTypes from '@/api/admin/order/types'
import { orderColumns, orderItemColumns } from './const'
import deliverGoods from './../components/deliverGoods.vue'
import { PayStatus, OrderStatus } from '@/constant'

const router = useRouter()
const table = reactive({
  query: {
    phone: '',
    orderNo: '',
    goodsName: '',
    status: undefined,
    payStatus: undefined,
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as OrderTypes.OrderPageItem[],
  total: 0,
  loading: false,
})

const deliverGoodsProps = ref({
  visible: false,
  id: '',
})

const statusOpts = computed(() => {
  return Object.keys(OrderStatus).map(key => OrderStatus[key as keyof typeof OrderStatus])
})
const payStatusOpts = computed(() => {
  return Object.keys(PayStatus).map(key => PayStatus[key as keyof typeof PayStatus])
})

const getOrderPage = () => {
  table.loading = true
  orderApi
    .getOrderPage(table.query)
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
  getOrderPage()
}

const reset = () => {
  table.query = {
    phone: '',
    orderNo: '',
    goodsName: '',
    status: undefined,
    payStatus: undefined,
    pageNum: 1,
    pageSize: 10,
  }
  getOrderPage()
}

const init = () => {
  getOrderPage()
}

init()
</script>
