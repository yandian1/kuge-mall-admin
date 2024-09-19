<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="模板名">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入模板名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="收费类型">
        <a-select
          v-model:value="table.query.type"
          style="width: 200px"
          :options="typeOpts"
          placeholder="请选择收费类型"
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
  </app-header>

  <app-body>
    <a-card title="模板列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: undefined }"
          >
          添加模板
        </a-button>
      </template>

      <a-table
        :dataSource="table.list"
        :columns="columns"
        :loading="table.loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="addUpdateProps = { visible: true, id: record.id }"
            >
              编辑
            </a-button>
            <a-popconfirm
              title="确认删除该模板？"
              @confirm="delFreight(record.id)"
            >
              <a-button danger type="link">删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <app-pagination
        v-model:page-num="table.query.pageNum"
        v-model:page-size="table.query.pageSize"
        :total="table.total"
        @change="getFreightPage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getFreightPage"
  />
</template>

<script setup lang="ts" name="Freight">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import * as freightApi from '@/api/admin/freight'
import * as FreightTypes from '@/api/admin/freight/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'

const table = reactive({
  query: {
    name: '',
    type: undefined,
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as FreightTypes.FreightPageItem[],
  total: 0,
  loading: false,
})
const typeOpts = [
  {
    label: '全部',
    value: '',
  },
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
const addUpdateProps = ref({
  visible: false,
  id: undefined,
})

const getFreightPage = () => {
  table.loading = true
  freightApi
    .getFreightPage(table.query)
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

const delFreight = (id: number) => {
  freightApi
    .delFreight(id)
    .then(() => {
      message.success('删除模板成功')
      getFreightPage()
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getFreightPage()
}

const reset = () => {
  table.query = {
    name: '',
    type: undefined,
    pageNum: 1,
    pageSize: 10,
  }
  getFreightPage()
}

const init = () => {
  getFreightPage()
}

init()
</script>
