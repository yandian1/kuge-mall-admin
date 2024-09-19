<template>
  <a-layout class="container">
    <a-layout-sider
      v-model:collapsed="collapsed"
      width="230px"
      collapsible
    >
      <div class="sider">
        <h1 class="logo">
          后台<template v-if="!collapsed">管理系统</template>
        </h1>
        <div class="menu">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            v-model:openKeys="openKeys"
            mode="inline"
            :inline-collapsed="collapsed"

          >
            <a-sub-menu :key="menu.path" v-for="menu in menus">
              <template #icon v-if="menu.icon">
                <svg-icon :icon="menu.icon" :size="14" style="margin-right: 8px"/>
              </template>
              <template #title>
                {{ menu.name }}
              </template>
              <template v-if="menu.children?.length">
                <a-menu-item :key="child.path" v-for="child in menu.children">
                  <router-link :to="child.path">{{ child.name }}</router-link>
                </a-menu-item>
              </template>
            </a-sub-menu>
          </a-menu>
        </div>
      </div>
      <template #trigger>
        <RightOutlined v-if="collapsed" style="color: #333" />
        <LeftOutlined v-else style="color: #333" />
      </template>
    </a-layout-sider>

    <a-layout class="main">
      <a-layout-header class="main-header">
        <div class="flex-aic">
          <div @click="collapsed = !collapsed" style="cursor: pointer; margin-right: 30px">
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </div>

          <a-breadcrumb>
            <a-breadcrumb-item
              v-for="route in router.currentRoute.value.matched"
            >
              {{ route.meta.title }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>


        <div>
          <a-dropdown :overlay-style="{paddingTop: '20px'}">
            <span class="avatar">
              <a-avatar :size="30">
                <template #icon><UserOutlined/></template>
              </a-avatar>
              <span class="name">{{ userStore.user.name }}</span>
            </span>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="main-body">
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup name="Layout">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, MenuUnfoldOutlined, LeftOutlined, RightOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'
import { moduleRoutes } from "@/router"

const router = useRouter()
const userStore = useUserStore()
const openKeys = ref<string[]>([router.currentRoute.value.matched[0].path])
const selectedKeys = ref<string[]>([router.currentRoute.value.path])
const collapsed = ref<boolean>(false)
const menus = computed(() => {
  return userStore.menus.map(menu => {
    const moduleRoute = moduleRoutes.find(moduleRoute => moduleRoute.path === menu.path)
    return {
      ...menu,
      icon: moduleRoute?.meta?.icon
    }
  })
})
const logout = () => {
  userStore
    .logout()
    .then(() => {
      router.push('/login')
    })
    .catch(() => {
    })
}
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  :deep(.ant-layout-sider) {
    .sider {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
      background-color: #fff;

      .logo {
        margin-left: 30px;
        margin-top: 24px;
        margin-bottom: 18px;
      }

      .menu {
        flex: 1;
        overflow-y: auto;
      }
    }
    .ant-layout-sider-trigger {
      background-color: #fff;
    }
  }

  .main {
    display: flex;
    flex-direction: column;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      background-color: #fff;

      .avatar {
        cursor: pointer;

        .name {
          margin-left: 10px;
        }
      }
    }

    &-body {
      overflow-y: auto;
      padding: 24px 16px;
    }
  }
}
</style>
