<template>
  <a-modal v-model:open="visible" title="添加用户" width="1200px" @ok="submit">
    <a-form layout="inline" :model="table.query" style="margin: 24px 0">
      <a-form-item label="用户名">
        <a-input
          v-model:value="table.query.name"
          placeholder="请输入用户名"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户账号">
        <a-input
          v-model:value="table.query.account"
          placeholder="请输入用户账号"
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
    />

    <app-pagination
      v-model:page-num="table.query.pageNum"
      v-model:page-size="table.query.pageSize"
      :total="table.total"
    />
  </a-modal>
</template>

<script setup lang="ts" name="AddMember">
import { ref, reactive, watch } from 'vue'
import * as memberApi from "@/api/admin/member"
import * as MemberTypes from "@/api/admin/member/types"

const props = withDefaults(
  defineProps<{
    memberList?: MemberTypes.MemberPageItem[]
  }>(),
  {
    memberList: () => [],
  }
)

const emits = defineEmits(['add'])
const visible = defineModel<boolean>('visible')

const columns = [
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '用户账号',
    dataIndex: 'account',
    key: 'account',
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
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
]

const table = reactive({
  query: {
    name: '',
    account: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as MemberTypes.MemberPageItem[],
  total: 0,
  loading: false,
})

const rowSelection = ref({
  selectedRows: [] as MemberTypes.MemberPageItem[],
  selectedRowKeys: [] as ID[],
  onChange: (selectedRowKeys: ID[], selectedRows: MemberTypes.MemberPageItem[]) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys || []
    rowSelection.value.selectedRows =
      selectedRows?.map((row) => ({
        id: row.id,
        name: row.name,
        account: row.account,
        createTime: row.createTime,
        updateTime: row.updateTime,
      })) || []
  },
})


const getMemberPage = () => {
  table.loading = true
  memberApi
    .getMemberPage(table.query)
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


const search = () => {
  table.query.pageNum = 1
  getMemberPage()
}

const reset = () => {
  table.query = {
    name: '',
    account: '',
    pageNum: 1,
    pageSize: 10,
  }
  getMemberPage()
}

const submit = () => {
  emits('add', rowSelection.value.selectedRows)
  visible.value = false
}

watch(visible, () => {
  if (visible.value) {
    getMemberPage()
  }
})

watch(
  () => props.memberList,
  () => {
    rowSelection.value.selectedRowKeys =
      props.memberList?.map((member) => member.id) || []
  }
)
</script>

<style lang="less" scoped></style>
