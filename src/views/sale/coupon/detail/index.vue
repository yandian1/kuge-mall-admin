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
        label="优惠券名称"
        name="name"
        :rules="[{ required: true, message: '请输入优惠券名称' }]"
      >
        <a-input v-model:value="formState.name" placeholder="请输入优惠券名称" allow-clear/>
      </a-form-item>
      <a-form-item
        label="优惠券类型"
        name="type"
        :rules="[{ required: true, message: '请输入优惠券类型' }]"
      >
        <a-radio-group v-model:value="formState.type" :options="typeOpts"/>
      </a-form-item>
      <a-form-item
        label="折扣"
        name="discount"
        :rules="[{ required: true, message: '请输入折扣' }]"
        v-if="formState.type === 'discount'"
      >
        <a-input-number v-model:value="formState.discount" placeholder="请输入折扣" style="width: 100%" allow-clear/>
      </a-form-item>
      <a-form-item
        label="抵扣"
        name="deduct"
        :rules="[{ required: true, message: '请输入抵扣' }]"
        v-if="formState.type === 'deduct'"
      >
        <a-input-number v-model:value="formState.deduct" placeholder="请输入抵扣" style="width: 100%" allow-clear/>
      </a-form-item>
      <a-form-item
        label="使用门槛金额"
        name="threshold"
        :rules="[{ required: true, message: '请输入使用门槛金额' }]"
      >
        <a-input-number v-model:value="formState.threshold" placeholder="请输入使用门槛金额" style="width: 100%" allow-clear/>
      </a-form-item>
      <a-form-item
        label="生效时间"
        name="time"
        :rules="[{ required: true, message: '请选择生效时间' }]"
      >
        <a-range-picker v-model:value="formState.time" value-format="YYYY-MM-DD HH:mm:ss" show-time />
      </a-form-item>
      <a-form-item
        label="应用用户"
        name="memberRange"
        :rules="[{ required: true, message: '请选择应用用户' }]"
      >
        <a-select
          v-model:value="formState.memberRange"
          :options="memberRangeOpts"
          placeholder="请选择应用用户"
          allow-clear
        ></a-select>
      </a-form-item>
      <a-form-item
        label="应用商品"
        name="goodsRange"
        :rules="[{ required: true, message: '请选择应用商品' }]"
      >
        <a-select
          v-model:value="formState.goodsRange"
          :options="goodsRangeOpts"
          placeholder="请选择应用用户"
          allow-clear
        ></a-select>
      </a-form-item>
    </a-form>
  </a-card>

  <a-card v-if="formState.goodsRange === 'specific'" title="应用商品" :bordered="false" style="margin-top: 16px">
    <template #extra>
      <a-button
        type="link"
        @click="addGoodsProps.visible = true"
      >
        添加商品
      </a-button>
    </template>

    <a-table
      :columns="goodsColumns"
      :data-source="addGoodsProps.goodsList"
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
        <template v-if="column.key === 'action'">
          <a-button type="link" danger @click="handleDelGoods(index)">删除</a-button>
        </template>
      </template>
    </a-table>
  </a-card>

  <a-card v-if="formState.memberRange === 'specific'" title="应用用户" :bordered="false" style="margin-top: 16px">
    <template #extra>
      <a-button
        type="link"
        @click="addMemberProps.visible = true"
      >
        添加用户
      </a-button>
    </template>

    <a-table
      :columns="userColumns"
      :data-source="addMemberProps.memberList"
      :pagination="false"
    >
      <template #bodyCell="{ column, index }">
        <template v-if="column.key === 'action'">
          <a-button type="link" danger @click="handleDelUser(index)">删除</a-button>
        </template>
      </template>
    </a-table>
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

  <add-member
    v-model:visible="addMemberProps.visible"
    :user-list="addMemberProps.memberList"
    @add="handleAddUser"
  />
</template>

<script setup lang="ts" name="CouponDetail">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { FormInstance, message } from 'ant-design-vue'
import * as couponApi from '@/api/admin/coupon'
import { goodsColumns, userColumns } from "./const"
import { peerCopy } from "@/utils"
import { QuestionCircleOutlined } from "@ant-design/icons-vue";

type GoodsItem = {
  id: ID
  firstImg: string
  name: string
  price: number
  createTime: string
  updateTime: string
}

type MemberItem = {
  id: number
  name: string
  account: string
  createTime: string
  updateTime: string
}

