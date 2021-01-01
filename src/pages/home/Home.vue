<template>
  <div class="container">
    <el-container>
      <left></left>
      <el-container>
        <el-header style="text-align: right; font-size: 12px;">
          <span style='margin-right:12px'>{{userName}}</span>
          <span style='cursor:pointer' @click="signOut">退出登录</span>
        </el-header>
        <div class="main_container">
          <router-view></router-view>
        </div>
      </el-container>
    </el-container>
  </div>

</template>

<script>
import Left from './Components/Left'
import Header from './Components/Header'
import { resetRouter } from '@/router/index'
export default {
  name: 'Home',
  components: {
    Left,
    Header
  },
  data() {
    return {
      userName: localStorage.getItem('userName')
    }
  },
  methods: {
    signOut() {
      localStorage.setItem('hasLogin', false)
      localStorage.setItem('token', '')
      this.$store.commit('token', '')
      resetRouter()
      this.$router.push('/Login') 
    }
  }
}
</script>

<style>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.container .el-container {
  min-height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  display: block;
}
.container .el-aside {
  background-color: rgba(0, 21, 41, 1);
  min-height: 100vh;
}
.el-menu {
  border: 0px;
}
.main_container {
  background-color: rgba(240, 242, 245, 1);
  height: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
}
.el-main {
  padding: 20px 20px 0px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  height: 100%;
}
</style>