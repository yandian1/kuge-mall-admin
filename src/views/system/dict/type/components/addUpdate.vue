<template>
  <a-modal v-model:open="visible" :title="title" :confirmLoading="confirmLoading" @ok="submit">
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
          label="字典类型"
          name="type"
          :rules="[{ required: true, message: '请输入字典类型' }]"
        >
          <a-input v-model:value="formState.type" placeholder="请输入字典类型" />
        </a-form-item>
        <a-form-item
          label="类型code"
          name="code"
          :rules="[{ required: true, message: '请输入类型code' }]"
        >
          <a-input v-model:value="formState.code" placeholder="请输入类型code" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import * as dictApi from '@/api/admin/dict'
import { FormInstance, message } from 'ant-design-vue'

const props = withDefaults(
  defineProps<{
    id: ID
  }>(),
  {
    id: undefined,
  }
)
const emits = defineEmits(['success'])
const visible = defineModel<boolean>('visible')
const title = computed(() => (props.id ? '编辑字典类型' : '添加字典类型'))
const api = computed(() => (props.id ? dictApi.updateDictType : dictApi.addDictType))
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const formState = ref({
  type: '',
  code: '',
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    if (props.id) {
      getDictType()
    } else {
      formState.value = {
        type: '',
        code: '',
      }
    }
  } else {
    formRef.value?.resetFields()
  }
})

const getDictType = () => {
  spinning.value = true
  dictApi
    .getDictType(props.id)
    .then((res) => {
      const { data } = res.data
      formState.value = {
        type: data.type,
        code: data.code,
      }
      spinning.value = false
    })
    .catch(() => {
      spinning.value = false
    })
}

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      if (confirmLoading.value) return

      confirmLoading.value = true
      api
        .value(params.value)
        .then(() => {
          confirmLoading.value = false
          message.success(props.id ? '编辑字典类型成功' : '添加字典类型成功')
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
