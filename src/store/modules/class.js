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
    classList: [],
    // 所有班级的总人数
    total: 0
  },
  getters: {
    // 班级总人数
    total(state) {
      return state.classList.reduce((pre, item) => pre + item.student, 0).toString() || '获取中'
    },
    // 各班人数
    classCount(state) {
      return state.classList.map(item => item.student)
    },
    // 各班占比
    classPercent(state) {
      return state.classList.map(item => {
        return {
          name: item.name,
          percent: item.student / state.classList.reduce((pre, item) => pre + item.student, 0)
        }
      })
    }
  }
}
