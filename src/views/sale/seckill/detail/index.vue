<template>
  <a-card title="基本信息" :bordered="false">
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{ style: { width: '120px' } }"
      label-align="left"
      autocomplete="off"
    >
      <a-form-item
        label="秒杀活动名称"
        name="name"
        :rules="[{ required: true, message: '请输入秒杀活动名称' }]"
      >
        <a-input v-model:value="formState.name" placeholder="请输入秒杀活动名称" style="width: 500px" allow-clear/>
      </a-form-item>
      <a-form-item
        label="banner"
        name="banner"
        :rules="[{ required: true, message: '请上传banner' }]"
      >
        <upload-img v-model="formState.banner" placeholder="请上传banner"/>
      </a-form-item>
    </a-form>
  </a-card>

  <a-card title="商品列表" :bordered="false" style="margin-top: 16px">
    <template #extra>
      <a-button
        type="link"
        :disabled="formState.timeTabs.length < 1"
        @click="addGoodsProps = { visible: true, goodsList: [...formState.timeTabs[timeTabIdx].goodsList] }"
      >
        添加商品
      </a-button>
    </template>

    <a-tabs v-model:activeKey="timeTabIdx" type="editable-card" @edit="editTimeTabs">
      <a-tab-pane v-for="(tab, index) in formState.timeTabs" :key="index">
        <template #tab>
          <a-range-picker v-model:value="tab.time" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm" show-time/>
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
                <QuestionCircleOutlined />
              </a-popover>
            </template>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'firstImg'">
              <a-image :width="66" :src="record.firstImg"/>
            </template>
            <template v-if="column.key === 'status'">
              <span :style="{color: record.status === 1 ? '#52c41a' : '#ff4d4f'}">{{record.statusDesc}}</span>
            </template>
            <template v-if="column.key === 'action'"
            >
              <a-button type="link" danger @click="handleDelGoods(index)">删除</a-button>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </a-card>

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

<script setup lang="ts" name="SeckillDetail">
import { ref } from 'vue'
import { FormInstance } from 'ant-design-vue'
import { useRoute, useRouter } from "vue-router"
import { goodsColumns } from "./const"
import * as seckillApi from '@/api/admin/seckill'
import { QuestionCircleOutlined } from "@ant-design/icons-vue";


type GoodsItem = {
  id: ID
  firstImg: string
  name: string
  price: number
  createTime: string
  updateTime: string
}

type TimeTab = {
  time: string[]
  goodsList: GoodsItem[]
}

const route = useRoute()
const router = useRouter()
const id = route.query.id ? parseFloat(route.query.id as string) : undefined
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = ref({
  name: '',
  banner: '',
  timeTabs: [] as TimeTab[],
})
const timeTabIdx = ref(-1)
const addGoodsProps = ref({
  visible: false,
  goodsList: [] as GoodsItem[],
})


const addSeckill = () => {
  submitLoading.value = true
  const { timeTabs, ...others } = formState.value
  seckillApi
    .addSeckill({
      ...others,
      timeList: timeTabs.map(timeTab => ({
        startTime: timeTab.time?.[0],
        endTime: timeTab.time?.[1],
        spuIds: timeTab.goodsList.map(goods => goods.id)
      }))
    })
    .then(() => {
      submitLoading.value = false
      router.back()
    })
    .catch(() => {
      submitLoading.value = false
    })
}

const updateSeckill = () => {
  submitLoading.value = true
  const { timeTabs, ...others } = formState.value
  seckillApi
    .updateSeckill({
      id, ...others,
      timeList: timeTabs.map(timeTab => ({
        startTime: timeTab.time?.[0],
        endTime: timeTab.time?.[1],
        spuIds: timeTab.goodsList.map(goods => goods.id)
      }))
    })
    .then(() => {
      submitLoading.value = false
      router.back()
    })
    .catch(() => {
      submitLoading.value = false
    })
}


const getSeckill = () => {
  id && seckillApi
    .getSeckill(id)
    .then((res) => {
      const data = res.data.data
      formState.value = {
        name: data.name,
        banner: data.banner,
        timeTabs: data.timeList?.map(time => ({
          time: [time.startTime, time.endTime],
          goodsList: time.spuList,
        }))
      }
      if (data.timeList?.length) {
        timeTabIdx.value = 0
      }
    })
    .catch(() => {
    })
}

const editTimeTabs = (targetKey: string | MouseEvent, action: string) => {
  if (action === 'add') {
    formState.value.timeTabs.push({
      time: [],
      goodsList: [],
    })
    timeTabIdx.value++
  } else if (action === 'remove') {
    formState.value.timeTabs.splice(parseFloat(targetKey as string), 1)
  }
}

const handleAddGoods = (goodsList: GoodsItem[]) => {
  const tab = formState.value.timeTabs[timeTabIdx.value]
  tab.goodsList = goodsList
}

const handleDelGoods = (idx: number) => {
  const tab = formState.value.timeTabs[timeTabIdx.value]
  tab.goodsList.splice(idx, 1)
}

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      if (id) {
        updateSeckill()
      } else {
        addSeckill()
      }
    })
    .catch(() => {
    })
}

const reset = () => {
  formState.value = {
    name: '',
    banner: '',
    timeTabs: [] as TimeTab[],
  }
}

const init = () => {
  if (id) {
    getSeckill()
  } else {
    formState.value.timeTabs.push({
      time: [],
      goodsList: [],
    })
    timeTabIdx.value = 0
  }
}

init()
</script>

<style lang="less" scoped></style>
