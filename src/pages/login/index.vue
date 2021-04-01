<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">One Car</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-s-custom"></i>
        </span>
        <el-input ref="username" v-model="loginForm.userName" placeholder="账号" type="text" tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-s-goods"></i>
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.passWord" :type="passwordType" placeholder="密码" tabindex="2" autocomplete="on" @keyup.enter.native="handleLogin" />
        <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span> -->
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin:10px 0;" @click.native.prevent="handleLogin">Login</el-button>

    </el-form>
  </div>
</template>

<script>
import util from '@/libs/util'
import { resetRouter } from '@/router/index'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        passWord: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur' }],
        passWord: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let params = new URLSearchParams()
          params.append('userName', this.loginForm.userName)
          params.append('passWord', this.loginForm.passWord)
          params.append('ran',  Math.random())//为避免token缓存，加个随机数
          util.ajax
            .get('admin/login?' + params)
            .then(res => {
              if (parseInt(res.data.code) == 301000) { 
                // 登出的时候 一定要把 hasLogin 改成 false
                localStorage.setItem('hasLogin', true)
                localStorage.setItem('token', res.data.data.token)
                localStorage.setItem('userName', res.data.data.admin[0].userName)
                let permissionList=res.data.data.admin[0].permissionList
                // permissionList.push('TRACKFUN商城')
                localStorage.setItem('permissionSelf', permissionList)
                this.$store.commit('token', res.data.data.token)
                resetRouter()
                if (permissionList.length > 0) {
                  switch (permissionList[0]) {
                    case '管理员':
                      this.$router.push('/Admin')
                      break
                    case '用户管理':
                      this.$router.push('/UserManage')
                      break
                    case '赛车配置':
                      this.$router.push('/CarConfig')
                      break
                    case '赛道录入':
                      this.$router.push('/TrackInput')
                      break
                    case '活动管理':
                      this.$router.push('/ActivityManager')
                      break
                    case '订单管理':
                      this.$router.push('/OrderManage')
                      break
                    case '赛道影像':
                      this.$router.push('/TrackAlbum')
                      break
                    case '车速排名':
                      this.$router.push('/Admin')
                      break
                    case 'TRACKFUN商城':
                      this.$router.push('/ShopingMall')
                      break
                  }
                }
              } else {
                this.$message('账户或密码不正确')
                this.loading = false
              }
            })
            .catch(function(err) {
              console.log(err)
            })
    //       let params = {
    //         id: 0,
	// username: this.loginForm.userName,
	// password: this.loginForm.passWord
    //       }
    //     util.ajax
    //         .post('v2.0/hello/adminLogin' , params)
    //         .then(res => {
    //           if (parseInt(res.data.code) == 301000) {
    //             // 登出的时候 一定要把 hasLogin 改成 false
    //             localStorage.setItem('hasLogin', true)
    //             localStorage.setItem('token', res.data.data.token)
    //             localStorage.setItem('userName', res.data.data.admin[0].userName)
    //             let permissionList=res.data.data.admin[0].permissionList
    //             permissionList.push('TRACKFUN商城')
    //             localStorage.setItem('permissionSelf', permissionList)
    //             this.$store.commit('token', res.data.data.token)
    //             resetRouter()
    //             if (permissionList.length > 0) {
    //               switch (permissionList[0]) {
    //                 case '管理员':
    //                   this.$router.push('/Admin')
    //                   break
    //                 case '用户管理':
    //                   this.$router.push('/UserManage')
    //                   break
    //                 case '赛车配置':
    //                   this.$router.push('/CarConfig')
    //                   break
    //                 case '赛道录入':
    //                   this.$router.push('/TrackInput')
    //                   break
    //                 case '活动管理':
    //                   this.$router.push('/ActivityManager')
    //                   break
    //                 case '订单管理':
    //                   this.$router.push('/OrderManage')
    //                   break
    //                 case '赛道影像':
    //                   this.$router.push('/TrackAlbum')
    //                   break
    //                 case '车速排名':
    //                   this.$router.push('/Admin')
    //                   break
    //                 case 'TRACKFUN商城':
    //                   this.$router.push('/ShopingMall')
    //                   break
    //               }
    //             }
    //           } else {
    //             this.$message('账户或密码不正确')
    //             this.loading = false
    //           }
    //         })
    //         .catch(function(err) {
    //           console.log(err)
    //         })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
}

.login-container .login-form {
  position: relative;
  width: 500px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}
.login-container .title-container {
  position: relative;
}
.login-container .title-container .title {
  font-size: 26px;
  color: #eee;
  margin: 0 auto 40px auto;
  text-align: center;
  font-weight: 700;
}
.login-container .el-form-item {
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
}
.el-form-item--medium .el-form-item__content,
.el-form-item--medium .el-form-item__label {
  line-height: 36px;
}
.login-container .el-form-item {
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
}
.login-container .svg-container {
  padding: 6px 5px 6px 15px;
  color: #889aa4;
  vertical-align: middle;
  width: 30px;
  text-align: center;
  display: inline-block;
}
.login-container .el-input {
  display: inline-block;
  height: 47px;
  width: 85%;
}
.login-container >>> .el-input input {
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  border-radius: 0;
  padding: 12px 5px 12px 6px;
  color: #fff;
  height: 47px;
  caret-color: #fff;
}
</style>


