<template>
  <a-form
    ref="attrFormRef"
    :model="attrFormState"
    :label-col="{
      style: { width: '80px' },
    }"
    label-align="left"
    autocomplete="off"
  >
    <a-list
      :data-source="attrFormState.attrs"
      style="background-color: #fff; border-radius: 8px"

    >
      <template #renderItem="{ item: attr, index: idx }">
        <a-list-item style="padding-top: 26px">
          <div style="width: 100%">
            <a-form-item
              label="属性"
              :name="['attrs', idx, 'name']"
              :rules="[{ required: true, validator: () => checkAttr(idx) }]"
            >
              <a-input
                v-model:value="attr.name"
                placeholder="请输入属性"
                style="width: 220px"
                allow-clear
              >
                <template #addonAfter>
                  <DeleteOutlined @click="delSupAttr(idx)"/>
                </template>
              </a-input>
            </a-form-item>


            <a-form-item
              label="属性值"
              :name="['attrs', idx, 'children']"
              :rules="[{ required: true, message: '请添加属性值' }]"
              class="sub-attrs"
            >
              <a-space wrap>
                <a-form-item
                  :name="['attrs', idx, 'children', childIdx, 'name']"
                  :rules="[{ required: true,  validator: () => checkAttrValue(idx, childIdx) }]"
                  v-for="(child, childIdx) in attr.children"
                  :key="childIdx"
                >
                  <a-input
                    v-model:value="child.name"
                    placeholder="请输入属性值"
                    style="width: 220px"
                    allow-clear
                  >
                    <template #addonAfter>
                      <DeleteOutlined @click="delSubAttr(idx, childIdx)"/>
                    </template>
                  </a-input>
                </a-form-item>
                <a-button @click="addSubAttr(idx)" type="dashed">
                  添加值
                </a-button>
              </a-space>
            </a-form-item>

          </div>
        </a-list-item>
      </template>

      <template #footer>
        <a-space direction="vertical" style="width: 100%; padding: 0 8px;">
          <a-button block type="dashed" @click="addSupAttr">添加属性</a-button>
          <a-button block type="dashed" @click="createGoods">生成商品</a-button>
        </a-space>
      </template>
    </a-list>
  </a-form>


  <a-form ref="skuFormRef" :model="skuFormState" autocomplete="off" style="margin-top: 24px">
    <a-table
      :columns="skuColumns"
      :data-source="skuFormState.skus"
      :pagination="false"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'price'">
          <a-form-item
            :name="['skus', index, 'price']"
            :rules="[{ required: true, message: '请输入商品价格' }]"
          >
            <a-input-number v-model:value="record.price" placeholder="请输入商品价格" :precision="2" :min="0">
              <template #addonAfter>元</template>
            </a-input-number>
          </a-form-item>
        </template>
        <template v-if="column.key === 'linePrice'">
          <a-form-item
            :name="['skus', index, 'linePrice']"
            :rules="[{ required: true, message: '请输入商品划线价' }]"
          >
            <a-input-number v-model:value="record.linePrice" placeholder="请输入商品划线价" :precision="2" :min="0">
              <template #addonAfter>元</template>
            </a-input-number>
          </a-form-item>
        </template>
        <template v-if="column.key === 'stock'">
          <a-form-item
            :name="['skus', index, 'stock']"
            :rules="[{ required: true, message: '请输入属性' }]"
          >
            <a-input-number
              v-model:value="record.stock"
              placeholder="请输入商品库存"
              :precision="0"
              :min="0"
            >
              <template #addonAfter>件</template>
            </a-input-number>
          </a-form-item>
        </template>
        <template v-if="column.key === 'weight'">
          <a-form-item
            :name="['skus', index, 'weight']"
            :rules="[{ required: true, message: '请输入商品重量' }]"
          >
            <a-input-number
              v-model:value="record.weight"
              placeholder="请输入商品重量"
              :precision="0"
              :min="0"
            >
              <template #addonAfter>kg</template>
            </a-input-number>
          </a-form-item>
        </template>
      </template>
    </a-table>
  </a-form>

  <a-space style="margin-top: 16px">
    <a-button type="primary" @click="prevStep">上一步</a-button>
    <a-button type="primary" @click="submit">下一步</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import * as SpuTypes from '@/api/admin/spu/types'
import { deepCopy } from "@/utils"
import { AttrInfoProps, baseSkuColumns, Column, nextStepKey, prevStepKey, } from '../const'

const prevStep = inject(prevStepKey)!
const nextStep = inject(nextStepKey)!
const emits = defineEmits(['update:modelValue'])
const attrFormRef = ref<FormInstance>()
const attrFormState = ref({
  attrs: [] as SpuTypes.Attr[],
})
const skuFormRef = ref<FormInstance>()
const skuFormState = ref({
  skus: [] as Recordable[],
})
const skuColumns = ref<Column[]>([])
const props = withDefaults(
  defineProps<{
    modelValue: AttrInfoProps
  }>(),
  {
    modelValue: () => ({
      skus: [],
      attrs: [],
    }),
  }
)

const addSupAttr = () => {
  attrFormState.value.attrs.push({
    name: '',
    children: [],
  })
}

const delSupAttr = (idx: number) => {
  attrFormState.value.attrs.splice(idx, 1)
}

const addSubAttr = (idx: number) => {
  attrFormState.value.attrs[idx].children.push({
    name: '',
    children: []
  })
}

const delSubAttr = (idx: number, childIdx: number) => {
  attrFormState.value.attrs[idx].children.splice(childIdx, 1)
}

