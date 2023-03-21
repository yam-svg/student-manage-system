import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import classL from './modules/class'
import tabs from './modules/tabs'
import VuexPersistence from 'vuex-persist'
// vuex-persist插件, 保存数据到localStorage
const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
  key: 'vuex-tabs',
  // 只保存tabs模块
  reducer: state => ({
    // 只保存state中的editableTabs 和 editableTabsValue
    tabs: {
      editableTabs: state.tabs.editableTabs,
      editableTabsValue: state.tabs.editableTabsValue
    }
  })
})
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    classL,
    tabs
  },
  getters,
  // 使用vuex-persist插件, 保存数据到localStorage
  plugins: [vuexLocal.plugin]
})

export default store
