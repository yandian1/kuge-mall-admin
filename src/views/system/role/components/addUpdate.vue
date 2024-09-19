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
          label="角色"
          name="name"
          :rules="[{ required: true, message: '请输入角色' }]"
        >
          <a-input v-model:value="formState.name" placeholder="请输入角色" />
        </a-form-item>
        <a-form-item label="菜单" name="menuIds">
          <a-tree-select
            v-model:value="formState.menuIds"
            style="width: 100%"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请输入菜单"
            :tree-data="menuTree"
            tree-node-filter-prop="name"
            :max-tag-count="3"
            tree-default-expand-all
            show-search
            allow-clear
            multiple
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import { useUserStore } from "@/store/user"
import * as menuApi from '@/api/admin/menu'
import * as MenuTypes from "@/api/admin/menu/types"
import * as roleApi from '@/api/admin/role'

const userStore = useUserStore()
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
const title = computed(() => (props.id ? '编辑角色' : '添加角色'))
const api = computed(() => (props.id ? roleApi.updateRole : roleApi.addRole))
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const menuTree = ref<MenuTypes.MenuTreeItem[]>()
const formState = ref({
  name: '',
  menuIds: [] as ID[],
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    getMenuTree()
    if (props.id) {
      getRole()
    } else {
      formState.value = {
        name: '',
        menuIds: [],
      }
    }
  } else {
    formRef.value?.resetFields()
  }
})


const getRole = () => {
  spinning.value = true
  roleApi
    .getRole(props.id)
    .then((res) => {
      const { data } = res.data
      formState.value = {
        name: data.name,
        menuIds: data.menuIds || [],
      }
      spinning.value = false
    })
    .catch(() => {
      spinning.value = false
    })
}

const getMenuTree = () => {
  menuApi
    .getMenuTree()
    .then((res) => {
      menuTree.value = res.data.data
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
      api
        .value(params.value)
        .then(() => {
          confirmLoading.value = false
          message.success(props.id ? '编辑角色成功' : '添加角色成功')
          emits('success')
          visible.value = false
          if (props.id && userStore.roleIds.includes(props.id)) {
            userStore.getAdminInfo()
          }
        })
        .catch(() => {
          confirmLoading.value = false
        })
    })
    .catch(() => {})
}
</script>

<style lang="less" scoped></style>
