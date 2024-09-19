<template>
  <a-modal v-model:open="visible" title="发货" :confirmLoading="confirmLoading" @ok="submit">
    <a-spin :spinning="spinning">
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 4 }"
        label-align="left"
        autocomplete="off"
        style="margin-top: 24px"
      >
        <a-form-item
          label="物流公司"
          name="deliveryCompany"
          :rules="[{ required: true, message: '请输入物流公司' }]"
        >
          <a-select
            v-model:value="formState.deliveryCompany"
            style="width: 100%"
            :options="companyOpts"
            placeholder="请输入物流公司"
            allow-clear
          ></a-select>
        </a-form-item>
        <a-form-item
          label="物流单号"
          name="deliverySn"
          :rules="[{ required: true, message: '请输入物流单号' }]"
        >
          <a-input
            v-model:value="formState.deliverySn"
            placeholder="请输入物流单号"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import * as orderApi from '@/api/admin/order'
import { FormInstance, message } from 'ant-design-vue'

const props = withDefaults(
  defineProps<{
    id: string
  }>(),
  {
    id: '',
  }
)
const emits = defineEmits(['success'])
const visible = defineModel<boolean>('visible')
const formState = ref({
  id: '',
  deliveryCompany: undefined,
  deliverySn: '',
})
const companyOpts = [
  {
    label: '顺丰快递',
    value: '顺丰快递',
  },
]
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    formState.value = {
      id: props.id,
      deliveryCompany: undefined,
      deliverySn: '',
    }
  } else {
    formRef.value?.resetFields()
  }
})

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      if (confirmLoading.value) return

      confirmLoading.value = true
      orderApi
        .sendGoods(formState.value)
        .then(() => {
          confirmLoading.value = false
          message.success('发货成功')
          emits('success')
          visible.value = false
        })
        .catch(() => {
          confirmLoading.value = false
        })
    })
    .catch(() => {})
}
</script>

<style lang="less" scoped></style>
