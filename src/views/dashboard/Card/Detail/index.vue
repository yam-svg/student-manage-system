<template>
  <div>
    <!--标题-->
    <div class="card-header">
      <span>{{ title }}</span>
    </div>
    <!--内容(数字)-->
    <div v-if="count" class="card-content">{{ count }}</div>
    <!--图表-->
    <div :style="{ height: count !== '' ? 55 + 'px' : 110 + 'px' }">
      <slot name="carts"></slot>
    </div>
    <!--底部-->
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    title: {
      type: String,
      default: '默认标题'
    },
    count: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}

.card-content {
  font-size: 30px;
  padding: 10px 0;
}

/*.card-carts {*/
/*  height: 55px;*/
/*}*/

.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
  font-size: 14px;
}
</style>
