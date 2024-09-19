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
          label="分类名"
          name="name"
          :rules="[{ required: true, message: '请输入分类名' }]"
        >
          <a-input
            v-model:value="formState.name"
            placeholder="请输入分类名"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="父分类" name="pids">
          <a-cascader
            v-model:value="formState.pids"
            :options="categoryTree"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择父分类"
            change-on-select
            show-search
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="分类图片"
          name="img"
        >
          <upload-img v-model="formState.img" />
        </a-form-item>
        <a-form-item
          name="sort"
        >
          <template #label>
            分类序号
            <a-tooltip>
              <template #title>
                序号值越小，分类排序越靠前
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </template>
          <a-input-number
            v-model:value="formState.sort"
            placeholder="请输入分类序号"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QuestionCircleOutlined } from "@ant-design/icons-vue"
import * as cateApi from '@/api/admin/category'
import { FormInstance, message } from 'ant-design-vue'

const props = withDefaults(
  defineProps<{
    id: NullableID
  }>(),
  {
    id: undefined,
  }
)
const emits = defineEmits(['success'])
const visible = defineModel<boolean>('visible')
const title = computed(() => (props.id ? '编辑分类' : '添加分类'))
const api = computed(() =>
  props.id ? cateApi.updateCategory : cateApi.addCategory
)
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const formState = ref({
  name: '',
  img: '',
  pids: [] as ID[],
  sort: 1,
})
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()
const categoryTree = ref()
watch(visible, () => {
  if (visible.value) {
    getCategoryTree()
    if (props.id) {
      getCategory()
    } else {
      formState.value = {
        name: '',
        img: '',
        pids: [],
        sort: 1,
      }
    }
  } else {
    formRef.value?.resetFields()
  }
})

const getCategory = () => {
  spinning.value = true
  cateApi
    .getCategory(props.id!)
    .then((res) => {
      spinning.value = false
      const { data } = res.data
      formState.value = {
        name: data.name,
        img: data.img,
        pids: data.pids,
        sort: data.sort,
      }
    })
    .catch(() => {
      spinning.value = false
    })
}

const getCategoryTree = () => {
  cateApi
    .getCategoryTree()
    .then((res) => {
      categoryTree.value = res.data.data
    })
    .catch(() => {})
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
          message.success(props.id ? '编辑分类成功' : '添加分类成功')
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
