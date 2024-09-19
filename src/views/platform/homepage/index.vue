<template>
  <a-spin :spinning="pageLoading" tip="加载中...">
    <a-form
      ref="formRef"
      :model="formState"
      autocomplete="off"
      hide-required-mark
    >

      <a-card title="轮播图" :bordered="false">
        <template #extra>
          <a-button type="link" @click="addSwipe">添加</a-button>
        </template>

        <div class="grid-table">
          <a-table
            :columns="swipeColumns"
            :data-source="formState.swipeList"
            :pagination="false"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'img'">
                <a-form-item
                  :name="['swipeList', index, 'img']"
                  :rules="[{ required: true, message: '请上传图片' }]"
                >
                  <upload-img v-model="record.img"/>
                </a-form-item>
              </template>
              <template v-if="column.key === 'target'">
                <a-form-item
                  :name="['swipeList', index, 'target']"
                  :rules="[{ required: true, message: '请输入跳转地址' }]"
                >
                  <a-input v-model:value="record.target" placeholder="请输入跳转地址" allow-clear/>
                </a-form-item>
              </template>
              <template v-if="column.key === 'action'">
                <a-button danger type="link" @click="delSwipe(index)">删除</a-button>
                <a-button
                  type="link"
                  :disabled="index <= 0"
                  @click="moveUp(index, 'swipeList')"
                >
                  上移
                </a-button>
                <a-button
                  type="link"
                  :disabled="index >= formState.swipeList.length - 1"
                  @click="moveDown(index, 'swipeList')"
                >
                  下移
                </a-button>
              </template>
            </template>
            <template v-slot:emptyText></template>
          </a-table>
          <a-button type="dashed" block @click="addSwipe">添加</a-button>
        </div>
      </a-card>

      <a-card title="九宫格" :bordered="false" style="margin-bottom: 24px">
        <template #extra>
          <a-button type="link" @click="addGrid">添加</a-button>
        </template>

        <div class="grid-table">
          <a-table
            :columns="gridColumns"
            :data-source="formState.gridList"
            :pagination="false"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'img'">
                <a-form-item
                  :name="['gridList', index, 'img']"
                  :rules="[{ required: true, message: '请上传图标' }]"
                >
                  <upload-img v-model="record.img"/>
                </a-form-item>
              </template>
              <template v-if="column.key === 'title'">
                <a-form-item
                  :name="['gridList', index, 'title']"
                  :rules="[{ required: true, message: '请输入标题' }]"
                >
                  <a-input v-model:value="record.title" placeholder="请输入标题" allow-clear/>
                </a-form-item>
              </template>
              <template v-if="column.key === 'target'">
                <a-form-item
                  :name="['gridList', index, 'target']"
                  :rules="[{ required: true, message: '请输入跳转地址' }]"
                >
                  <a-input v-model:value="record.target" placeholder="请输入跳转地址" allow-clear/>
                </a-form-item>
              </template>
              <template v-if="column.key === 'action'">
                <a-button danger type="link" @click="delGrid(index)">删除</a-button>
                <a-button
                  type="link"
                  :disabled="index <= 0"
                  @click="moveUp(index, 'gridList')"
                >
                  上移
                </a-button>
                <a-button
                  type="link"
                  :disabled="index >= formState.gridList.length - 1"
                  @click="moveDown(index, 'gridList')"
                >
                  下移
                </a-button>
              </template>
            </template>
            <template v-slot:emptyText></template>
          </a-table>
          <a-button type="dashed" block @click="addGrid">添加</a-button>
        </div>
      </a-card>

      <a-card title="秒杀专区" :bordered="false" style="margin-bottom: 24px">
        <template #extra>
          <a-button
            type="link"
            :disabled="formState.seckillList.length > 0"
            @click="addSeckillProps = { visible: true, seckillList: [...formState.seckillList], type: '' }"
          >
            添加秒杀
          </a-button>
        </template>

        <a-table
          :columns="seckillColumns"
          :data-source="formState.seckillList"
          :pagination="false"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'banner'">
              <a-image :width="66" :src="record.banner"/>
            </template>
            <template v-if="column.key === 'action'">
              <a-button danger type="link" @click="handleDelSeckill(index)">删除</a-button>
            </template>
          </template>
          <template v-slot:emptyText></template>
        </a-table>

        <a-button
          type="dashed"
          :disabled="formState.seckillList.length > 0"
          @click="addSeckillProps = { visible: true, seckillList: [...formState.seckillList], type: '' }"
          block
        >
          添加
        </a-button>
      </a-card>

      <a-card title="商品列表" :bordered="false" style="margin-bottom: 24px">
        <template #extra>
          <a-button
            type="link"
            :disabled="formState.goodsTabs.length < 1"
            @click="addGoodsProps = { visible: true, goodsList: [...(formState.goodsTabs[goodsTabIdx].goodsList || [])], type: 'tab' }"
          >
            添加商品
          </a-button>
        </template>

        <a-tabs v-model:activeKey="goodsTabIdx" type="editable-card" @edit="editGoodsTabs">
          <a-tab-pane v-for="(tab, tabIdx) in formState.goodsTabs" :key="tabIdx">
            <template #tab>
              <div>
                <a-input
                  v-model:value="tab.title"
                  placeholder="请输入标题"
                  style="width: 120px; padding: 0; border: none; background-color: transparent; font-size: 18px"
                />
                <br/>
                <a-input
                  v-model:value="tab.subTitle"
                  placeholder="请输入子标题"
                  style="width: 120px; padding: 0; border: none; margin-top: 5px; background-color: transparent; font-size: 14px"
                />
              </div>
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
                <template v-if="column.key === 'price'">
                  ￥{{ record.price }}
                </template>
                <template v-if="column.key === 'linePrice'">
                  ￥{{ record.linePrice }}
                </template>
                <template v-if="column.key === 'status'">
                  <span :style="{color: record.status === 1 ? '#52c41a' : '#ff4d4f'}">{{record.statusDesc}}</span>
                </template>
                <template v-if="column.key === 'action'"
                >
                  <a-button type="link" danger @click="handleDelGoods(index, 'tab')">删除</a-button>
                  <a-button
                    type="link"
                    :disabled="index <= 0"
                    @click="moveUp(tabIdx, 'goodsTabs', index)"
                  >
                    上移
                  </a-button>
                  <a-button
                    type="link"
                    :disabled="index >= formState.goodsTabs[tabIdx].goodsList.length - 1"
                    @click="moveDown(tabIdx, 'goodsTabs', index)"
                  >
                    下移
                  </a-button>
                  <a-button
                    type="link"
                    :disabled="index === 0"
                    @click="moveTop(tabIdx, 'goodsTabs', index)"
                  >
                    置顶
                  </a-button>
                </template>
              </template>
              <template v-slot:emptyText></template>
            </a-table>
          </a-tab-pane>
        </a-tabs>

        <a-button
          type="dashed"
          block
          @click="addGoodsProps = { visible: true, goodsList: [...(formState.goodsTabs[goodsTabIdx].goodsList || [])], type: 'tab' }"
        >
          添加
        </a-button>
      </a-card>

      <a-affix :offset-bottom="24">
        <a-space>
          <a-button type="primary" :loading="submitLoading" @click="submit">提交</a-button>
          <a-button @click="reset">重置</a-button>
        </a-space>
      </a-affix>

      <add-goods
        v-model:visible="addGoodsProps.visible"
        :goods-list="addGoodsProps.goodsList"
        @add="handleAddGoods"
      />

      <add-seckill
        v-model:visible="addSeckillProps.visible"
        :goods-list="addSeckillProps.seckillList"
        @add="handleAddSeckill"
      />
    </a-form>
  </a-spin>
