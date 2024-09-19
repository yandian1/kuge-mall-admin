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
          label="店铺名"
          name="name"
          :rules="[{ required: true, message: '请输入店铺名' }]"
        >
          <a-input
            v-model:value="formState.name"
            placeholder="请输入店铺名"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import * as shopApi from '@/api/admin/shop'
import { FormInstance, message } from 'ant-design-vue'

const props = withDefaults(
  defineProps<{
    id: NullableID
  }>(),
  {
    id: '',
  }
)
const emits = defineEmits(['success'])
const visible = defineModel<boolean>('visible')
const title = computed(() => (props.id ? '编辑店铺' : '添加店铺'))
const api = computed(() =>
  props.id ? shopApi.updateShop : shopApi.addShop
)
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const formState = ref({
  name: '',
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    if (props.id) {
      getShop()
    } else {
      formState.value = {
        name: '',
      }
    }
  } else {
    formRef.value?.resetFields()
  }
})

const getShop = () => {
  spinning.value = true
  shopApi
    .getShop(props.id!)
    .then((res) => {
      spinning.value = false
      const { data } = res.data
      formState.value = {
        name: data.name,
      }
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
          message.success(props.id ? '编辑店铺成功' : '添加店铺成功')
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