const checkAttr = (idx: number) => {
  const attrs = attrFormState.value.attrs
  const attr = attrs[idx]

  if (!attr.name) {
    return Promise.reject('请输入属性')
  }

  for (let i = 0; i < attrs.length; i++) {
    if (i !== idx) {
      const item = attrs[i]
      if (attr.name === item.name) {
        return Promise.reject('属性重复')
      }
    }
  }

  return Promise.resolve()
}

const checkAttrValue = (idx: number, childIdx: number) => {
  const childAttrs = attrFormState.value.attrs[idx].children
  const childAttr = childAttrs[childIdx]

  if (!childAttr.name) {
    return Promise.reject('请输入属性值')
  }

  for (let i = 0; i < childAttrs.length; i++) {
    if (i !== childIdx) {
      const item = childAttrs[i]
      if (childAttr.name === item.name) {
        return Promise.reject('属性值重复')
      }
    }
  }

  return Promise.resolve()
}

const createGoods = () => {
  if (!attrFormState.value.attrs.length) {
    message.error('请添加商品属性')
    return
  }

  attrFormRef.value
    ?.validateFields()
    .then(() => {
      const product = cartesianProduct(attrFormState.value.attrs)
      console.log("product", product)
      skuFormState.value.skus = genSkuList(product)
      skuColumns.value = genSkuColumns()
    })
    .catch((error) => {
      console.log("error", error)
    })
}

const submit = () => {
  if (!attrFormState.value.attrs.length) {
    message.error('请添加商品属性')
    return
  }

  if (!skuFormState.value.skus.length) {
    message.error('请生成商品')
    return
  }

  attrFormRef.value
    ?.validateFields()
    .then(() => {
      skuFormRef.value
        ?.validateFields()
        .then(() => {
          if (!attrSpuMatch()) {
            message.error('属性发生变化，请重新生成商品')
            return
          }
          emits('update:modelValue', {
            attrs: attrFormState.value.attrs,
            skus: stringifySkuAttrs(),
          })
          nextStep()
        })
        .catch(() => {
        })
    })
    .catch(() => {})
}

const genSkuColumns = () => {
  return [
    ...attrFormState.value.attrs.map((attr) => ({
      title: attr.name,
      dataIndex: attr.name,
      key: attr.name,
    })),
    ...baseSkuColumns,
  ] as Column[]
}

const cartesianProduct = (listWrapper: SpuTypes.Attr[]) => {
  if (listWrapper.length === 0) return []

  const result: Recordable[] = []
  const { name, children } = listWrapper[0]

  for (const child of children) {
    const record: Recordable = {
      [name]: child.name,
    }
    if (listWrapper.length === 1) {
      result.push(record)
    } else {
      for (const restItem of cartesianProduct(listWrapper.slice(1))) {
        result.push({ ...record, ...restItem })
      }
    }
  }

  return result
}

const genSkuList = (cartesian: Recordable[]) => {
  for (let cartesianItem of cartesian) {
    for (let baseSkuColumn of baseSkuColumns) {
      cartesianItem[baseSkuColumn.dataIndex] = undefined
    }
  }

  if (!skuFormState.value.skus?.length) {
    return cartesian
  }

  if ((Object.keys(skuFormState.value.skus[0]).length - baseSkuColumns.length) !== attrFormState.value.attrs?.length) {
    return cartesian
  }

  for (let cartesianItem of cartesian) {
    const sku = skuFormState.value.skus.find(sku => {
      return attrFormState.value.attrs.every(attr => {
        const attrName = attr.name
        return sku.hasOwnProperty(attrName) && cartesianItem.hasOwnProperty(attrName) && (sku[attrName] === cartesianItem[attrName])
      })
    })

    if (sku) {
      for (let baseSkuColumn of baseSkuColumns) {
        cartesianItem[baseSkuColumn.dataIndex] = sku[baseSkuColumn.dataIndex]
      }
    }
  }

  return cartesian
}

const stringifySkuAttrs = () => {
  return skuFormState.value.skus.map((sku) => {
    let skuCopy: Recordable = deepCopy(sku)
    let attrMap: Recordable = {}

    attrFormState.value.attrs.forEach((attr) => {
      if (skuCopy.hasOwnProperty(attr.name)) {
        attrMap[attr.name] = skuCopy[attr.name]
        Reflect.deleteProperty(skuCopy, attr.name)
      }
    })

    return { ...skuCopy, attrs: JSON.stringify(attrMap) }
  })
}

const attrSpuMatch = () => {
  for (let attr of attrFormState.value.attrs) {
    if (skuFormState.value.skus.some(sku => !sku.hasOwnProperty(attr.name))) return false

    for (let child of attr.children) {
      if (skuFormState.value.skus.every(sku => sku[attr.name] !== child.name)) return false
    }
  }

  return true
}

watch(
  () => props.modelValue,
  () => {
    skuFormState.value.skus =
      props.modelValue.skus?.map((sku) => {
        const { attrs, ...rest } = sku
        return { ...rest, ...JSON.parse(attrs) }
      }) || []
    attrFormState.value.attrs = props.modelValue.attrs || []
    skuColumns.value = genSkuColumns()
  },
  {
    immediate: true,
  }
)
</script>

<style lang="less" scoped>
:deep(.ant-table) {
  .ant-form-item {
    margin-bottom: 0;
  }
}

:deep(.ant-list-empty-text) {
  display: none;
}

.sub-attrs {
  :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}
</style>