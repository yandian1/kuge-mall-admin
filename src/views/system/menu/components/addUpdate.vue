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
          label="菜单名"
          name="name"
          :rules="[{ required: true, message: '请输入菜单名' }]"
        >
          <a-input v-model:value="formState.name" placeholder="请输入菜单名" />
        </a-form-item>
        <a-form-item
          label="菜单路径"
          name="path"
          :rules="[{ required: true, message: '请输入菜单路径' }]"
        >
          <a-input
            v-model:value="formState.path"
            placeholder="请输入菜单路径"
          />
        </a-form-item>
        <a-form-item label="上级菜单" name="pids">
          <a-cascader
            v-model:value="formState.pids"
            :options="menuTree"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请输入上级菜单"
            change-on-select
            show-search
            allow-clear
          />
        </a-form-item>
        <a-form-item
          name="sort"
        >
          <template #label>
            菜单序号
            <a-tooltip>
              <template #title>
                序号值越小，菜单排序越靠前
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </template>
          <a-input-number
            v-model:value="formState.sort"
            placeholder="请输入菜单序号"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import * as menuApi from '@/api/admin/menu'
import * as MenuTypes from "@/api/admin/menu/types"
import { useUserStore } from "@/store/user"

const props = withDefaults(
  defineProps<{
    id: Nullable<ID>
  }>(),
  {
    id: undefined,
  }
)
const userStore = useUserStore()
const emits = defineEmits(['success'])
const visible = defineModel<boolean>('visible')
const title = computed(() => (props.id ? '编辑菜单' : '添加菜单'))
const api = computed(() => (props.id ? menuApi.updateMenu : menuApi.addMenu))
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const menuTree = ref<MenuTypes.MenuTreeItem[]>()
const formState = ref({
  name: '',
  pids: [] as ID[],
  path: '',
  sort: 1,
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    getMenuTree()
    if (props.id) {
      getMenu()
    } else {
      formState.value = {
        name: '',
        pids: [],
        path: '/',
        sort: 1,
      }
    }
  } else {
    formRef.value?.resetFields()
  }
})

const getMenu = () => {
  spinning.value = true
  menuApi
    .getMenu(props.id!)
    .then((res) => {
      const { data } = res.data
      formState.value = {
        name: data.name,
        pids: data.pids,
        path: data.path,
        sort: data.sort,
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

      const { pids, ...others } = params.value
      api
        .value({
          ...others,
          pid: pids?.length ? pids[pids.length-1] : '',
        })
        .then(() => {
          confirmLoading.value = false
          message.success(props.id ? '编辑菜单成功' : '添加菜单成功')
          emits('success')
          visible.value = false
          if (props.id) {
            if (userStore.menuIds.includes(props.id)) {
              userStore.getAdminInfo()
            }
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
