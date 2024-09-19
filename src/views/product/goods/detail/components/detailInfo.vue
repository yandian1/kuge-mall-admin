<template>
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
      name="detail"
      :rules="[{ required: true, message: '请输入商品详情' }]"
    >
      <rich-editor v-model="formState.detail" />
    </a-form-item>
  </a-form>
  <a-space style="margin-top: 16px">
    <a-button type="primary" @click="prevStep">上一步</a-button>
    <a-button type="primary" @click="submit">下一步</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { prevStepKey, nextStepKey, DetailInfoProps } from '../const'
import { FormInstance } from 'ant-design-vue'

const emits = defineEmits(['submit'])
const prevStep = inject(prevStepKey)!
const nextStep = inject(nextStepKey)!
const formRef = ref<FormInstance>()

const formState = defineModel<DetailInfoProps>({
  default: {
    detail: '',
  },
})

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      nextStep()
    })
    .catch(() => {})
}
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>

