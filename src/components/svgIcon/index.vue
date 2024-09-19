<template>
  <svg :class="svgClass" :style="svgStyle" aria-hidden="true">
    <use :xlink:href="iconClassName" :fill="color" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue'
import '@/assets/js/iconfont'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  size: {
    type: Number,
  },
  clas: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#666'
  }
})
// 图标在 iconfont 中的名字
const iconClassName = computed(()=>{
  return `#${props.icon}`;
})
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.clas) {
    return `svg-icon ${props.clas}`;
  }
  return 'svg-icon';
})
const svgStyle = computed(() => {
  if (props.size) {
    return {
      fontSize: props.size + 'px'
    };
  }
  return {};
});
</script>

<style lang="less" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>