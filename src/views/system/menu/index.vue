<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="菜单名">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入菜单名"
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
    <a-card title="菜单列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: undefined }"
          >添加菜单</a-button
        >
      </template>

      <a-table
        :dataSource="table.list"
        :columns="columns"
        :loading="table.loading"
        row-key="id"
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
              title="确认删除该菜单？"
              @confirm="delMenu(record.id)"
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
        @change="getMenuPage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getMenuPage"
  />
</template>

<script setup lang="ts" name="Menu">
import { ref, reactive } from 'vue'
import * as menuApi from '@/api/admin/menu'
import * as MenuTypes from '@/api/admin/menu/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'
import { message } from 'ant-design-vue'
import { useUserStore } from "@/store/user"

const userStore = useUserStore()
const table = reactive({
  query: {
    name: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as MenuTypes.MenuPageItem[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: undefined,
})

const getMenuPage = () => {
  table.loading = true
  menuApi
    .getMenuPage(table.query)
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

const delMenu = (id: number) => {
  menuApi
    .delMenu(id)
    .then(() => {
      message.success('删除菜单成功')
      getMenuPage()
      if (userStore.menuIds.includes(id)) {
        userStore.getAdminInfo()
      }
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getMenuPage()
}

const reset = () => {
  table.query = {
    name: '',
    pageNum: 1,
    pageSize: 10,
  }
  getMenuPage()
}

const init = () => {
  getMenuPage()
}

init()
</script>
