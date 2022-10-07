import classApi from '@/api/class'

export default {
  namespaced: true,
  actions: {
    // 获取班级列表
    async getClassList({ commit }) {
      const result = await classApi.getClassList()
      if (result.code === 20000) {
        commit('setClassList', result.data)
      }
    }
  },
  mutations: {
    // 设置班级列表
    setClassList(state, classList) {
      state.classList = classList
    }
  },
  state: {
    // 班级列表
    classList: []
  }
}
