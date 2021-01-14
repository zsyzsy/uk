import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    设置该路由进入的权限，支持多个权限叠加
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的图标
    noCache: true                如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/example/list'  如果设置path,sidebar会高亮对应path的按钮
    isChild: false               在需要设置隐藏的三级页面时使用，路由切换会替换页面标签，而不是新建标签
    hideSub: false               如果设置为true,则不显示二级边栏
    hideBreadcrumb: false        如果设置为true,则不显示breadcrumb整个组件
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index2'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/certificateManage',
    hidden: true
  },
  {
    path: '/noLogin',
    name: 'noLogin',
    component: () => import('@/views/noLogin/index'),
    meta: { title: '证书管理', hideSub: true, hideBreadcrumb: true },
    hidden: true
  },
  {
    path: '/certificateManage',
    component: Layout,
    redirect: '/certificateManage/index',
    meta: { title: '证书管理', icon: 'home' },
    children: [
      {
        path: 'index',
        name: 'certificateManageIndex',
        component: () => import('@/views/certificateManage/index'),
        meta: { title: '证书管理', hideSub: true, hideBreadcrumb: true }
      },
      {
        path: 'success',
        name: 'certificateSuccess',
        component: () => import('@/views/certificateManage/success'),
        meta: { title: '成功', isChild: true, hideSub: true }
      },
      {
        path: 'cfcaTest',
        name: 'Test',
        component: () => import('@/views/certificateManage/cfcaTest'),
        meta: { title: '证书签名', isChild: true, hideSub: true }
      }

    ]
  },
  {
    path: '/UKManage',
    component: Layout,
    redirect: '/UKManage/index',
    meta: { title: 'UK管理', icon: 'home' },
    children: [
      {
        path: 'index',
        name: 'UKManageIndex',
        component: () => import('@/views/UKManage/index'),
        meta: { title: 'UK管理', hideSub: true, hideBreadcrumb: true }
      },
      {
        path: 'success',
        name: 'UKSuccess',
        component: () => import('@/views/UKManage/success'),
        meta: { title: '成功', isChild: true, hideSub: true }
      }
    ]
  },
  {
    path: '/passwordSet',
    component: Layout,
    redirect: '/passwordSet/index',
    meta: { title: '密码管理', icon: 'home' },
    children: [
      {
        path: 'index',
        name: 'passwordSetIndex',
        component: () => import('@/views/passwordSet/index'),
        meta: { title: '密码管理', hideSub: true, hideBreadcrumb: true }
      },
      {
        path: 'setPassword',
        name: 'passwordSetPass',
        component: () => import('@/views/passwordSet/setPassword'),
        meta: { title: '密码设置', hideSub: true, hideBreadcrumb: true }
      },
      {
        path: 'success',
        name: 'passwordSetSuccess',
        component: () => import('@/views/passwordSet/success'),
        meta: { title: '成功', isChild: true, hideSub: true }
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

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
