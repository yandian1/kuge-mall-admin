<template>
  <a-upload
    v-model:file-list="fileList"
    :headers="headers"
    list-type="picture-card"
    :action="action"
    :before-upload="beforeUpload"
    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg+xml,image/svg"
    class="avatar-uploader"
    :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true}"
    @change="handleChange"
    @preview="openPreview"
  >
    <div v-if="fileList.length < maxCount">
      <plus-outlined/>
      <div style="margin-top: 8px">上传</div>
    </div>
  </a-upload>

  <a-modal
    v-model:open="preview.visible"
    :title="preview.title"
    :footer="null"
    @cancel="closePreview"
  >
    <img alt="example" style="width: 100%" :src="preview.image"/>
  </a-modal>
</template>

<script setup lang="ts" name="UploadImg">
import { watch, computed, ref } from 'vue'
import { Upload, message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'

const action = import.meta.env.VITE_BASE_URL + '/thirdpart/upload/img'
const props = withDefaults(
  defineProps<{
    max?: number
    multiple?: boolean
  }>(),
  {
    multiple: false,
    max: 5,
  }
)
const maxCount = computed(() => {
  if (props.multiple) {
    return props.max
  } else {
    return 1
  }
})
const userStore = useUserStore()
const headers = computed(() => ({
  Authorization: 'Bearer ' + userStore.token,
}))
const fileList = ref<Recordable[]>([])
const modelValue = defineModel<string | string[]>()
const preview = ref({
  visible: false,
  image: '',
  title: '',
})

watch(
  modelValue,
  () => {
    const list = []
    const value = modelValue.value

    if (props.multiple) {
      list.push(...((value || []) as string[]))
    } else if (value) {
      list.push(value)
    }

    fileList.value = list.map((path) => ({
      uid: path,
      name: path,
      status: 'done',
      url: path,
    }))
  },
  {
    immediate: true,
  }
)

const handleChange = (info: Recordable) => {
  if (info.file.status === 'error') {
    message.error(info.file.error.message)
    const idx = fileList.value.findIndex(fileItem => fileItem.uid === info.file.uid)
    if (idx !== -1) {
      fileList.value.splice(idx, 1)
    }
    return
  }

  if (info.file.status === 'done') {
    if (info.file.response.code !== 0) {
      message.error(info.file.response.message)
      return
    }
    doneHandle(info)
    return
  }

  if (info.file.status === 'removed') {
    removeHandle(info)
    return
  }
};

const doneHandle = (info: Recordable) => {
  if (props.multiple) {
    modelValue.value = info.fileList
      .filter((file: Recordable) => file.status === 'done')
      .map((file: Recordable) => file.url || info.file.response.data.url)
  } else {
    modelValue.value = info.file.response.data.url
  }
}

const removeHandle = (info: Recordable) => {
  if (props.multiple) {
    modelValue.value = info.fileList
      .filter((file: Recordable) => file.status === 'done')
      .map((file: Recordable) => file.url || info.file.response.data.url)
  } else {
    modelValue.value = ''
  }
}

const beforeUpload = (file: Recordable) => {
  const isIMG = file.type.includes('image')

  if (!isIMG) {
    message.error('请上传jpg、png、gif格式的图片')
  }

  return isIMG || Upload.LIST_IGNORE
}

const closePreview = () => {
  preview.value = {
    visible: false,
    image: '',
    title: '',
  }
}

const openPreview = (file: Recordable) => {
  const { url } = file
  preview.value = {
    visible: true,
    image: url,
    title: url.substring(url.lastIndexOf('/') + 1),
  }
}
</script>

<style lang="less" scoped>

</style>
