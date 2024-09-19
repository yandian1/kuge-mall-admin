<template>
  <a-card>
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="{
      style: { width: '100px' },
    }"
      label-align="left"
      autocomplete="off"
    >
      <a-form-item
        label="商品名称"
        name="name"
        :rules="[{ required: true, message: '请输入商品名称' }]"
      >
        <a-input v-model:value="formState.name" placeholder="请输入商品名称" style="width: 900px" allow-clear />
      </a-form-item>
      <a-form-item
        label="商品价格"
        name="price"
        :rules="[{ required: true, message: '请输入商品价格' }]"
      >
        <a-input-number v-model:value="formState.price" placeholder="请输入商品价格" style="width: 900px" :precision="2" :min="0">
          <template #addonAfter> 元 </template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        label="商品划线价"
        name="linePrice"
        :rules="[{ required: true, message: '商品划线价' }]"
      >
        <a-input-number v-model:value="formState.linePrice" placeholder="商品划线价" style="width: 900px" :precision="2" :min="0">
          <template #addonAfter> 元 </template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        label="商品分类"
        name="categoryIds"
        :rules="[{ required: true, message: '请选择商品分类' }]"
      >
        <a-cascader
          v-model:value="formState.categoryIds"
          :options="categoryOptions"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择商品分类"
          style="width: 900px"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="品牌"
        name="brandId"
        :rules="[{ required: true, message: '请选择品牌' }]"
      >
        <a-select
          v-model:value="formState.brandId"
          :options="brandOptions"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择品牌"
          style="width: 900px"
          allow-clear
        ></a-select>
      </a-form-item>
      <a-form-item
        label="店铺"
        name="shopId"
        :rules="[{ required: true, message: '请选择店铺' }]"
      >
        <a-select
          v-model:value="formState.shopId"
          :options="shopOptions"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择店铺"
          style="width: 900px"
          allow-clear
        ></a-select>
      </a-form-item>
      <a-form-item
        label="商品首图"
        name="firstImg"
        :rules="[{ required: true, message: '请上传商品首图' }]"
      >
        <upload-img v-model="formState.firstImg" />
      </a-form-item>
      <a-form-item
        label="商品轮播图"
        name="imgList"
        :rules="[{ required: true, message: '请上传商品轮播图' }]"
      >
        <upload-img v-model="formState.imgList" multiple />
      </a-form-item>
      <a-form-item
        label="商品简介"
        name="intro"
        :rules="[{ required: true, message: '请输入商品简介' }]"
      >
        <a-textarea v-model:value="formState.intro" placeholder="请输入商品简介" style="width: 900px" allow-clear />
      </a-form-item>
    </a-form>
  </a-card>
  <a-space style="margin-top: 16px">
    <a-button type="primary" @click="submit">下一步</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { FormInstance } from 'ant-design-vue'
import * as brandApi from '@/api/admin/brand'
import * as shopApi from '@/api/admin/shop'
import * as cateApi from '@/api/admin/category'
import * as CateTypes from '@/api/admin/category/types'
import * as BrandTypes from '@/api/admin/brand/types'
import * as ShopTypes from '@/api/admin/shop/types'
import { nextStepKey, BaseInfoProps } from '../const'

const formRef = ref<FormInstance>()
const brandOptions = ref<BrandTypes.Brand[]>([])
const categoryOptions = ref<CateTypes.CategoryTreeItem[]>([])
const shopOptions = ref<ShopTypes.Shop[]>([])

const formState = defineModel<BaseInfoProps>({
  default: {
    shopId: undefined,
    brandId: undefined,
    categoryIds: undefined,
    name: '',
    price: undefined,
    linePrice: undefined,
    firstImg: '',
    imgList: [],
    intro: '',
  },
})
const nextStep = inject(nextStepKey)!

const getBrandList = () => {
  brandApi
    .getBrandList({})
    .then((res) => {
      brandOptions.value = res.data.data
    })
    .catch(() => {})
}

const getShopList = () => {
  shopApi
    .getShopList()
    .then((res) => {
      shopOptions.value = res.data.data
    })
    .catch(() => {})
}

const getCategoryTree = () => {
  cateApi
    .getCategoryTree()
    .then((res) => {
      categoryOptions.value = res.data.data
    })
    .catch(() => {})
}

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(() => {
      nextStep()
    })
    .catch(() => {})
}

const init = () => {
  getShopList()
  getBrandList()
  getCategoryTree()
}

init()
</script>