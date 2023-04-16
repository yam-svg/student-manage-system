import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '数据总览', icon: 'dashboard' }
    }]
  },

  // 学生管理
  {
    path: '/student',
    component: Layout,
    redirect: '/student/list',
    name: 'Vod',
    meta: { title: '学生管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'list',
        name: 'StudentList',
        component: () => import('@/views/student/list'),
        meta: { title: '学生列表', icon: 'el-icon-user' }
      },
      {
        path: 'add',
        name: 'AddStudent',
        component: () => import('@/views/student/add'),
        meta: { title: '添加学生', icon: 'el-icon-circle-plus-outline' }
      },
      {
        path: 'edit/:id',
        name: 'EditStudent',
        hidden: true,
        component: () => import('@/views/student/add'),
        meta: { title: '编辑', icon: 'el-icon-edit' }
      },
      {
        path: 'graduated',
        name: 'Graduated',
        component: () => import('@/views/student/list'),
        meta: { title: '毕业学生', icon: 'el-icon-switch-button\n' }
      },
      {
        path: 'recovery',
        name: 'Recovery',
        component: () => import('@/views/student/list'),
        meta: { title: '误删恢复', icon: 'el-icon-refresh' }
      }
    ]
  },

  // 成绩管理
  {
    path: '/course',
    component: Layout,
    redirect: '/course/list',
    name: 'Course',
    meta: { title: '成绩管理', icon: 'el-icon-star-on' },
    children: [
      {
        path: 'list',
        name: 'CourseList',
        component: () => import('@/views/course/list'),
        meta: { title: '成绩列表', icon: 'el-icon-document' }
      }, {
        path: 'add',
        name: 'AddCourse',
        component: () => import('@/views/course/add'),
        meta: { title: '成绩录入', icon: 'el-icon-thumb' }
      }, {
        path: 'test',
        name: 'TestManage',
        component: () => import('@/views/course/test'),
        meta: { title: '考试管理', icon: 'el-icon-help' }
      }
    ]
  },

  // 班级管理
  {
    path: '/class',
    component: Layout,
    redirect: '/class/list',
    meta: { title: '班级管理', icon: 'el-icon-s-help' },
    children: [{
      path: 'list',
      name: 'ClassList',
      component: () => import('@/views/class/list'),
      meta: { title: '班级列表', icon: 'el-icon-s-data' }
    }]
  },

  // 教师管理
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    meta: { title: '教师管理', icon: 'el-icon-s-help' },
    children: [{
      path: 'list',
      name: 'TeacherList',
      component: () => import('@/views/teacher/index'),
      meta: { title: '教师列表', icon: 'el-icon-s-custom' }
    }]
  },

  // 学院管理
  {
    path: '/college',
    component: Layout,
    redirect: '/college/list',
    meta: { title: '学院管理', icon: 'el-icon-s-help' },
    children: [{
      path: 'list',
      name: 'CollegeList',
      component: () => import('@/views/college/index'),
      meta: { title: '学院管理', icon: 'el-icon-s-platform' }
    }]
  },

  // 专业管理
  {
    path: '/major',
    component: Layout,
    redirect: '/major/list',
    meta: { title: '专业管理', icon: 'el-icon-s-help' },
    children: [{
      path: 'list',
      name: 'MajorList',
      component: () => import('@/views/major/index'),
      meta: { title: '专业管理', icon: 'el-icon-s-unfold' }
    }]
  },

  // 学生档案
  {
    path: '/portfolio',
    component: Layout,
    redirect: '/Epidemic',
    meta: { title: '学生档案', icon: 'el-icon-s-flag' },
    children: [{
      path: 'list',
      name: 'PortfolioList',
      component: () => import('@/views/portfolio/index'),
      meta: { title: '学生档案', icon: 'el-icon-finished' }
    }]
  },

  // 疫情管理
  {
    path: '/epidemic',
    component: Layout,
    redirect: '/Epidemic',
    meta: { title: '疫情管理', icon: 'el-icon-chat-round' },
    children: [{
      path: 'list',
      name: 'EpidemicList',
      component: () => import('@/views/epidemic/index'),
      meta: { title: '疫情管理', icon: 'el-icon-warning' }
    }]
  },

  // 系统设置
  {
    path: '/system',
    component: Layout,
    redirect: '/system/setting',
    meta: { title: '系统设置', icon: 'el-icon-s-tools' },
    children: [{
      path: 'setting',
      name: 'SystemSetting',
      component: () => import('@/views/setting/password'),
      meta: { title: '修改密码', icon: 'el-icon-lock' }
    }, {
      path: 'recover',
      name: 'SystemRecover',
      component: () => import('@/views/setting/recover'),
      meta: { title: '找回密码', icon: 'el-icon-unlock' }
    }, {
      path: 'change',
      name: 'SystemChange',
      component: () => import('@/views/setting/change'),
      meta: { title: '更换邮箱', icon: 'el-icon-message' }
    }, {
      path: 'ip',
      name: 'Ip',
      component: () => import('@/views/setting/ip'),
      meta: { title: '登录记录', icon: 'el-icon-location-outline' }
    }
    ]
  },

  // 找回密码
  {
    path: '/password',
    hidden: true,
    component: () => import('@/views/setting/recover'),
    meta: { title: '找回密码', icon: 'el-icon-eleme' }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 路由守卫 用于管理动态标签页 beforeEach是路由跳转前执行的钩子函数
router.beforeEach((to, from, next) => {
  // 获取动态标签页
  const editableTabs = store.state.tabs.editableTabs
  // 获取角色
  const vuex = localStorage.getItem('vuex')
  const role = JSON.parse(vuex).user.name
  // 如果当前标签页为空或者当前标签页不在动态标签页中 并且不是登录页
  if (editableTabs.length === 0 || !editableTabs.some(item => item.name === to.name)) {
    if (to.path !== '/login') {
      // 添加动态标签页
      store.commit('tabs/setTableTabs', to)
    }
  }
  // 如果角色不是admin 并且访问的是学院管理或者专业管理
  if (role !== 'admin') {
    if (to.path.indexOf('/college') >= 0 || to.path.indexOf('/major') >= 0) {
      // 跳转到404页面
      console.log(to.path)
      next('/404')
    }
  }
  // 设置当前标签页
  store.commit('tabs/setTableTabsValue', to.path)
  next()
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
