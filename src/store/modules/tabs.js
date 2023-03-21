export default {
  namespaced: true,
  mutations: {
    // 添加历史记录
    setTableTabs(state, history) {
      // 判断是否存在
      if (!state.editableTabs.some(item => item.path === history.path)) {
        const obj = {
          title: history.meta.title,
          name: history.name,
          path: history.path
        }
        state.editableTabs.push(obj)
      }
    },
    // 设置活动的标签页
    setTableTabsValue(state, path) {
      state.editableTabsValue = path
    },
    // 删除历史记录
    removeTableTabs(state, targetPath) {
      state.editableTabs = state.editableTabs.filter(item => item.path !== targetPath)
    }
  },
  state: {
    // 历史记录
    /*
    * {
    *     title: 'Tab 1',
    *     name: '1',
    *     path: '/home'
    * }
    *  */
    editableTabs: [],
    // 活动的标签页 以path为标识
    editableTabsValue: ''
  }
}
