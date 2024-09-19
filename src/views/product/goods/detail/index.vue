<template>
  <a-card>
    <a-steps :current="current" :items="steps"></a-steps>
  </a-card>

    <div style="height: 16px"></div>
    <div v-show="current === 0">
      <base-info v-model="baseInfoProps" />
    </div>
    <div v-show="current === 1">
      <attrs-info v-model="attrInfoProps" />
    </div>
    <div v-show="current === 2">
      <detail-info v-model="detailInfoProps" />
    </div>
    <div v-show="current === 3">
      <service-info v-model="serviceProps" @submit="submit" />
    </div>
</template>

<script setup lang="ts" name="GoodsDetail">
import { ref, provide } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import baseInfo from './components/baseInfo.vue'
import detailInfo from './components/detailInfo.vue'
import attrsInfo from './components/attrsInfo.vue'
import serviceInfo from './components/serviceInfo.vue'
import {
  submitKey,
  prevStepKey,
  nextStepKey,
  BaseInfoProps,
  AttrInfoProps,
  DetailInfoProps,
  ServiceInfoProps,
} from './const'
import * as spuApi from '@/api/admin/spu'

const route = useRoute()
const router = useRouter()
const spuId = route.query.id as string
const step = route.query.step ? parseFloat(route.query.step as string) : 1
const isEdit = !!spuId
const steps = [
  {
    title: '基本信息',
  },
  {
    title: '商品属性',
  },
  {
    title: '商品详情',
  },
  {
    title: '服务配置',
  },
]

const baseInfoProps = ref<BaseInfoProps>({
  shopId: undefined,
  brandId: undefined,
  categoryIds: undefined,
  name: '',
  price: undefined,
  linePrice: undefined,
  firstImg: '',
  imgList: [],
  intro: '',
})

const attrInfoProps = ref<AttrInfoProps>({
  skus: [],
  attrs: [],
})

const detailInfoProps = ref<DetailInfoProps>({
  detail: '',
})
const serviceProps = ref<ServiceInfoProps>({
  serviceIds: [],
  freightId: undefined
})

const current = ref(step >= 1 ? step - 1 : 0)
const prevStep = () => {
  if (current.value == 0) return
  current.value--
}
const nextStep = () => {
  if (current.value == 3) return
  current.value++
}

const submit = () => {
  if (isEdit) {
    return updateSpu()
  } else {
    return addSpu()
  }
}

const addSpu = () => {
  const { categoryIds, ...restBaseInfo } = baseInfoProps.value

  const params = {
    categoryId: categoryIds?.length ? categoryIds[categoryIds.length - 1] : '',
    ...restBaseInfo,
    ...attrInfoProps.value,
    ...detailInfoProps.value,
    ...serviceProps.value,
  }
  return spuApi
    .addSpu(params)
    .then(() => {
      router.back()
      message.success('添加商品成功')
    })
    .catch(() => {})
}

const updateSpu = () => {
  const { categoryIds, ...restBaseInfo } = baseInfoProps.value

  const params = {
    id: spuId,
    categoryId: categoryIds?.length ? categoryIds[categoryIds.length - 1] : '',
    ...restBaseInfo,
    ...attrInfoProps.value,
    ...detailInfoProps.value,
    ...serviceProps.value,
  }
  return spuApi
    .updateSpu(params)
    .then(() => {
      router.back()
      message.success('更新商品成功')
    })
    .catch(() => {})
}

const getSpu = () => {
  spuApi
    .getSpu(spuId)
    .then((res) => {
      const data = res.data.data
      baseInfoProps.value = {
        shopId: data.shopId,
        brandId: data.brandId,
        categoryIds: data.categoryIds,
        name: data.name,
        price: data.price,
        linePrice: data.linePrice,
        firstImg: data.firstImg,
        imgList: data.imgList,
        intro: data.intro,
      }
      attrInfoProps.value = {
        skus: data.skus,
        attrs: data.attrs,
      }
      detailInfoProps.value = {
        detail: data.detail,
      }
      serviceProps.value = {
        serviceIds: data.serviceIds || [],
        freightId: data.freightId,
      }
    })
    .catch(() => {})
}

provide(prevStepKey, prevStep)
provide(nextStepKey, nextStep)
provide(submitKey, submit)

const init = () => {
  if (isEdit) {
    getSpu()
  }
}

init()
</script>
