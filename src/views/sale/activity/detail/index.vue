<template>
  <a-form
    ref="formRef"
    :model="formState"
    :label-col="{ style: { width: '120px' } }"
    label-align="left"
    autocomplete="off"
  >
    <a-card title="基本信息" :bordered="false">
      <a-form-item
        label="活动名称"
        name="name"
        :rules="[{ required: true, message: '请输入活动名称' }]"
      >
        <a-input v-model:value="formState.name" placeholder="请输入活动名称" style="width: 500px" allow-clear/>
      </a-form-item>
      <a-form-item
        label="banner"
        name="banner"
        :rules="[{ required: true, message: '请上传banner' }]"
      >
        <upload-img v-model="formState.banner" placeholder="请上传banner"/>
      </a-form-item>
    </a-card>

    <a-card title="商品列表" :bordered="false" style="margin-top: 16px">
      <template #extra>
        <a-button
          type="link"
          :disabled="formState.sections.length < 1"
          @click="addGoodsProps = { visible: true, goodsList: [...formState.sections[sectionTabIdx].goodsList] }"
        >
          添加商品
        </a-button>
      </template>

      <a-tabs v-model:activeKey="sectionTabIdx" type="editable-card" @edit="editSectionTabs">
        <a-tab-pane v-for="(tab, tabIdx) in formState.sections" :key="tabIdx">
          <template #tab>
            <a-input
              v-model:value="tab.title"
              placeholder="请输入活动标题"
            />
          </template>

          <a-table
            :columns="goodsColumns"
            :data-source="tab.goodsList"
            :pagination="false"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'status'">
                商品状态
                <a-popover>
                  <template #content>未上架商品不在用户端展示</template>
                  <QuestionCircleOutlined/>
                </a-popover>
              </template>
            </template>

            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'firstImg'">
                <a-image :width="66" :src="record.firstImg"/>
              </template>
              <template v-if="column.key === 'price'">
                ￥{{ record.price }}
              </template>
              <template v-if="column.key === 'status'">
                <span :style="{color: record.status === 1 ? '#52c41a' : '#ff4d4f'}">{{ record.statusDesc }}</span>
              </template>
              <template v-if="column.key === 'action'">
                <a-button
                  type="link"
                  :disabled="index <= 0"
                  @click="moveUp(tabIdx, index)"
                >
                  上移
                </a-button>
                <a-button
                  type="link"
                  :disabled="index >= formState.sections[tabIdx].goodsList.length - 1"
                  @click="moveDown(tabIdx, index)"
                >
                  下移
                </a-button>
                <a-button type="link" danger @click="handleDelGoods(index)">删除</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-form>

  <a-card :bordered="false" style="margin-top: 16px">
    <a-space>
      <a-button type="primary" :loading="submitLoading" @click="submit">提交</a-button>
      <a-button @click="reset">重置</a-button>
    </a-space>
  </a-card>

  <add-goods
    v-model:visible="addGoodsProps.visible"
    :goods-list="addGoodsProps.goodsList"
    @add="handleAddGoods"
  />
</template>

<script setup lang="ts" name="ActivityDetail">
import { ref } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import { useRoute, useRouter } from "vue-router"
import { goodsColumns } from "./const"
import * as activityApi from '@/api/admin/activity'
import * as ActivityTypes from '@/api/admin/activity/types'
import { QuestionCircleOutlined } from "@ant-design/icons-vue";


const route = useRoute()
const router = useRouter()
const id = route.query.id ? parseFloat(route.query.id as string) : undefined
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = ref({
  name: '',
  banner: '',
  sections: [] as ActivityTypes.Section[],
})
const sectionTabIdx = ref(-1)
const addGoodsProps = ref({
  visible: false,
  goodsList: [] as ActivityTypes.GoodsItem[],
})


const addActivity = () => {
  submitLoading.value = true
  const { sections, ...others } = formState.value
  activityApi
    .addActivity({
      ...others,
      sections: sections.map(section => {
        return {
          title: section.title,
          spuIds: section.goodsList.map(goods => goods.id)
        }
      })
    })
    .then(() => {
      submitLoading.value = false
      router.back()
    })
    .catch(() => {
      submitLoading.value = false
    })
}

const updateActivity = () => {
  submitLoading.value = true
  const { sections, ...others } = formState.value
  activityApi
    .updateActivity({
      id, ...others,
      sections: sections.map(section => {
        return {
          title: section.title,
          spuIds: section.goodsList.map(goods => goods.id)
        }
      })
    })
    .then(() => {
      submitLoading.value = false
      router.back()
    })
    .catch(() => {
      submitLoading.value = false
    })
}


const getActivity = () => {
  id && activityApi
    .getActivity(id)
    .then((res) => {
      const data = res.data.data
      formState.value = {
        name: data.name,
        banner: data.banner,
        sections: data.sections
      }
      if (data.sections?.length) {
        sectionTabIdx.value = 0
      }
    })
    .catch(() => {
    })
}

const editSectionTabs = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    formState.value.sections.push({
      title: '',
      goodsList: [],
    })
    sectionTabIdx.value++
  } else if (action === 'remove') {
    formState.value.sections.splice(parseFloat(targetKey as string), 1)
  }
}

const handleAddGoods = (goodsList: ActivityTypes.GoodsItem[]) => {
  const tab = formState.value.sections[sectionTabIdx.value]
  tab.goodsList = goodsList
}

const handleDelGoods = (idx: number) => {
  const tab = formState.value.sections[sectionTabIdx.value]
  tab.goodsList.splice(idx, 1)
}

const moveDown = (pIdx: number, cIdx: number) => {
  if (cIdx >= formState.value.sections[pIdx].goodsList.length - 1) return
  [formState.value.sections[pIdx].goodsList[cIdx + 1], formState.value.sections[pIdx].goodsList[cIdx]] = [formState.value.sections[pIdx].goodsList[cIdx], formState.value.sections[pIdx].goodsList[cIdx + 1]]
}

const moveUp = (pIdx: number, cIdx: number) => {
  if (cIdx <= 0) return
  [formState.value.sections[pIdx].goodsList[cIdx], formState.value.sections[pIdx].goodsList[cIdx - 1]] = [formState.value.sections[pIdx].goodsList[cIdx - 1], formState.value.sections[pIdx].goodsList[cIdx]]
}

const verify = () => {
  const sections = formState.value.sections
  if (sections.length) {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (!section.title) {
        sectionTabIdx.value = i
        message.error("请输入活动分区标题")
        return false
      }
      if (!section.goodsList?.length) {
        sectionTabIdx.value = i
        message.error("请添加活动分区中的商品")
        return false
      }
    }
  }
  return true
}

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      if (!verify()) return
      if (id) {
        updateActivity()
      } else {
        addActivity()
      }
    })
    .catch(() => {
    })
}

const reset = () => {
  formState.value = {
    name: '',
    banner: '',
    sections: [],
  }
}

const init = () => {
  if (id) {
    getActivity()
  } else {
    formState.value.sections.push({
      title: '',
      goodsList: [],
    })
    sectionTabIdx.value = 0
  }
}

init()
</script>

<style lang="less" scoped></style>
