<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="分类名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入分类名称"
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
    <a-card title="分类列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: '' }"
        >
          添加分类
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="table.list"
        :loading="table.loading"
        row-key="id"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'img'">
            <a-image :width="66" :src="record.img" />
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="addUpdateProps = { visible: true, id: record.id }"
              >编辑</a-button
            >
            <a-popconfirm
              :title="
                record.children?.length
                  ? '将会把子分类一起删除，确认删除？'
                  : '确认删除该分类？'
              "
              @confirm="delCategory(record.id)"
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
        @change="getCategoryPage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getCategoryPage"
  />
</template>

<script setup lang="ts" name="Category">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import * as cateApi from '@/api/admin/category'
import * as CateTypes from '@/api/admin/category/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'

const table = reactive({
  query: {
    name: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as CateTypes.CategoryPageItem[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: '',
})

const getCategoryPage = () => {
  table.loading = true
  cateApi
    .getCategoryPage(table.query)
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

const delCategory = (id: ID) => {
  cateApi
    .delCategory(id)
    .then(() => {
      message.success('删除分类成功')
      getCategoryPage()
    })
    .catch(() => {})
}

const search = () => {
  getCategoryPage()
}

const reset = () => {
  table.query = {
    name: '',
    pageNum: 1,
    pageSize: 10,
  }
  getCategoryPage()
}

const init = () => {
  getCategoryPage()
}

init()
</script>