</template>

<script setup lang="ts" name="Homepage">
import { ref } from 'vue'
import { message, FormInstance } from 'ant-design-vue'
import { QuestionCircleOutlined } from "@ant-design/icons-vue"
import * as hpApi from '@/api/admin/homepage'
import * as HpTypes from '@/api/admin/homepage/types'
import * as SeckillTypes from "@/api/admin/seckill/types"
import { goodsColumns, gridColumns, swipeColumns, seckillColumns } from './const'

type GoodsList = HpTypes.GoodsItem[]

const pageLoading = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = ref<HpTypes.Homepage>({
  id: '',
  swipeList: [],
  gridList: [],
  seckillList: [],
  goodsTabs: [],
})
const goodsTabIdx = ref(-1)
const addGoodsProps = ref({
  visible: false,
  goodsList: [] as GoodsList,
  type: ''
})
const addSeckillProps = ref({
  visible: false,
  seckillList: [] as SeckillTypes.SeckillPageItem[],
  type: ''
})

const moveDown = (pIdx: number, pKey: 'swipeList' | 'gridList' | 'seckillList' | 'goodsTabs', cIdx: number = 0) => {
  if (pKey !== 'goodsTabs') {
    if (pIdx >= formState.value[pKey].length - 1) return
    [formState.value[pKey][pIdx + 1], formState.value[pKey][pIdx]] = [formState.value[pKey][pIdx], formState.value[pKey][pIdx + 1]]
  } else {
    if (cIdx >= formState.value[pKey][pIdx].goodsList.length - 1) return
    [formState.value[pKey][pIdx].goodsList[cIdx + 1], formState.value[pKey][pIdx].goodsList[cIdx]] = [formState.value[pKey][pIdx].goodsList[cIdx], formState.value[pKey][pIdx].goodsList[cIdx + 1]]
  }
}

