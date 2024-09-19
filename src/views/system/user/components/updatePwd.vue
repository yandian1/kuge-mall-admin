<template>
  <a-modal v-model:open="visible" title="修改密码" :confirmLoading="confirmLoading" @ok="submit">
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
          label="旧密码"
          name="oldPwd"
          :rules="[
            { required: true, message: '请输入旧密码' },
            { pattern: pattern.password, message: '密码至少8位且必有数字、字母、特殊字符', trigger: 'blur' },
          ]"
        >
          <a-input-password v-model:value="formState.oldPwd" placeholder="请输入旧密码" />
        </a-form-item>
        <a-form-item
          label="新密码"
          name="newPwd"
          :rules="[
            { required: true, message: '请输入新密码' },
            { pattern: pattern.password, message: '密码至少8位且必有数字、字母、特殊字符', trigger: 'blur' },
            ]"
        >
          <a-input-password v-model:value="formState.newPwd" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item
          label="确认密码"
          name="confirmPwd"
          :rules="[
            { required: true, message: '请输入确认密码' },
            { pattern: pattern.password, message: '密码至少8位且必有数字、字母、特殊字符', trigger: 'blur' },
            ]"
        >
          <a-input-password v-model:value="formState.confirmPwd" placeholder="请输入确认密码" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import * as userApi from '@/api/admin/user'
import pattern from "@/utils/pattern"

const props = withDefaults(
  defineProps<{
    id: Nullable<ID>
  }>(),
  {
    id: undefined,
  }
)
const emits = defineEmits(['success'])
const visible = defineModel<boolean>('visible')
const formState = ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    formState.value = {
      oldPwd: '',
      newPwd: '',
      confirmPwd: '',
    }
  } else {
    formRef.value?.resetFields()
  }
})


const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      if (formState.value.newPwd !== formState.value.confirmPwd) {
        message.error('新密码和确认密码不一致')
        return
      }

      if (confirmLoading.value) return

      confirmLoading.value = true
      userApi
        .updatePwd({ ...formState.value, id: props.id })
        .then(() => {
          confirmLoading.value = false
          message.success('修改密码成功')
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
