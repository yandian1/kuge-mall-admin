<template>
  <a-card title="售后详情">
    <a-descriptions :column="1">
      <a-descriptions-item label="商品图片">
        <a-image :width="66" :src="afterSale.skuImg"/>
      </a-descriptions-item>
      <a-descriptions-item label="售后单号">
        {{ afterSale.sn }}
      </a-descriptions-item>
      <a-descriptions-item label="商品名称">
        {{ afterSale.skuName }}
      </a-descriptions-item>
      <a-descriptions-item label="商品数量">
        {{ afterSale.skuNum }}
      </a-descriptions-item>
      <a-descriptions-item label="商品价格">
        ￥{{ afterSale.skuPrice }}
      </a-descriptions-item>
      <a-descriptions-item label="商品属性">
        {{ afterSale.skuAttrs }}
      </a-descriptions-item>
      <a-descriptions-item label="申请金额">
        {{ afterSale.applyAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="实际退款">
        {{ afterSale.actualAmount }}
      </a-descriptions-item>
      <a-descriptions-item label="售后类型">
        {{ afterSale.type }}
      </a-descriptions-item>
      <a-descriptions-item label="售后原因">
        {{ afterSale.reason }}
      </a-descriptions-item>
      <a-descriptions-item label="售后状态">
        <a-typography-text type="danger">{{ afterSale.statusDesc }}</a-typography-text>
      </a-descriptions-item>
    </a-descriptions>

    <a-space v-if="afterSale.status === AfterSaleStatus.pending.code">
      <a-button type="primary" :loading="agreeLoading" @click="modal.show = true">同意</a-button>
      <a-button type="primary" :loading="rejectLoading" @click="reject">拒绝</a-button>
    </a-space>

    <a-modal v-model:open="modal.show" :title="modal.title" :confirmLoading="agreeLoading" @ok="confirm">
      <a-form
        ref="formRef"
        :model="modal.form"
        :label-col="{ span: 4 }"
        label-align="left"
        autocomplete="off"
        style="margin-top: 16px"
      >
        <a-form-item
          label="退款金额"
          name="actualAmount"
          :rules="[{ required: true, validator: actualAmountValidator }]"
        >
          <a-input-number v-model:value="modal.form.actualAmount" :placeholder="'￥' + afterSale.applyAmount" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts" name="AfterSaleDetail">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { FormInstance } from "ant-design-vue"
import { AfterSaleStatus } from "@/constant"
import * as afterSaleApi from '@/api/admin/afterSale'
import * as AfterSaleTypes from '@/api/admin/afterSale/types'

const route = useRoute()
const id = route.query.id as string
const afterSale = ref({} as AfterSaleTypes.AfterSale)
const formRef = ref<FormInstance>()
const rejectLoading = ref(false)
const agreeLoading = ref(false)
const modal = reactive({
  title: '同意',
  show: false,
  form: {
    actualAmount: undefined as undefined | number,
  }
})

const actualAmountValidator = () => {
  const { actualAmount } = modal.form
  if (actualAmount === undefined || actualAmount === null) {
    return Promise.reject('请输入退款金额')
  }
  if (actualAmount > afterSale.value.applyAmount) {
    return Promise.reject('退款金额不能大于申请金额')
  }
  return Promise.resolve()
}

const getAfterSale = () => {
  afterSaleApi
    .getAfterSale(id)
    .then((res) => {
      afterSale.value = res.data.data
    })
    .catch(() => {
    })
}

const reject = () => {
  rejectLoading.value = true
  updateAfterSale(AfterSaleStatus.rejected.code)
    .then(() => {
      rejectLoading.value = false
    })
}

const agree = () => {
  agreeLoading.value = true
  updateAfterSale(AfterSaleStatus.agreed.code)
    .then(() => {
      modal.show = false
      agreeLoading.value = false
    })
}

const updateAfterSale = (status: string) => {
  return afterSaleApi
    .updateAfterSale({
      id: afterSale.value.id, status,
      ...(status === AfterSaleStatus.agreed.code ? {
        actualAmount: modal.form.actualAmount
      } : {})
    })
    .then(() => {
      getAfterSale()
    })
    .catch(() => {
    })
}

const confirm = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      agree()
    })
    .catch(() => {
    })
}

const init = () => {
  getAfterSale()
}

init()
</script>
