<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="角色名">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入角色名"
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
    <a-card title="角色列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: undefined }"
          >添加角色</a-button
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
              >编辑</a-button
            >
            <a-popconfirm
              title="确认删除该角色？"
              @confirm="delRole(record.id)"
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
        @change="getRolePage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getRolePage"
  />
</template>

<script setup lang="ts" name="Role">
import { ref, reactive } from 'vue'
import { useUserStore } from "@/store/user"
import * as roleApi from '@/api/admin/role'
import { Role } from '@/api/admin/role/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'
import { message } from 'ant-design-vue'

const userStore = useUserStore()
const table = reactive({
  query: {
    name: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as Role[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: undefined,
})

const getRolePage = () => {
  table.loading = true
  roleApi
    .getRolePage(table.query)
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

const delRole = (id: number) => {
  roleApi
    .delRole(id)
    .then(() => {
      message.success('删除角色成功')
      getRolePage()
      if (id && userStore.roleIds.includes(id)) {
        userStore.getAdminInfo()
      }
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getRolePage()
}

const reset = () => {
  table.query = {
    name: '',
    pageNum: 1,
    pageSize: 10,
  }
  getRolePage()
}

const init = () => {
  getRolePage()
}

init()
</script>
