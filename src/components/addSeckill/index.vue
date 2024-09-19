<template>
  <a-modal v-model:open="visible" title="添加商品" width="1200px" @ok="submit">
    <a-form layout="inline" :model="table.query" style="margin: 24px 0">
      <a-form-item label="秒杀活动名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入秒杀活动名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="reset">重置</a-button>
      </a-form-item>
    </a-form>

    <a-table
      :dataSource="table.list"
      :columns="columns"
      :loading="table.loading"
      :row-selection="rowSelection"
      row-key="id"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'banner'">
          <a-image :width="66" :src="record.banner" />
        </template>
      </template>
    </a-table>

    <app-pagination
      v-model:page-num="table.query.pageNum"
      v-model:page-size="table.query.pageSize"
      :total="table.total"
      @change="getSeckillPage"
    />
  </a-modal>
</template>

<script setup lang="ts" name="AddSeckill">
import { ref, reactive, watch } from 'vue'
import * as seckillApi from "@/api/admin/seckill"
import * as SeckillTypes from "@/api/admin/seckill/types"

const props = withDefaults(
  defineProps<{
    seckillList?: SeckillTypes.SeckillPageItem[]
  }>(),
  {
    seckillList: () => [],
  }
)

const emits = defineEmits(['add'])
const visible = defineModel<boolean>('visible')
const columns = [
  {
    title: '秒杀活动名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'banner',
    dataIndex: 'banner',
    key: 'banner',
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
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as SeckillTypes.SeckillPageItem[],
  total: 0,
  loading: false,
})

const rowSelection = ref({
  preserveSelectedRowKeys: true,
  selectedRowKeys: [] as ID[],
  selectedRows: [] as SeckillTypes.SeckillPageItem[],
  onChange: (selectedRowKeys: ID[], selectedRows: SeckillTypes.SeckillPageItem[]) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys
    rowSelection.value.selectedRows = selectedRows.map((row, idx) => {
      if (row) {
        return {
          id: row.id,
          name: row.name,
          banner: row.banner,
          createTime: row.createTime,
          updateTime: row.updateTime,
        }
      } else {
        const target = props.seckillList.find(item => item.id === selectedRowKeys[idx])!
        return {
          id: target.id,
          name: target.name,
          banner: target.banner,
          createTime: target.createTime,
          updateTime: target.updateTime,
        }
      }
    })
  },
})

const getSeckillPage = () => {
  table.loading = true
  seckillApi
    .getSeckillPage(table.query)
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
    pageNum: 1,
    pageSize: 10,
  }
  getSeckillPage()
}

const search = () => {
  table.query.pageNum = 1
  getSeckillPage()
}

const submit = () => {
  emits('add', rowSelection.value.selectedRows)
  visible.value = false
}

watch(visible, () => {
  if (visible.value) {
    reset()
  }
})

watch(
  () => props.seckillList,
  () => {
    rowSelection.value.selectedRows = props.seckillList?.map((item) => ({
      id: item.id,
      name: item.name,
      banner: item.banner,
      createTime: item.createTime,
      updateTime: item.updateTime,
    })) || []
    rowSelection.value.selectedRowKeys =
      props.seckillList?.map((item) => item.id) || []
  }
)
</script>

<style lang="less" scoped></style>
