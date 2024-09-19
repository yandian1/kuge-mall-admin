<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="字典类型">
        <a-input
          v-model:value="table.query.type"
          placeholder="请输入字典类型"
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
    <a-card title="字典类型列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: undefined }"
          >添加字典类型</a-button
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
              @click="router.push({name: 'DictValue', query: { pid: record.id }})"
              >
              添加属性值
            </a-button>
            <a-button
              type="link"
              @click="addUpdateProps = { visible: true, id: record.id }"
            >
              编辑
            </a-button>
            <a-popconfirm
              title="确认删除该字典类型？"
              @confirm="delDictType(record.id)"
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
        @change="getDictTypePage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getDictTypePage"
  />
</template>

<script setup lang="ts" name="DictType">
import { ref, reactive } from 'vue'
import { useRouter } from "vue-router"
import { message } from 'ant-design-vue'
import * as dictApi from '@/api/admin/dict'
import * as DictTypes from '@/api/admin/dict/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'

const router = useRouter()
const table = reactive({
  query: {
    type: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as DictTypes.DictTypePageItem[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: undefined,
})

const getDictTypePage = () => {
  table.loading = true
  dictApi
    .getDictTypePage(table.query)
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

const delDictType = (id: ID) => {
  dictApi
    .delDictType(id)
    .then(() => {
      message.success('删除字典类型成功')
      getDictTypePage()
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getDictTypePage()
}

const reset = () => {
  table.query = {
    type: '',
    pageNum: 1,
    pageSize: 10,
  }
  getDictTypePage()
}

const init = () => {
  getDictTypePage()
}

init()
</script>
