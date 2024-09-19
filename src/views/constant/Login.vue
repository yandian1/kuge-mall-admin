<template>
  <div class="container">
    <div class="inner">
      <h1>后台管理系统</h1>
      <a-form
        @finish="login"
        :model="formState"
        autocomplete="off"
        hide-required-mark
      >
        <a-form-item
          label="账号"
          name="account"
          :rules="[{ required: true, message: '请输入账号' }]"
        >
          <a-input v-model:value="formState.account" placeholder="请输入账号"/>
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="请输入密码"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="submitLoading" block>登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const submitLoading = ref(false)
const formState = reactive({
  account: '',
  password: '',
  // account: 'admin',
  // password: 'admin123+',
})

const login = () => {
  if (submitLoading.value) return
  submitLoading.value = true
  userStore
    .login(formState)
    .then(() => {
      submitLoading.value = false
      router.replace(userStore.firstMenuPath)
    })
    .catch(() => {
      submitLoading.value = false
    })
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(@/assets/imgs/login-bg.jpg) no-repeat center / 100% 100%;
  height: 100vh;

  .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;

    h1 {
      margin: 30px 0 25px;
      color: #333;
      font-size: 28px;
      letter-spacing: 1px;
    }

    .ant-form {
      width: 80%;

      .ant-form-item {
        &:last-child {
          margin-top: 30px;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
