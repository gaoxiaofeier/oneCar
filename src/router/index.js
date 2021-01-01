import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import UserManage from '@/pages/home/views/user/UserManage' //用户管理
import UserDetail from '@/pages/home/views/user/UserDetail' //用户详情
import CarConfig from '@/pages/home/views/carset/CarConfig' //赛车配置
import CarConfigChange from '@/pages/home/views/carset/CarConfigChange' //赛车配置 -新增/修改

import ActivityManagerList from '@/pages/home/views/activityManager/ActivityManager' //活动管理
import ActivityChange from '@/pages/home/views/activityManager/ActivityChange' //活动管理-新增/修改
import ActivityDetail from '@/pages/home/views/activityManager/ActivityDetail' //活动管理-查看

import TrackAlbum from '@/pages/home/views/trackAlbum/TrackAlbum' //  赛道影集
import TrackAlbumChange from '@/pages/home/views/trackAlbum/TrackAlbumChange' //  赛道影集新增/修改

import OrderManage from '@/pages/home/views/orderManage/OrderManage' //订单管理
import OrderVip from '@/pages/home/views/orderManage/OrderVip' //订单管理 -购买vip
import OrderMall from '@/pages/home/views/orderManage/OrderMall' //订单管理 -商城订单

import ShopingMall from '@/pages/home/views/ShopingMall/ShopingMall' //TRACKFUN商城
import ShopingMallChange from '@/pages/home/views/ShopingMall/ShopingMallChange' //TRACKFUN商城

import SpeedRanking from '@/pages/home/views/speedRanking/SpeedRanking' //车速排名

import TrackInput from '@/pages/home/views/trackInput/TrackInput' //赛道录入


import Admin from '@/pages/home/views/admin/Admin' //管理员
import uploadDemo from '@/pages/home/views/demo/uploadDemo.vue'
Vue.use(Router)

/* Router Modules */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true,
    meta: { requireAuth: false }
  },

  {
    path: '*',
    redirect: '/login',
    meta: { requireAuth: false }
  }


]
export const asyncRoutes = [
  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true,
    meta: { requireAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/UserManage',
    component: Home,
    children: [
      { path: '/Admin', component: Admin, name: '管理员', meta: { activeMenu: '/Admin', title: '管理员', requireAuth: true } },
      { path: '/UserManage', component: UserManage, name: '用户管理', meta: { activeMenu: '/UserManage', title: '用户管理', requireAuth: true } },
      { path: '/UserDetail', component: UserDetail, name: '用户详情', meta: { activeMenu: '/UserManage', title: '用户详情', requireAuth: true } },
      { path: '/CarConfig', component: CarConfig, name: '赛车配置', meta: { activeMenu: '/CarConfig', title: '赛车配置', requireAuth: true } },
      { path: '/CarConfigChange', component: CarConfigChange, name: '赛车配置 -新增/修改', meta: { activeMenu: '/CarConfigChange', title: '用户管理' } },
      { path: '/ActivityManager', component: ActivityManagerList, name: '活动管理', meta: { activeMenu: '/ActivityManager', title: '活动管理', requireAuth: true } },
      { path: '/ActivityChange', component: ActivityChange, name: '活动管理-新增/修改', meta: { activeMenu: '/ActivityChange', title: '用户管理' } },
      { path: '/ActivityDetail', component: ActivityDetail, name: '活动管理-查看', meta: { activeMenu: '/ActivityManager', title: '活动管理', requireAuth: true } },
      { path: '/TrackInput', component: TrackInput, name: '赛道录入', meta: { activeMenu: '/TrackInput', title: '赛道录入', requireAuth: true } },
      { path: '/SpeedRanking', component: SpeedRanking, name: '车速排名', meta: { activeMenu: '/SpeedRanking', title: '车速排名', requireAuth: true } },
      { path: '/TrackAlbum', component: TrackAlbum, name: '赛道影像', meta: { activeMenu: '/TrackAlbum', title: '赛道影像', requireAuth: true } },
      { path: '/TrackAlbumChange', component: TrackAlbumChange, name: '  赛道影集-新增/修改', meta: { activeMenu: '/TrackAlbumChange', title: '用户管理' } },
      { path: '/OrderManage', component: OrderManage, name: '订单管理', meta: { activeMenu: '/OrderManage', title: '订单管理', requireAuth: true } },
      { path: '/OrderMall', component: OrderMall, name: '商城订单', meta: { activeMenu: '/OrderMall', title: '商城订单', requireAuth: true } },
      { path: '/OrderVip', component: OrderVip, name: 'vip订单', meta: { activeMenu: '/OrderVip', title: 'vip订单', requireAuth: true } },
      { path: '/ShopingMall', component: ShopingMall, name: 'TRACKFUN商城', meta: { activeMenu: '/ShopingMall', title: 'TRACKFUN商城', requireAuth: true } },
      { path: '/ShopingMallChange', component: ShopingMallChange, name: 'TRACKFUN商城修改', meta: { activeMenu: '/ShopingMall', title: 'TRACKFUN商城修改', requireAuth: true } },
      { path: '/uploadDemo', component: uploadDemo, name: '图片上传' }
    ]
  },

  {
    path: '*',
    redirect: '/login',

  }


]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  let hasLogin = localStorage.getItem("hasLogin");
  if (hasLogin === 'true') {
    let newRouter = new Router({
      routes: asyncRoutes
    });
    router.matcher = newRouter.matcher // reset router
  }
}

export default router



// export default new Router({
//   routes: [
//     {
//       path: '/home',
//       name: 'Home',
//       redirect: '/UserManage',
//       component: Home,
//       children: [
//         { path: '/Admin', component: Admin, name: '管理员', meta: { activeMenu: '/Admin' } },
//         { path: '/UserManage', component: UserManage, name: '首页', meta: { activeMenu: '/UserManage' } },
//         { path: '/UserDetail', component: UserDetail, name: '用户详情', meta: { activeMenu: '/UserManage' } },
//         { path: '/CarConfig', component: CarConfig, name: '赛车配置', meta: { activeMenu: '/CarConfig' } },
//         { path: '/CarConfigChange', component: CarConfigChange, name: '赛车配置 -新增/修改', meta: { activeMenu: '/CarConfigChange' } },
//         { path: '/ActivityManager', component: ActivityManagerList, name: '活动管理', meta: { activeMenu: '/ActivityManager' } },
//         { path: '/ActivityChange', component: ActivityChange, name: '活动管理-新增/修改', meta: { activeMenu: '/ActivityChange' } },
//         { path: '/ActivityDetail', component: ActivityDetail, name: '活动管理-查看', meta: { activeMenu: '/ActivityManager' } },
//         { path: '/TrackInput', component: TrackInput, name: '赛道录入', meta: { activeMenu: '/TrackInput' } },
//         { path: '/SpeedRanking', component: SpeedRanking, name: '车速排名', meta: { activeMenu: '/SpeedRanking' } },
//         { path: '/TrackAlbum', component: TrackAlbum, name: '  赛道影集', meta: { activeMenu: '/TrackAlbum' } },
//         { path: '/TrackAlbumChange', component: TrackAlbumChange, name: '  赛道影集-新增/修改', meta: { activeMenu: '/TrackAlbumChange' } },
//         { path: '/OrderManage', component: OrderManage, name: '订单管理', meta: { activeMenu: '/OrderManage' } },
//         { path: '/OrderVip', component: OrderVip, name: 'vip订单', meta: { activeMenu: '/OrderVip' } }
//       ]
//     },
//     {
//       path: '*',
//       redirect: '/home',
//     }
//   ]
// })
