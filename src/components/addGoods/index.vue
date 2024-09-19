<template>
  <a-modal v-model:open="visible" title="添加商品" width="1200px" @ok="submit">
    <a-form layout="inline" :model="table.query" style="margin: 24px 0">
      <a-form-item label="商品名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入商品名称"
          style="width: 250px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="商品分类">
        <a-cascader
          v-model:value="table.query.categoryIds"
          :options="table.categoryOpts"
          :field-names="{ label: 'name', value: 'id' }"
          :show-search="{ filter: cateFilter }"
          placeholder="请选择商品分类"
          style="width: 250px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="品牌">
        <a-select
          v-model:value="table.query.brandId"
          :options="table.brandOpts"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择品牌"
          style="width: 250px"
          allow-clear
        ></a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="reset">重置</a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data-source="table.list"
      :loading="table.loading"
      :row-selection="rowSelection"
      row-key="id"
      :pagination="false"
    >
      <template #headerCell="{ column }">
        <template v-if="column.key === 'status'">
          商品状态
          <a-popover>
            <template #content>不能应用未上架商品</template>
            <QuestionCircleOutlined/>
          </a-popover>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
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
          <span :style="{color: record.status === 1 ? '#52c41a' : '#ff4d4f'}">{{ record.statusDesc }}</span>
        </template>
      </template>
    </a-table>

    <app-pagination
      v-model:page-num="table.query.pageNum"
      v-model:page-size="table.query.pageSize"
      :total="table.total"
      @change="getSpuPage"
    />
  </a-modal>
</template>

<script setup lang="ts" name="AddGoods">
import { ref, reactive, watch } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import * as spuApi from '@/api/admin/spu'
import * as cateApi from '@/api/admin/category'
import * as brandApi from '@/api/admin/brand'
import * as SpuTypes from '@/api/admin/spu/types'
import * as BrandTypes from '@/api/admin/brand/types'
import * as CateTypes from '@/api/admin/category/types'
import { GoodsItem } from '@/api/admin/homepage/types.ts'

const props = withDefaults(
  defineProps<{
    goodsList?: GoodsItem[]
  }>(),
  {
    goodsList: () => [],
  }
)

const emits = defineEmits(['add'])
const visible = defineModel<boolean>('visible')
const columns = [
  {
    title: '商品名称',
    dataIndex: 'name',
    key: 'name',
    width: '400px',
    maxWidth: '400px',
  },
  {
    title: '商品价格',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '商品划线价',
    dataIndex: 'linePrice',
    key: 'linePrice',
  },
  {
    title: '商品首图',
    dataIndex: 'firstImg',
    key: 'firstImg',
  },
  {
    title: '商品状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
]

const table = reactive({
  query: {
    name: '',
    brandId: undefined,
    categoryIds: [],
    pageNum: 1,
    pageSize: 10,
  },
  brandOpts: [] as BrandTypes.Brand[],
  categoryOpts: [] as CateTypes.CategoryTreeItem[],
  list: [] as SpuTypes.SpuPageItem[],
  total: 0,
  loading: false,
})

const rowSelection = ref({
  preserveSelectedRowKeys: true,
  selectedRowKeys: [] as ID[],
  selectedRows: [] as GoodsItem[],
  onChange: (selectedRowKeys: ID[], selectedRows: SpuTypes.SpuPageItem[]) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys
    rowSelection.value.selectedRows = selectedRows.map((row, idx) => {
      if (row) {
        return {
          id: row.id,
          firstImg: row.firstImg,
          name: row.name,
          price: row.price,
          linePrice: row.linePrice,
          status: row.status,
          statusDesc: row.statusDesc,
          createTime: row.createTime,
          updateTime: row.updateTime,
        }
      } else {
        const target = props.goodsList.find(goods => goods.id === selectedRowKeys[idx])!
        return {
          id: target.id,
          firstImg: target.firstImg,
          name: target.name,
          price: target.price,
          linePrice: target.linePrice,
          status: target.status,
          statusDesc: target.statusDesc,
          createTime: target.createTime,
          updateTime: target.updateTime,
        }
      }
    })
    console.log(selectedRows)
    console.log(selectedRowKeys)
    console.log(rowSelection.value.selectedRows)
  },
  getCheckboxProps: (record: Recordable) => ({
    disabled: record.status !== 1,
  }),
})

const getCategoryTree = () => {
  cateApi
    .getCategoryTree()
    .then((res) => {
      table.categoryOpts = res.data.data
    })
    .catch(() => {
    })
}

const getBrandList = () => {
  brandApi
    .getBrandList({})
    .then((res) => {
      table.brandOpts = res.data.data
    })
    .catch(() => {
      table.loading = false
    })
}

const getSpuPage = () => {
  table.loading = true
  const { categoryIds, ...rest } = table.query
  const params = {
    categoryId: categoryIds?.length ? categoryIds[categoryIds.length - 1] : '',
    ...rest,
  }
  spuApi
    .getSpuPage(params)
    .then((res) => {
      const { list, total } = res.data.data
      table.list = list
      table.total = total
      table.loading = false
    })
    .catch(() => {
      table.loading = false
    })
}

const reset = () => {
  table.query = {
    name: '',
    brandId: undefined,
    categoryIds: [],
    pageNum: 1,
    pageSize: 10,
  }
  getSpuPage()
}

const search = () => {
  table.query.pageNum = 1
  getSpuPage()
}

const submit = () => {
  console.log(rowSelection.value.selectedRows)
  emits('add', rowSelection.value.selectedRows)
  visible.value = false
}

const cateFilter = (input: string, options: Recordable[]) => {
  console.log("input", input)
  console.log("path", options)
  return options.some(option => option.name.toLowerCase().indexOf(input.toLowerCase()) > -1);
};

watch(visible, () => {
  if (visible.value) {
    reset()
    getCategoryTree()
    getBrandList()
  }
})

watch(
  () => props.goodsList,
  () => {
    rowSelection.value.selectedRows = props.goodsList?.map((goods) => ({
      id: goods.id,
      firstImg: goods.firstImg,
      name: goods.name,
      price: goods.price,
      linePrice: goods.linePrice,
      status: goods.status,
      statusDesc: goods.statusDesc,
      createTime: goods.createTime,
      updateTime: goods.updateTime,
    })) || []
    rowSelection.value.selectedRowKeys =
      props.goodsList?.map((goods) => goods.id) || []
  }
)
</script>

<style lang="less" scoped></style>