const moveUp = (pIdx: number, pKey: 'swipeList' | 'gridList' | 'seckillList' | 'goodsTabs', cIdx: number = 0) => {
  if (pKey !== 'goodsTabs') {
    if (pIdx <= 0) return
    [formState.value[pKey][pIdx], formState.value[pKey][pIdx - 1]] = [formState.value[pKey][pIdx - 1], formState.value[pKey][pIdx]]
  } else {
    if (cIdx <= 0) return
    [formState.value[pKey][pIdx].goodsList[cIdx], formState.value[pKey][pIdx].goodsList[cIdx - 1]] = [formState.value[pKey][pIdx].goodsList[cIdx - 1], formState.value[pKey][pIdx].goodsList[cIdx]]
  }
}

const moveTop = (pIdx: number, pKey: 'swipeList' | 'gridList' | 'seckillList' | 'goodsTabs', cIdx: number = 0) => {
  if (pKey !== 'goodsTabs') {
  } else {
    if (cIdx <= 0) return
    const tab = formState.value[pKey][pIdx]
    tab.goodsList.unshift(...tab.goodsList.splice(cIdx, 1))
  }
}

const editGoodsTabs = (targetKey: number | MouseEvent, action: string) => {
  if (action === 'add') {
    formState.value.goodsTabs.push({
      title: '',
      subTitle: '',
      goodsList: [],
    })
    goodsTabIdx.value = formState.value.goodsTabs.length - 1
  } else if (action === 'remove') {
    const idx = targetKey as number
    if (idx === goodsTabIdx.value) {
      goodsTabIdx.value = idx - 1 < 0 ? 0 : idx - 1
    } else if (idx > goodsTabIdx.value) {

    } else if (idx < goodsTabIdx.value) {
      goodsTabIdx.value--
    }
    formState.value.goodsTabs.splice(idx, 1)
  }
}

const handleAddSeckill = (seckillList: SeckillTypes.SeckillPageItem[]) => {
  addSeckillProps.value.seckillList = seckillList
  formState.value.seckillList = seckillList
}

