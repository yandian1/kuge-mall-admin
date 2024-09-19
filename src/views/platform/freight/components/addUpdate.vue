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
          label="模板名"
          name="name"
          :rules="[{ required: true, message: '请输入模板名' }]"
        >
          <a-input v-model:value="formState.name" placeholder="请输入模板名" allow-clear/>
        </a-form-item>
        <a-form-item
          label="收费类型"
          name="type"
          :rules="[{ required: true, message: '请输入收费类型' }]"
        >
          <a-radio-group v-model:value="formState.type" :options="typeOpts"/>
        </a-form-item>

        <!-- 按重量 -->
        <template v-if="formState.type === 'weight'">
          <a-space>
            <a-form-item
              name="firstWeight"
              :rules="[{ required: true, message: '请输入首重' }]"
            >
              <a-input v-model:value="formState.firstWeight" placeholder="请输入首重" style="width: 230px" allow-clear>
                <template #prefix>
                  重量在
                </template>
                <template #suffix>
                  kg 内
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              name="firstWeightFee"
              :rules="[{ required: true, message: '请输入首重费用' }]"
            >
              <a-input v-model:value="formState.firstWeightFee" placeholder="请输入首重费用" style="width: 230px" allow-clear>
                <template #prefix>
                  费用
                </template>
                <template #suffix>
                  元
                </template>
              </a-input>
            </a-form-item>

          </a-space>
          <a-space>
            <a-form-item
              name="continueWeight"
              :rules="[{ required: true, message: '请输入续重' }]"
            >
              <a-input v-model:value="formState.continueWeight" placeholder="请输入续重" style="width: 230px" allow-clear>
                <template #prefix>
                  每增加
                </template>
                <template #suffix>
                  kg
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
              name="continueWeightFee"
              :rules="[{ required: true, message: '请输入续重费用' }]"
            >
              <a-input v-model:value="formState.continueWeightFee" placeholder="请输入续重费用" style="width: 230px" allow-clear>
                <template #prefix>
                  运费增加
                </template>
                <template #suffix>
                  元
                </template>
              </a-input>
            </a-form-item>
          </a-space>
        </template>

        <!-- 按件数 -->
        <template v-if="formState.type === 'item'">
          <a-space>
            <a-form-item
              name="firstCount"
              :rules="[{ required: true, message: '请输入首件' }]"
            >
              <a-input v-model:value="formState.firstCount" placeholder="请输入首件" style="width: 230px" allow-clear>
                <template #prefix>
                  数量在
                </template>
                <template #suffix>
                  件内
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              name="firstCountFee"
              :rules="[{ required: true, message: '请输入首件费用' }]"
            >
              <a-input v-model:value="formState.firstCountFee" placeholder="请输入首件费用" style="width: 230px" allow-clear>
                <template #prefix>
                  费用
                </template>
                <template #suffix>
                  元
                </template>
              </a-input>
            </a-form-item>

          </a-space>
          <a-space>
            <a-form-item
              name="continueCount"
              :rules="[{ required: true, message: '请输入续件' }]"
            >
              <a-input v-model:value="formState.continueCount" placeholder="请输入续件" style="width: 230px" allow-clear>
                <template #prefix>
                  每增加
                </template>
                <template #suffix>
                  件
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
              name="continueCountFee"
              :rules="[{ required: true, message: '请输入续件费用' }]"
            >
              <a-input v-model:value="formState.continueCountFee" placeholder="请输入续件费用" style="width: 230px" allow-clear>
                <template #prefix>
                  费用增加
                </template>
                <template #suffix>
                  元
                </template>
              </a-input>
            </a-form-item>
          </a-space>
        </template>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import * as freightApi from '@/api/admin/freight'
import { deepCopy, peerCopy } from "@/utils"

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
const title = computed(() => (props.id ? '编辑模板' : '添加模板'))
const api = computed(() => (props.id ? freightApi.updateFreight : freightApi.addFreight))
const params = computed(() =>
  props.id ? { ...formState.value, id: props.id } : { ...formState.value }
)
const typeOpts = [
  {
    label: '包邮',
    value: 'free',
  },
  {
    label: '按重量收费',
    value: 'weight',
  },
  {
    label: '按件数收费',
    value: 'item',
  },
]
const baseForm = {
  name: '',
  type: 'free',
  firstWeight: null,
  firstWeightFee: null,
  continueWeight: null,
  continueWeightFee: null,
  firstCount: null,
  firstCountFee: null,
  continueCount: null,
  continueCountFee: null,
}
const formState = ref(deepCopy(baseForm))
const spinning = ref(false)
const confirmLoading = ref(false)
const formRef = ref<FormInstance>()

watch(visible, () => {
  if (visible.value) {
    if (props.id) {
      getFreight()
    } else {
      formState.value = deepCopy(baseForm)
    }
  } else {
    formRef.value?.resetFields()
  }
})

const getFreight = () => {
  spinning.value = true
  freightApi
    .getFreight(props.id!)
    .then((res) => {
      peerCopy(res.data.data, formState.value)
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
          message.success(props.id ? '编辑模板成功' : '添加模板成功')
          emits('success')
          visible.value = false
        })
        .catch(() => {
          confirmLoading.value = false
        })
    })
    .catch(() => {
    })
}
</script>

<style lang="less" scoped></style>
