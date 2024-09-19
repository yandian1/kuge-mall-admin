<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="活动名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入活动名称"
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
    <a-card title="活动列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="router.push({name: 'ActivityCreate'})"
        >
          添加活动
        </a-button>
      </template>

      <a-table
        :dataSource="table.list"
        :columns="columns"
        :loading="table.loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'banner'">
            <a-image :width="66" :src="record.banner" />
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="router.push({name: 'ActivityEdit', query: { id: record.id }})"
            >
              编辑
            </a-button>
            <a-popconfirm
              title="确认删除该活动？"
              @confirm="delActivity(record.id)"
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
        @change="getActivityPage"
      />
    </a-card>
  </app-body>
</template>

<script setup lang="ts" name="Activity">
import { reactive } from 'vue'
import { useRouter } from "vue-router"
import { message } from 'ant-design-vue'
import * as activityApi from '@/api/admin/activity'
import * as ActivityTypes from '@/api/admin/activity/types'
import { columns } from './const'

const router = useRouter()
const table = reactive({
  query: {
    name: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as ActivityTypes.ActivityPageItem[],
  total: 0,
  loading: false,
})

const getActivityPage = () => {
  table.loading = true
  activityApi
    .getActivityPage(table.query)
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

const delActivity = (id: number) => {
  activityApi
    .delActivity(id)
    .then(() => {
      message.success('删除活动成功')
      getActivityPage()
    })
    .catch(() => {
    })
}

const search = () => {
  table.query.pageNum = 1
  getActivityPage()
}

const reset = () => {
  table.query = {
    name: '',
    pageNum: 1,
    pageSize: 10,
  }
  getActivityPage()
}

const init = () => {
  getActivityPage()
}

init()
</script>
