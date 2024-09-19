<template>
  <a-card>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{
      style: { width: '100px' },
    }"
      label-align="left"
      autocomplete="off"
    >
      <a-form-item
        label="运费模板"
        name="freightId"
        :rules="[{ required: true, message: '请选择运费模板' }]"
      >
        <a-select
          v-model:value="formState.freightId"
          style="width: 900px"
          :options="freightOptions"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择运费模板"
          allow-clear
        ></a-select>
      </a-form-item>

      <a-form-item
        label="服务"
        name="serviceIds"
        :rules="[{ required: true, message: '请选择服务' }]"
      >
        <a-select
          v-model:value="formState.serviceIds"
          style="width: 900px"
          :options="serviceOptions"
          :field-names="{ label: 'value', value: 'id' }"
          placeholder="请选择服务"
          mode="multiple"
          allow-clear
        ></a-select>
      </a-form-item>
    </a-form>
  </a-card>
  <a-space style="margin-top: 16px">
    <a-button type="primary" @click="prevStep">上一步</a-button>
    <a-button type="primary" :loading="submitLoading" @click="clickSubmit">提交</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import * as dictApi from "@/api/admin/dict"
import * as DictTypes from '@/api/admin/dict/types'
import * as freightApi from '@/api/admin/freight'
import * as FreightTypes from '@/api/admin/freight/types'
import { FormInstance } from 'ant-design-vue'
import { prevStepKey, ServiceInfoProps, submitKey } from '../const'

const emits = defineEmits(['submit'])
const formRef = ref<FormInstance>()
const serviceOptions = ref<DictTypes.DictValueListItem[]>([])
const freightOptions = ref<FreightTypes.FreightListItem[]>([])
const formState = defineModel<ServiceInfoProps>({
  default: {
    serviceIds: [],
    freightId: undefined
  },
})
const submitLoading = ref(false)
const submit = inject(submitKey)!
const prevStep = inject(prevStepKey)!

const getFreightList = () => {
  freightApi
    .getFreightList()
    .then((res) => {
      freightOptions.value = res.data.data
    })
    .catch(() => {
    })
}

const getDictValueList = () => {
  dictApi
    .getDictValueList('goodsService')
    .then((res) => {
      serviceOptions.value = res.data.data
    })
    .catch(() => {})
}

const clickSubmit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      submitLoading.value = true
      submit().then(() => {
        submitLoading.value = false
      })
    })
    .catch(() => {})
}

const init = () => {
  getDictValueList()
  getFreightList()
}

init()
</script>
