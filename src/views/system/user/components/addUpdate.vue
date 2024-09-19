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
          label="用户名"
          name="name"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="formState.name" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item
          label="用户账号"
          name="account"
          :rules="[{ required: true, validator: accountValidator, trigger: 'blur' }]"
        >
          <a-input
            v-model:value="formState.account"
            placeholder="请输入用户账号"
          />
        </a-form-item>
        <a-form-item
          label="账号密码"
          name="password"
          :rules="[{ required: true, validator: passwordValidator, trigger: 'blur' }]"
          v-if="!id"
        >
          <a-input-password v-model:value="formState.password" placeholder="请输入账号密码" />
        </a-form-item>
        <a-form-item label="用户角色" name="roleIds">
          <a-select
            v-model:value="formState.roleIds"
            :field-names="{ label: 'name', value: 'id' }"
            :options="roleOpts"
            mode="multiple"
            placeholder="请选择用户角色"
          ></a-select>
        </a-form-item>
        <a-form-item label="用户状态" name="status">
          <a-switch
            v-model:checked="formState.status"
            :checked-value="1"
            :un-checked-value="0"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import * as userApi from '@/api/admin/user'
import * as roleApi from '@/api/admin/role'
import * as RoleTypes from "@/api/admin/role/types"
import pattern from "@/utils/pattern"

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
const title = computed(() => (props.id ? '编辑用户' : '添加用户'))
const api = computed(() => (props.id ? userApi.updateUser : userApi.addUser))
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const roleOpts = ref<RoleTypes.RoleListItem[]>()
const formState = ref({
  name: '',
  account: '',
  password: '',
  status: 1,
  roleIds: [] as ID[],
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    getRoleList()
    if (props.id) {
      getUser()
    } else {
      formState.value = {
        name: '',
        account: '',
        password: '',
        status: 1,
        roleIds: [],
      }
    }
  } else {
    formRef.value?.resetFields()
  }
})

const accountValidator = () => {
  const account = formState.value.account.trim()

  if (!account) {
    return Promise.reject('请输入用户账号')
  }

  // if (!pattern.phone.test(account)) {
  //   return Promise.reject('请输入正确格式用户账号')
  // }

  return Promise.resolve()
}

const passwordValidator = () => {
  const password = formState.value.password.trim()

  if (!password) {
    return Promise.reject('请输入账号密码')
  }

  if (!pattern.password.test(password)) {
    return Promise.reject('密码至少8位且必有数字、字母、特殊字符')
  }

  return Promise.resolve()
}

const getUser = () => {
  spinning.value = true
  userApi
    .getUser(props.id)
    .then((res) => {
      const { data } = res.data
      formState.value = {
        name: data.name,
        account: data.account,
        password: '',
        status: data.status,
        roleIds: data.roleIds,
      }
      spinning.value = false
    })
    .catch(() => {
      spinning.value = false
    })
}

const getRoleList = () => {
  roleApi
    .getRoleList()
    .then((res) => {
      roleOpts.value = res.data.data
    })
    .catch(() => {
    })
}

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      if (confirmLoading.value) return
      confirmLoading.value = true

      const { password, ...others } = params.value
      let p: Recordable = { ...others }
      if (!props.id) {
        p.password = password
      }

      api
        .value(p)
        .then(() => {
          confirmLoading.value = false
          message.success(props.id ? '编辑用户成功' : '添加用户成功')
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
