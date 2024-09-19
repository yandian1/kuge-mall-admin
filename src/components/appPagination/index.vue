<template>
  <div class="container">
    <a-pagination
      v-model:current="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      :show-total="(total: number) => `总共 ${total} 条`"
      show-size-changer
      @change="emits('change')"
    />
  </div>
</template>

<script setup lang="ts" name="AppPagination">
const pageNum = defineModel<number>('pageNum')
const pageSize = defineModel<number>('pageSize')
const total = defineModel<number>('total')
const emits = defineEmits(['change'])
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
