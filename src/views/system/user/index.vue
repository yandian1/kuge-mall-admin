<template>
  <app-header>
    <a-form layout="inline" :model="table.query">
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
  </app-header>

  <app-body>
    <a-card title="用户列表" :bordered="false">
      <template #extra>
        <a-button
          type="link"
          @click="addUpdateProps = { visible: true, id: undefined }"
        >
          添加用户
        </a-button>
      </template>

      <a-table
        :dataSource="table.list"
        :columns="columns"
        :loading="table.loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-popconfirm
              :title="`是否${record.status === 1 ? '禁用' : '启用'}该用户`"
              @confirm="changeStatus(record)"
            >
              <a-switch
                :checked="record.status"
                :checked-value="1"
                :un-checked-value="0"
                checked-children="启用"
                un-checked-children="禁用"
                :loading="record.switchLoading"
              />
            </a-popconfirm>
          </template>
          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              @click="addUpdateProps = { visible: true, id: record.id }"
            >
              编辑
            </a-button>
            <a-popconfirm
              title="确认删除该用户？"
              @confirm="delUser(record.id)"
            >
              <a-button danger type="link">删除</a-button>
            </a-popconfirm>
            <a-button type="link" @click="updatePwdProps = { visible: true, id: record.id }">修改密码</a-button>
          </template>
        </template>
      </a-table>

      <app-pagination
        v-model:page-num="table.query.pageNum"
        v-model:page-size="table.query.pageSize"
        :total="table.total"
        @change="getUserPage"
      />
    </a-card>
  </app-body>

  <add-update
    v-model:visible="addUpdateProps.visible"
    :id="addUpdateProps.id"
    @success="getUserPage"
  />

  <update-pwd
    v-model:visible="updatePwdProps.visible"
    :id="updatePwdProps.id"
  />
</template>

<script setup lang="ts" name="User">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import * as userApi from '@/api/admin/user'
import * as UserTypes from '@/api/admin/user/types'
import addUpdate from './components/addUpdate.vue'
import updatePwd from './components/updatePwd.vue'
import { columns } from './const'

type UserPageItem = UserTypes.UserPageItem & {
  switchLoading: boolean
}

const table = reactive({
  query: {
    name: '',
    account: '',
    pageNum: 1,
    pageSize: 10,
  },
  list: [] as UserPageItem[],
  total: 0,
  loading: false,
})

const addUpdateProps = ref({
  visible: false,
  id: undefined,
})

const updatePwdProps = ref({
  visible: false,
  id: undefined,
})

const getUserPage = () => {
  table.loading = true
  userApi
    .getUserPage(table.query)
    .then((res) => {
      const { list, total } = res.data.data
      table.list = list.map(item => ({
          ...item,
          switchLoading: false
        }
      ))

      table.total = total
      table.loading = false
    })
    .catch(() => {
      table.loading = false
    })
}

const changeStatus = (record: UserTypes.User) => {
  userApi
    .changeStatus({
      id: record.id,
      status: record.status === 1 ? 0 : 1,
    })
    .then(() => {
      message.success(record.status === 1 ? '禁用用户成功' : '启用用户成功')
      getUserPage()
    })
    .catch(() => {})
}

const delUser = (id: number) => {
  userApi
    .delUser(id)
    .then(() => {
      message.success('删除用户成功')
      getUserPage()
    })
    .catch(() => {})
}

const search = () => {
  table.query.pageNum = 1
  getUserPage()
}

const reset = () => {
  table.query = {
    name: '',
    account: '',
    pageNum: 1,
    pageSize: 10,
  }
  getUserPage()
}

const init = () => {
  getUserPage()
}

init()
</script>
