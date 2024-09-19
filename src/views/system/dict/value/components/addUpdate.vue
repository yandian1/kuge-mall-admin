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
          label="字典值"
          name="value"
          :rules="[{ required: true, message: '请输入字典值' }]"
        >
          <a-input v-model:value="formState.value" placeholder="请输入字典值" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from "vue-router"
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
const route = useRoute()
const pid = parseFloat(route.query.pid as string)
const emits = defineEmits(['success'])
const visible = defineModel<boolean>('visible')
const title = computed(() => (props.id ? '编辑字典值' : '添加字典值'))
const api = computed(() => (props.id ? dictApi.updateDictValue : dictApi.addDictValue))
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const formState = ref({
  pid,
  value: ''
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    if (props.id) {
      getDictValue()
    } else {
      formState.value.value = ''
    }
  } else {
    formRef.value?.resetFields()
  }
})

const getDictValue = () => {
  spinning.value = true
  dictApi
    .getDictValue(props.id)
    .then((res) => {
      const { data } = res.data
      formState.value.value = data.value
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
          message.success(props.id ? '编辑字典值成功' : '添加字典值成功')
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
