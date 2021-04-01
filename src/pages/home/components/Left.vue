/* eslint-disable */

<template>

  <el-aside width="200px" style="background-color: rgba(0, 21, 41, 1);">
    <el-menu router :default-active="getActiveMenu" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleSelect" background-color="rgba(0,0,0,0)" text-color="#fff" active-text-color="rgba(24, 144, 255, 1)">
      <div v-for="(menu, index) in filterMenu" :key="index">
        <el-menu-item v-if="!menu.hasSub" :index="menu.path">
          <i :class="menu.iconClass"></i>
          <span>{{menu.name}}</span>
        </el-menu-item>

        <el-submenu v-if="menu.hasSub" index="menu.path">
          <template slot="title">
            <i :class="menu.iconClass"></i>
            <span>{{menu.name}}</span>
          </template>
          <el-menu-item v-for="(sub, subIndex) in menu.sub" :key="'sub' + subIndex" :index="sub.path" style="padding-left:75px;font-size:12px">{{sub.name}}</el-menu-item>
        </el-submenu>
      </div>

      <!-- <el-menu-item index="/UserManage">
        <i class="el-icon-odometer"></i>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/CarConfig">
        <i class="el-icon-s-order"></i>
        <span>赛车配置</span>
      </el-menu-item>
      <el-menu-item index="/TrackInput">
        <i class="el-icon-edit"></i>
        <span>赛道录入</span>
      </el-menu-item>
      <el-menu-item index="/ActivityManager">
        <i class="el-icon-set-up"></i>
        <span>活动管理</span>
      </el-menu-item>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-receiving"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/OrderManage" style="padding-left:75px;font-size:12px">活动订单</el-menu-item>
        <el-menu-item index="/OrderVip" style="padding-left:75px;font-size:12px">购买vip</el-menu-item>
      </el-submenu>
      <el-menu-item index="/TrackAlbum">
        <i class="el-icon-circle-check"></i>
        <span slot="title">赛道影像</span>
      </el-menu-item>
      <el-menu-item index="/SpeedRanking">
        <i class="el-icon-warning-outline"></i>
        <span slot="title">车速排名</span>
      </el-menu-item> -->
    </el-menu>

  </el-aside>

</template>

<script>
import ConfigeManage from '../views/ShopingMall/components/ConfigeManage.vue'
export default {
    components: { ConfigeManage },
  name: 'Left',
  data: function() {
    return {
      allMenuList: [
        { name: '管理员', iconClass: 'el-icon-user', path: '/Admin', hasSub: false },
        { name: '用户管理', iconClass: 'el-icon-odometer', path: '/UserManage', hasSub: false },
        { name: '赛车配置', iconClass: 'el-icon-s-order', path: '/CarConfig', hasSub: false },
        { name: '赛道录入', iconClass: 'el-icon-edit', path: '/TrackInput', hasSub: false },
        { name: '活动管理', iconClass: 'el-icon-set-up', path: '/ActivityManager', hasSub: false },
        {
          name: '订单管理',
          iconClass: 'el-icon-receiving',
          path: '5',
          hasSub: true,
          sub: [
            { name: '活动订单', path: '/OrderManage' },
            { name: '购买vip', path: '/OrderVip' },
            { name: '商城订单', path: '/OrderMall' }
          ]
        },
        { name: 'TRACKFUN商城', iconClass: 'el-icon-circle-check', path: '/ShopingMall', hasSub: false },
        { name: '赛道影像', iconClass: 'el-icon-circle-check', path: '/TrackAlbum', hasSub: false },
        {
          name: '车速排名',
          iconClass: 'el-icon-warning-outline',
          path: '/SpeedRanking',
          hasSub: false
        }
      ],
      filterMenu: []
    }
  },
  created() {
    let permissionList = localStorage.getItem('permissionSelf')
    permissionList = permissionList.split(',')
    permissionList.forEach(menuName => {
      let findIteminAllMenuList = this.allMenuList.find(item => {
        return item.name === menuName
      })
      this.filterMenu.push(findIteminAllMenuList)
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath)
    },

    handleSelect(key, keyPath) {
      // console.log('handleSelect', key, keyPath)
    }
  },

  computed: {
    getActiveMenu() {
      //console.log('this.$route', this.$route)
      // return this.$route.path
      return this.$route.meta.activeMenu;
    }
  },
  mounted() {}
}
</script>

<style scoped>
/* .el-menu-item.is-active {
  background-color: rgba(24, 144, 255, 1) !important;
}  */
.el-aside >>> .el-menu-item:hover {
  background-color: rgb(56, 64, 185, 0.5) !important;
}
.el-aside >>> .el-submenu .el-submenu__title:hover {
  background-color: rgb(20, 4, 39) !important;
}

.el-aside >>> .el-submenu__title i,
.el-aside >>> .el-submenu__title i.el-submenu__icon-arrow {
  color: #fff;
}
.el-aside.self-aside .el-submenu__title i.el-icon-arrow-down {
  color: #fff;
}
.el-menu-item i {
  color: #fff;
}
.is-active i {
  color: rgba(24, 144, 255, 1);
}
</style>