<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="优惠券名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入优惠券名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="优惠券类型">
        <a-select
          v-model:value="table.query.type"
          style="width: 200px"
          :options="typeOpts"
          placeholder="请选择优惠券类型"
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
    <a-card title="优惠券列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="router.push({name: 'CouponCreate'})"
        >
          添加优惠券
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
              @click="router.push({name: 'CouponEdit', query: { id: record.id }})"
            >
              编辑
            </a-button>
            <a-popconfirm
              title="确认删除该优惠券？"
              @confirm="delCoupon(record.id)"
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
        @change="getCouponPage"
      />
    </a-card>
  </app-body>
</template>

<script setup lang="ts" name="Coupon">
import { reactive } from 'vue'
import { useRouter } from "vue-router"
import { message } from 'ant-design-vue'
import * as couponApi from '@/api/admin/coupon'
import * as CouponTypes from '@/api/admin/coupon/types'
import { columns } from './const'

const router = useRouter()
const table = reactive({
  query: {
    name: '',
    type: undefined,
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as CouponTypes.CouponPageItem[],
  total: 0,
  loading: false,
})

const typeOpts = [
  {
    label: '',
    value: '全部',
  },
  {
    label: '抵扣',
    value: 'deduct',
  },
  {
    label: '折扣',
    value: 'discount',
  },
]

const getCouponPage = () => {
  table.loading = true
  couponApi
    .getCouponPage(table.query)
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

const delCoupon = (id: number) => {
  couponApi
    .delCoupon(id)
    .then(() => {
      message.success('删除优惠券成功')
      getCouponPage()
    })
    .catch(() => {
    })
}

const search = () => {
  table.query.pageNum = 1
  getCouponPage()
}

const reset = () => {
  table.query = {
    name: '',
    type: undefined,
    pageNum: 1,
    pageSize: 10,
  }
  getCouponPage()
}

const init = () => {
  getCouponPage()
}

init()
</script>
