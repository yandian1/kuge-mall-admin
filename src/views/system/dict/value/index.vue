<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="字典值">
        <a-input
          v-model:value="table.query.value"
          placeholder="请输入字典值"
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
  </app-header>

  <app-body>
    <a-card title="字典值列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: undefined }"
          >添加字典值</a-button
        >
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
              title="确认删除该字典值？"
              @confirm="delDictValue(record.id)"
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
        @change="getDictValuePage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getDictValuePage"
  />
</template>

<script setup lang="ts" name="DictValue">
import { ref, reactive } from 'vue'
import { useRoute } from "vue-router"
import { message } from 'ant-design-vue'
import * as dictApi from '@/api/admin/dict'
import * as DictTypes from '@/api/admin/dict/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'

const route = useRoute()
const pid = parseFloat(route.query.pid as string)
const table = reactive({
  query: {
    pid,
    value: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as DictTypes.DictValuePageItem[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: undefined,
})

const getDictValuePage = () => {
  table.loading = true
  dictApi
    .getDictValuePage(table.query)
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

const delDictValue = (id: ID) => {
  dictApi
    .delDictValue(id)
    .then(() => {
      message.success('删除字典值成功')
      getDictValuePage()
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getDictValuePage()
}

const reset = () => {
  table.query = {
    pid,
    value: '',
    pageNum: 1,
    pageSize: 10,
  }
  getDictValuePage()
}

const init = () => {
  getDictValuePage()
}

init()
</script>
