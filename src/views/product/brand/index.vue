<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
      <a-form-item label="品牌名称">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入品牌名称"
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
    <a-card title="品牌列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: '' }"
          >添加品牌</a-button
        >
      </template>

      <a-table
        :dataSource="table.list"
        :columns="columns"
        :loading="table.loading"
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
                  ? '将会把子品牌一起删除，确认删除？'
                  : '确认删除该品牌？'
              "
              @confirm="delBrand(record.id)"
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
        @change="getBrandPage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getBrandPage"
  />
</template>

<script setup lang="ts" name="Brand">
import { ref, reactive } from 'vue'
import * as brandApi from '@/api/admin/brand'
import { Brand } from '@/api/admin/brand/types'
import addUpdate from './components/addUpdate.vue'
import { columns } from './const'
import { message } from 'ant-design-vue'

const table = reactive({
  query: {
    name: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as Brand[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: '',
})

const getBrandPage = () => {
  brandApi
    .getBrandPage(table.query)
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

const delBrand = (id: ID) => {
  brandApi
    .delBrand(id)
    .then(() => {
      message.success('删除品牌成功')
      getBrandPage()
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getBrandPage()
}

const reset = () => {
  table.query = {
    name: '',
    pageNum: 1,
    pageSize: 10,
  }
  getBrandPage()
}

const init = () => {
  getBrandPage()
}

init()
</script>
