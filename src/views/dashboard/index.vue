<template>
  <div class="dashboard-container">
    <Card/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './Card/index'

export default {
  name: 'Dashboard',
  components: { Card },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // 获取班级列表
    this.$store.dispatch('classL/getClassList')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