const handleDelSeckill = (idx: number) => {
  formState.value.seckillList.splice(idx, 1)
}

const handleAddGoods = (goodsList: GoodsList) => {
  if (addGoodsProps.value.type === 'tab') {
    const tab = formState.value.goodsTabs[goodsTabIdx.value]
    tab.goodsList = goodsList
  } else if (addGoodsProps.value.type === 'seckill') {
  }
}

const handleDelGoods = (idx: number, type: string) => {
  if (type === 'tab') {
    const tab = formState.value.goodsTabs[goodsTabIdx.value]
    tab.goodsList.splice(idx, 1)
  } else if (type === 'seckill') {
    formState.value.seckillList.splice(idx, 1)
  }
}

const addGrid = () => {
  formState.value.gridList.push({
    img: '',
    target: '',
    title: '',
  })
}

const delSwipe = (idx: number) => {
  formState.value.swipeList.splice(idx, 1)
}

const addSwipe = () => {
  formState.value.swipeList.push({
    img: '',
    target: '',
  })
}

const delGrid = (idx: number) => {
  formState.value.gridList.splice(idx, 1)
}

const addHomepage = () => {
  if (submitLoading.value) return
  submitLoading.value = true
  const { id, ...others } = formState.value
  hpApi
    .addHomepage({
      detail: JSON.stringify({
        ...others,
      })
    })
    .then(() => {
      submitLoading.value = false
      message.success('提交成功')
    })
    .catch(() => {
      submitLoading.value = false
    })
}

const updateHomepage = () => {
  if (submitLoading.value) return
  submitLoading.value = true
  const { id, ...others } = formState.value
  hpApi
    .updateHomepage({
      id,
      detail: JSON.stringify({
        ...others,
      }),
    })
    .then(() => {
      submitLoading.value = false
      message.success('提交成功')
    })
    .catch(() => {
      submitLoading.value = false
    })
}

const getHomepage = () => {
  // pageLoading.value = true
  hpApi
    .getHomepage()
    .then((res) => {
      pageLoading.value = false
      const data = res.data.data
      const detail = JSON.parse(data.detail)
      console.log("detail", detail)
      formState.value = {
        id: data.id,
        swipeList: detail.swipeList || [],
        gridList: detail.gridList || [],
        seckillList: detail.seckillList || [],
        goodsTabs: detail.goodsTabs || [],
      }

      if (!formState.value.goodsTabs.length) {
        formState.value.goodsTabs.push({
          title: '',
          subTitle: '',
          goodsList: [],
        })
      }
      goodsTabIdx.value = 0
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const submit = () => {
  formRef.value
    ?.validateFields()
    .then(
      () => {
        if (!verify()) return
        if (formState.value.id) {
          updateHomepage()
        } else {
          addHomepage()
        }
      },
      () => {
        message.error('请先根据提示填写内容~')
      }
    )
}

const verify = () => {
  const goodsTabs = formState.value.goodsTabs
  if (goodsTabs.length) {
    for (let i = 0; i < goodsTabs.length; i++) {
      const goodsTab = goodsTabs[i]
      if (!goodsTab.title) {
        goodsTabIdx.value = i
        message.error("请输入商品列表标题")
        return false
      }
      if (!goodsTab.subTitle) {
        goodsTabIdx.value = i
        message.error("请输入商品列表子标题")
        return false
      }
      if (!goodsTab.goodsList?.length) {
        goodsTabIdx.value = i
        message.error("请添加商品列表中的商品")
        return false
      }
    }
  }
  return true
}

const reset = () => {
  formState.value = {
    id: '',
    swipeList: [],
    gridList: [],
    seckillList: [],
    goodsTabs: [],
  }
}

const init = () => {
  getHomepage()
}

init()
</script>

<style lang="less" scoped>
:deep(.ant-table) {
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
