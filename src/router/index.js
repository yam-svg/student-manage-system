import Vue from 'vue'
import Router from 'vue-router'

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
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 学生管理
  {
    path: '/student',
    component: Layout,
    redirect: '/student/list',
    name: 'Vod',
    meta: { title: '学生管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'list',
        name: 'StudentList',
        component: () => import('@/views/student/list'),
        meta: { title: '学生列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'AddStudent',
        component: () => import('@/views/student/add'),
        meta: { title: '添加学生', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: 'EditStudent',
        hidden: true,
        component: () => import('@/views/student/add'),
        meta: { title: '编辑', icon: 'table' }
      },
      {
        path: 'graduated',
        name: 'Graduated',
        component: () => import('@/views/student/list'),
        meta: { title: '毕业学生', icon: 'table' }
      },
      {
        path: 'recovery',
        name: 'Recovery',
        component: () => import('@/views/student/list'),
        meta: { title: '误删恢复', icon: 'table' }
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
      meta: { title: '班级列表', icon: 'table' }
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
      meta: { title: '教师列表', icon: 'table' }
    }]
  },
  // 系统设置
  {
    path: '/system',
    component: Layout,
    redirect: '/system/setting',
    meta: { title: '系统设置', icon: 'el-icon-s-help' },
    children: [{
      path: 'setting',
      name: 'SystemSetting',
      component: () => import('@/views/setting/password'),
      meta: { title: '修改密码', icon: 'table' }
    }, {
      path: 'recover',
      name: 'SystemRecover',
      component: () => import('@/views/setting/recover'),
      meta: { title: '找回密码', icon: 'table' }
    }, {
      path: 'change',
      name: 'SystemChange',
      component: () => import('@/views/setting/change'),
      meta: { title: '更换邮箱', icon: 'table' }
    }
    ]
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

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