const route = useRoute()
const router = useRouter()
const id = route.query.id ? parseFloat(route.query.id as string) : undefined
const submitLoading = ref(false)
const formState = ref({
  name: '',
  type: 'deduct',
  discount: null,
  deduct: null,
  threshold: null,
  time: [] as string[],
  memberRange: undefined,
  goodsRange: undefined,
})
const typeOpts = [
  {
    label: '抵扣',
    value: 'deduct',
  },
  {
    label: '折扣',
    value: 'discount',
  },
]
const memberRangeOpts = [
  {
    label: '指定用户',
    value: 'specific',
  },
  {
    label: '全部用户',
    value: 'all',
  },
]
const goodsRangeOpts = [
  {
    label: '指定商品',
    value: 'specific',
  },
  {
    label: '全部商品',
    value: 'all',
  },
]
const addGoodsProps = reactive({
  visible: false,
  goodsList: [] as GoodsItem[],
})
const addMemberProps = reactive({
  visible: false,
  memberList: [] as MemberItem[],
})
const formRef = ref<FormInstance>()


const addCoupon = () => {
  submitLoading.value = true
  const { time, goodsRange, memberRange, ...otherState } = formState.value
  couponApi
    .addCoupon({
      ...otherState,
      goodsRange,
      memberRange,
      startTime: time?.[0],
      endTime: time?.[1],
      memberIds: memberRange === 'specific' ? addMemberProps.memberList.map(user => user.id) : [],
      spuIds: goodsRange === 'specific' ? addGoodsProps.goodsList.map(goods => goods.id) : [],
    })
    .then(() => {
      submitLoading.value = false
      router.back()
    })
    .catch(() => {
      submitLoading.value = false
    })
}

const updateCoupon = () => {
  submitLoading.value = true
  const { time, goodsRange, memberRange, ...otherState } = formState.value
  couponApi
    .updateCoupon({
      id,
      ...otherState,
      goodsRange,
      memberRange,
      startTime: time?.[0],
      endTime: time?.[1],
      memberIds: memberRange === 'specific' ? addMemberProps.memberList.map(user => user.id) : [],
      spuIds: goodsRange === 'specific' ? addGoodsProps.goodsList.map(goods => goods.id) : [],
    })
    .then(() => {
      submitLoading.value = false
      router.back()
    })
    .catch(() => {
      submitLoading.value = false
    })
}


const getCoupon = () => {
  id && couponApi
    .getCoupon(id)
    .then((res) => {
      const data = res.data.data
      addGoodsProps.goodsList = data.spuList
      addMemberProps.memberList = data.memberList
      peerCopy(data, formState.value)
      console.log("data", data)
      console.log("formState", formState.value)
      if (data.startTime && data.endTime) {
        formState.value.time = [data.startTime, data.endTime]
      }
    })
    .catch(() => {
    })
}


const handleAddGoods = (goodsList: GoodsItem[]) => {
  addGoodsProps.goodsList = goodsList
}

const handleDelGoods = (idx: number) => {
  addGoodsProps.goodsList.splice(idx, 1)
  addGoodsProps.goodsList = addGoodsProps.goodsList.slice()
}

const handleAddUser = (memberList: MemberItem[]) => {
  addMemberProps.memberList = memberList
}

const handleDelUser = (idx: number) => {
  addMemberProps.memberList.splice(idx, 1)
  addMemberProps.memberList = addMemberProps.memberList.slice()
}

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      if (!verifyRange()) return
      if (id) {
        updateCoupon()
      } else {
        addCoupon()
      }
    })
    .catch(() => {
    })
}

const verifyRange = () => {
  const { goodsRange, memberRange } = formState.value
  if (goodsRange === 'specific' && !addGoodsProps.goodsList?.length) {
    message.error('请选择应用商品')
    return false
  }

  if (memberRange === 'specific' && !addMemberProps.memberList?.length) {
    message.error('请选择应用商品')
    return false
  }

  return true
}

const reset = () => {
  formState.value = {
    name: '',
    type: 'deduct',
    discount: null,
    deduct: null,
    threshold: null,
    time: [],
    memberRange: undefined,
    goodsRange: undefined,
  }
  addGoodsProps.goodsList = []
  addMemberProps.memberList = []
}

const init = () => {
  if (id) {
    getCoupon()
  }
}

init()
</script>

<style lang="less" scoped></style>
