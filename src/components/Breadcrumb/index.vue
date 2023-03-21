<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <!--原来的面包屑-->
      <!--<el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">-->
      <!--  <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>-->
      <!--  <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>-->
      <!--</el-breadcrumb-item>-->
      <!--现在换成动态添加标签页-->
      <el-tabs
        :key="'abc'"
        v-model="currentTabs"
        style="height: 10px"
        type="card"
        :closable="editableTabs.length > 1"
        @edit="handleTabsEdit"
        @tab-click="handleRouter"
      >
        <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.path"
        >
          {{ item.content }}
        </el-tab-pane>
      </el-tabs>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      levelList: null,
      currentTabs: ''
    }
  },
  computed: {
    ...mapState('tabs', ['editableTabs', 'editableTabsValue'])
  },
  watch: {
    $route() {
      this.getBreadcrumb()
      this.currentTabs = this.editableTabsValue
    },
    currentTabs() {
      this.$store.commit('tabs/setTableTabsValue', this.currentTabs)
    }
  },
  created() {
    this.getBreadcrumb()
    this.currentTabs = this.editableTabsValue
  },
  methods: {
    // 标签页关闭
    handleTabsEdit(targetPath, action) {
      if (action === 'remove') {
        const tabs = this.editableTabs
        let activePath = this.editableTabsValue
        if (activePath === targetPath) {
          // 删除的是当前标签页
          tabs.forEach((tab, index) => {
            if (tab.path === targetPath) {
              // 获取下一个标签页
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activePath = nextTab.path
                // 跳转到下一个标签页
                this.$router.push(activePath)
              }
            }
          })
        }
        // 设置当前标签页
        this.$store.commit('tabs/setTableTabsValue', activePath)
        // 删除标签页
        this.$store.commit('tabs/removeTableTabs', targetPath)
      }
    },
    // 标签页点击
    handleRouter(tab) {
      this.$router.push(tab.name)
    },

    // get breadcrumb
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    // check if route is dashboard
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    // compile path
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    // handle link
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
/* 通过设置 font-size 属性来调整标签的大小 */
.el-tabs__item {
  font-size: 13px;
}
.el-tabs__nav {
  margin: 3px 0;
  height: 41px;
  line-height: 42px;
}
</style>
