<template>
  <el-main>
    <div class="main_inner">
      <div class="user-detail">
        <el-row :gutter="20">
          <el-col :span="3">
            <el-avatar :src="this.head.headPic" style="width:100px;height:100px;"></el-avatar>
          </el-col>
          <el-col :span="21" class="inf_box">
            <div style="margin-bottom:20px; position:relative;width:100%; height:16px">
              <span class="act_name" style="float:left" v-if="this.head.nickName">{{this.head.nickName}}</span>
              <span v-if="this.head.vip1" style="float:left;margin-right:10px">年费会员： {{this.tableOne[0].vip1Endtime|timeFilters}} </span>
              <span v-if="this.head.vip2" style="float:left">畅跑会员： {{this.tableOne[0].vip2Endtime|timeFilters}}</span>
              <span class="user_btn" @click="fixedBox">修改会员类型</span>
              <span class="user_btn" @click="couponBox">抵用券调整</span>
              <span class="user_btn" @click="integralBox">积分调整</span>
              
            </div>
            <div style="width:100%;height:30px;">
              <div class="ui_list">
                <span class="user_name">注册时间：</span>
                <span class="user_inf"> {{this.head.regTime|timeFilters}}</span>
              </div>
              <div class="ui_list">
                <span class="user_name">最近登录：</span>
                <span class="user_inf">{{this.head.lastLogin|timeFiltersTime}}</span>
              </div>
              <div class="ui_list">
                <span class="user_name">积分：</span>
                <span class="user_inf">{{this.head.integral}}</span>
              </div>
            </div>
            <div>
              <div class="ui_list">
                <span class="user_name">优惠券：</span>
                <span class="user_inf">{{this.head.coupon}}</span>
              </div>
              <div class="ui_list">
                <span class="user_name">参加活动次数：</span>
                <span class="user_inf">{{this.head.actTime}}</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <div>
          <p class="mi_title">个人信息</p>
          <el-table :data="tableOne" border style="width: 98%">
            <el-table-column prop="trueName" label="真实姓名" width="100">
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="120">
            </el-table-column>
            <el-table-column prop="wechat" label="微信id">
            </el-table-column>
            <el-table-column prop="nickName" label="微信昵称">
            </el-table-column>
            <el-table-column prop="idCard" label="身份证">
            </el-table-column>
            <el-table-column prop="gender" label="性别">
              <template slot-scope="scope">
                {{(parseInt(scope.row.gender)%2==0)?'女':'男'}}
              </template>
            </el-table-column>
            <el-table-column prop="blood" label="血型">
            </el-table-column>
            <el-table-column prop="height" label="身高">
            </el-table-column>
            <el-table-column prop="weight" label="体重">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <p class="mi_title">用户赛车登记</p>
          <el-table :data="tableTwo" border style="width: 98%">
            <!-- <el-table-column prop="userId" label="id">
          </el-table-column> -->
            <el-table-column prop="carBrand" label="品牌">
            </el-table-column>
            <el-table-column prop="carXi" label="车系">
            </el-table-column>
            <el-table-column prop="carType" label="车型">
            </el-table-column>
            <el-table-column prop="date" label="年份">
            </el-table-column>
            <el-table-column prop="ed" label="排量">
            </el-table-column>
            <el-table-column label="车图">
              <template slot-scope="scope">
                <div @click="showBigImage(scope.row.picList[0].url)" style="width: 100%; height: 100%;" v-if="scope.row.picList">
                  <img style="width: 60px; height: 40px; ddisplay: block;" :src="scope.row.picList[0].url" />
                </div>
                <!-- {{scope.row.carPic}} -->
              </template>
            </el-table-column>
            <el-table-column prop="addTime" label="加入时间" width="100px">
              <template slot-scope="scope">
                {{scope.row.createDate|timeFiltersTime}}
              </template>
            </el-table-column>
            <el-table-column prop="changeTime" label="修改时间" width="100px">
              <template slot-scope="scope">
                {{scope.row.modifyDate|timeFiltersTime}}
              </template>
            </el-table-column>
            <el-table-column prop="defaultCar" label="默认车辆">
              <template slot-scope="scope">
                {{scope.row.isDefault|carFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="rem" label="备注">
            </el-table-column>
            <el-table-column label="操作" fixed='right'>
              <template slot-scope="scope">
                <el-button type="text" size="small" style="color:red" @click="deleteTr1(scope.row.userCarId)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <p class="mi_title">用户订单</p>
          <el-table :data="tableThree" border style="width: 98%">
            <!-- <el-table-column prop="id" label="id">
          </el-table-column> -->
            <el-table-column prop="orderId" label="订单号">
            </el-table-column>
            <el-table-column prop="actName" label="活动名称">
            </el-table-column>
            <el-table-column prop="actLocation" label="活动地点">
            </el-table-column>
            <el-table-column prop="date" label="活动日期">
              <template slot-scope="scope">
                {{scope.row.date|timeFilters}}
              </template>
            </el-table-column>
            <el-table-column prop="buyTime" label="购买时间" width="100px">
              <template slot-scope="scope">
                {{scope.row.buyTime|timeFiltersTime}}
              </template>
            </el-table-column>
            <el-table-column prop="carNumber" label="参赛车辆">
              <template slot-scope="scope">
                {{scope.row.carBrand+','+scope.row.carType+','+scope.row.year+','+scope.row.ed}}
              </template>
            </el-table-column>
            <el-table-column prop="buyType" label="支付方式">
            </el-table-column>
            <el-table-column prop="money" label="支付金额">
                <template slot-scope="scope">
                {{(scope.row.money/100).toFixed(2)}}
              </template>
            </el-table-column>
            <el-table-column prop="ifact" label="是否参与">
              <template slot-scope="scope">
                {{scope.row.ifact|actFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="recommend" label="推荐人">
            </el-table-column>
            <el-table-column prop="rem" label="备注">
            </el-table-column>
            <el-table-column label="操作" fixed='right'>
              <template slot-scope="scope">
                <el-button type="text" size="small" style="color:red" @click="deleteTr2(scope.row.orderId)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 详情--赛车--车图弹窗 -->
        <el-dialog :visible.sync="isShowBigImage" :before-close="handleBigImageClose">
          <div class="img-wrap">
            <img :src="tableListBigImageUrl" />
          </div>
        </el-dialog>
        <!-- 修改会员类型弹窗 -->
        <el-dialog :title="boxTitle" :visible.sync="dialogFormVisible" width="400px">
          <el-form ref="form1">
            <el-form-item label="会员类型:" prop="actLocation">
              <el-select v-model="vipType" placeholder="请选择会员类型" :label-width="formLabelWidth">
                <el-option v-for="(item, index) in memberType" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到期时间:" :label-width="formLabelWidth">
              <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期" style="color:#666">
              </el-date-picker>
            </el-form-item>
            <div class="dialog-footer" style="text-align:center;">
              <el-button @click="resetBox">取 消</el-button>
              <el-button type="primary" @click="submitBox">确 定</el-button>
            </div>
          </el-form>
        </el-dialog>
        <!-- 积分调整弹窗 -->
        <el-dialog :title="integralTitle" :visible.sync="integralVisible" width="300px">
          <el-form>
            <el-form-item label="当前数量:" :label-width="formLabelWidth">
               <el-input-number size="small" v-model="integralTemp"></el-input-number>
            </el-form-item>
           
            <div class="dialog-footer" style="text-align:center;">
              <el-button @click="integralResetBox()">取 消</el-button>
              <el-button type="primary" @click="integralSubmitBox()">确 定</el-button>
            </div>
          </el-form>
        </el-dialog>
        <!-- 抵用券调整弹窗 -->
        <el-dialog :title="couponTitle" :visible.sync="couponVisible" width="300px">
          <el-form>
            <el-form-item label="当前数量:" :label-width="formLabelWidth">
               <el-input-number size="small" v-model="couponTemp"></el-input-number>
            </el-form-item>
           
            <div class="dialog-footer" style="text-align:center;">
              <el-button @click="couponResetBox()">取 消</el-button>
              <el-button type="primary" @click="couponSubmitBox()">确 定</el-button>
            </div>
          </el-form>
        </el-dialog>
      </div>

    </div>
  </el-main>
</template>

<script>
import util from '@/libs/util'
export default {
  name: 'UserDetail',
  data() {
    return {
      tableOne: [],
      tableTwo: [],
      tableThree: [],
      dialogFormVisible: false, //修改会员类型弹窗
      integralVisible:false,//积分调整弹窗  
      couponVisible:false,//抵用券调整弹窗
      boxTitle: '修改会员类型', //弹窗标题
      integralTitle: '积分调整', //抵用券调整标题
      couponTitle: '抵用券调整', //抵用券调整标题
      integralTemp:0,//积分初始数字
      couponTemp:0,//优惠券初始数字
      form: {
        userId: JSON.parse(this.$route.query.row).userId,
        vipType: '',
        endTime: '' //到期时间
      },
      memberType: [
        { label: '畅跑会员', value: 1 },
        { label: '年费会员', value: 0 }
      ], //会员类型
      formLabelWidth: '72px',
      head: {
        nickName: '',
        regTime: '',
        lastLogin: '',
        integral: '',
        coupon: '',
        actTime: '',
        vip1: '',
        vip2: '',
        headPic: ''
      },
      detailId: 0,
      isShowBigImage: false,
      tableListBigImageUrl: '',
      id: JSON.parse(this.$route.query.row).userId
    }
  },
  filters: {
    timeFilters(date) {
      if (date) {
        let dateee = new Date(date).toJSON()
        let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return newDate.substring(0, 10)
      }
    },
    timeFiltersTime(date) {
      if (date) {
        let dateee = new Date(date).toJSON()
        let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return newDate
      }
    },
    actFilter(status) {
      switch (status) {
        case 1:
          return '是'
        case 0:
          return '否'
        default:
          return '--'
      }
    },
    carFilter(val) {
      switch (val) {
        case 1:
          return '默认'
        case 0:
          return '非默认'
        default:
          return ''
      }
    }
  },
  computed: {
    vipType: {
      get: function() {
        return this.form.vipType
      },
      set: function(val) {
        this.form.vipType = val
      }
    }
  },
  created: function() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      let params = new URLSearchParams()
      params.append('userId', this.id)
      //个人信息
      util.ajax
        .get('user/queryUserInfo?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.tableOne = res.data.data
            this.head.vip1 = this.tableOne[0].vip1
            this.head.vip2 = this.tableOne[0].vip2
            this.head.regTime = res.data.data[0].regTime
            this.head.lastLogin = res.data.data[0].lastLogin
            this.head.endTime = '' //到期时间
            this.head.headPic = res.data.data[0].headPic
            this.head.integral = res.data.data[0].integral //积分
            this.head.coupon = res.data.data[0].coupon //积分  actTime
            // console.log(parseInt(res.data.data[0].actTime))
            // console.log(res.data.data[0].actTime)
            this.head.actTime = parseInt(res.data.data[0].actTime)? res.data.data[0].actTime:0//积分  actTime
            if (!res.data.data[0].nickName) {
              this.head.nickName = ''
            } else {
              this.head.nickName = res.data.data[0].nickName
            }
            this.initMemberType(this.tableOne[0])
          } else if (parseInt(res.data.code) == 20007) {
            this.$router.push('/Login')
          }
        })
        .catch(function(err) {
          console.log(err)
        })

      //用户赛车登记
      util.ajax
        .get('user/queryUserCarInfo?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.tableTwo = res.data.data.data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
      //用户订单
      let order = JSON.stringify({ userId: this.id })
      util.ajax
        .post('user/queryUserActivityOrder', order)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.tableThree = res.data.data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    showBigImage(url) {
      this.tableListBigImageUrl = url
      this.isShowBigImage = true
    },
    // 初始化用户类型信息
    initMemberType(userInfo) {
      if (userInfo.vip1) {
        //年费会员
        userInfo.endTime = userInfo.vip1Endtime
        userInfo.vipType = 0
      } else {
        //畅跑会员
        userInfo.endTime = userInfo.vip2Endtime
        userInfo.vipType = 1
      }
      this.vipType = userInfo.vipType || 0
      this.form.endTime = userInfo.endTime || ''
      // 后面的base 数据  后台改好了以后 删掉 现在加上只是为了不报错
    },
    handleBigImageClose(done) {
      this.tableListBigImageUrl = ''
      done()
    },
    //修改会员类型
    fixedBox() {
      this.dialogFormVisible = true
    },
    resetBox() {
      this.initMemberType(this.tableOne[0])
      this.dialogFormVisible = false
    },
    //积分调整弹窗
    integralBox() {
      this.integralVisible = true
      if(this.tableOne[0].integral){
          this.integralTemp=this.tableOne[0].integral
      }else{
          this.integralTemp=0
      }
    },
    integralResetBox() {
      this.integralTemp=this.tableOne[0].integral//取消按钮，关闭窗口，让积分恢复原来的值
      this.integralVisible = false
    },
    integralSubmitBox(){
      let params = new URLSearchParams()
      params.append('userId', this.tableOne[0].userId)
      params.append('integral', this.integralTemp)
      util.ajax
        .get('user/updateIntegral?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.integralVisible = false
            this.$message('积分调整成功！')
            this.getTableData()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    //抵用券调整弹窗
    couponBox() {
      this.couponVisible = true
      if(this.tableOne[0].integral){
          this.integralTemp=this.tableOne[0].integral
      }else{
          this.integralTemp=0
      }
    },
    couponResetBox() {
      this.couponTemp=this.tableOne[0].coupon//取消按钮，关闭窗口，让积分恢复原来的值
      this.couponVisible = false
    },
    couponSubmitBox(){
      
      let params = new URLSearchParams()
      params.append('userId', this.tableOne[0].userId)
      params.append('coupon', this.couponTemp)
      util.ajax
        .get('user/updateCoupon?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.couponVisible = false
            this.$message('抵用券调整成功！')
            this.getTableData()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    submitBox() {
      let params = this.form
      params.endTime = new Date(params.endTime).getTime()
      util.ajax
        .post('/user/updateVip', params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.$message('修改成功')
            this.dialogFormVisible = false
            let params = new URLSearchParams()
            params.append('userId', this.id)
            //个人信息id
            util.ajax
              .get('user/queryUserInfo?' + params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.tableOne = res.data.data
                  this.head.vip1 = this.tableOne[0].vip1
                  this.head.vip2 = this.tableOne[0].vip2
                  this.head.regTime = res.data.data[0].regTime
                  this.head.lastLogin = res.data.data[0].lastLogin
                  this.head.endTime = '' //到期时间
                  if (!res.data.data[0].trueName) {
                    this.head.trueName = ''
                  } else {
                    this.head.trueName = res.data.data[0].trueName
                  }
                  this.initMemberType(this.tableOne[0])
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },

    //删除数据
    deleteTr1(userCarId) {
      let params = new URLSearchParams()
      params.append('userCarId', userCarId)
      util.ajax
        .get('user/deleteUserCarInfo?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.$message('删除成功')
            this.getTableData()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    deleteTr2(orderId) {
      let params = new URLSearchParams()
      params.append('orderId', orderId)
      util.ajax
        .get('user/deleteUserActivityOrder?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.$message('删除成功')
            this.getTableData()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.search {
  width: 30%;
  float: left;
  height: 50px;
}
.search_btn {
  width: 10%;
  float: right;
}
.s_lie {
  float: left;
  font-size: 14px;
  line-height: 32px;
}
.s_input {
  width: 90px;
  float: left;
}
.el-input__inner {
  height: 32px !important;
}
.main_inner {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
}
.tab_btn {
  width: 100%;
  height: 40px;
  overflow: hidden;
  background-color: #fff;
}
.tab_btn .tb {
  float: left;
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
  padding: 3px 10px;
  height: 28px;
  line-height: 28px;
  background-color: #fff;
  margin-right: 1px;
  font-size: 14px;
}
.tab_btn .tb.nactive {
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
}
.inf_box {
  color: #333;
  font-size: 16px;
  line-height: 22px;
}

.inf_box .user_name {
  margin-right: 6px;
  font-size: 16px;
}
.act_name {
  margin-right: 8px;
  font-size: 18px;
  width: 90px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; /*文本不换行*/
}
.ui_list {
  float: left;
  width: 30%;
}
.mi_title {
  color: #333;
  font-size: 20px;
  height: 60px;
  line-height: 60px;
  padding-left: 4px;
}
.user-detail >>> .el-dialog .el-dialog__body div.img-wrap {
  text-align: center;
}

.user-detail >>> .el-dialog .el-dialog__body div.img-wrap img {
  width: 100%;
}
.user_btn {
  border-radius: 4px;
  padding: 3px 14px;
  height: 22px;
  line-height: 22px;
  background-color: #fff;
  background-color: rgba(24, 144, 255, 1);
  margin-left: 20px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  float: left;
  margin-top: -4px;
}
</style>
