<template>
  <el-main>
    <div class="user-manage" v-if="showToogle">
      <div class="search-wrap">
        <el-form :model="search" label-width="70px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="手机号：">
                <el-input v-model="search.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="昵称：">
                <el-input v-model="search.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="注册时间：" label-width="106px">
                <el-date-picker v-model="search.regTime" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" style="width:85%">
                </el-date-picker>
              </el-form-item>

            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tab_btn">
        <span class="tb" :class="{'nactive': search.tabName === 'all'}" @click="chooseTab('all')">全部</span>
        <span class="tb" :class="{'nactive': search.tabName === 'common'}" @click="chooseTab('common')">普通会员</span>
        <span class="tb" :class="{'nactive': search.tabName === 'vip'}" @click="chooseTab('vip')">vip会员</span>
      </div>

      <div class="table-wrap">
        <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange">
          <!-- <el-table-column prop="id" label="id">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column> -->
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="trueName" label="真实姓名">
          </el-table-column>
          <el-table-column prop="gender" label="性别">
            <template slot-scope="scope">
              {{parseInt(scope.row.gender)%2==0?'女':'男'}}
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="昵称">
          </el-table-column>
          <el-table-column prop="wechat" label="微信id">
          </el-table-column>
          <el-table-column prop="vipType" label="vip状态" width="90">
          </el-table-column>
          <el-table-column prop="regTime" label="注册时间">
            <template slot-scope="scope">
              {{scope.row.regTime|timeFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="lastLogin" label="最近登录时间" width="154px">
            <template slot-scope="scope">
              {{scope.row.lastLogin|timeFiltersTime}}
            </template>
          </el-table-column>
          <el-table-column prop="cars" sortable label="绑定赛车">
          </el-table-column>
          <el-table-column prop="userCount" sortable label="参加活动次数">
          </el-table-column>
          <el-table-column prop="rem" label="备注">
          </el-table-column>
          <el-table-column label="操作" fixed='right'>
            <template slot-scope="scope">
              <el-button @click.native.prevent="handleClickView(scope.row)" type="text" size="small">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="totalTr">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 用户详情部分 -->
    <div class="user-detail" v-else>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-avatar :src="this.head.headPic" style="width:100px;height:100px;"></el-avatar>
        </el-col>
        <el-col :span="21" class="inf_box">
          <div style="margin-bottom:20px; position:relative;width:100%; height:16px">
            <span class="user_name" v-if="this.head.trueName">{{this.head.trueName+','}}</span>
            <span v-if="this.head.vip1">年费会员： {{this.tableDetail[0].vip1Endtime|timeFilters}}</span>
            <span v-if="this.head.vip2">畅跑会员： {{this.tableDetail[0].vip2Endtime|timeFilters}}</span>
            <span class="user_btn" @click="fixedBox">修改会员类型</span>
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
              <span class="user_inf">{{this.head.youhuiquan}}</span>
            </div>
            <div class="ui_list">
              <span class="user_name">参加活动次数：</span>
              <span class="user_inf">{{this.head.canjiacishu}}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <div>
        <p class="mi_title">个人信息</p>
        <el-table :data="tableDetail" border style="width: 98%">
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
      <!-- 弹窗 -->
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
    </div>
  </el-main>
</template>
<script>
import util from '@/libs/util'
export default {
  name: 'UserManage',
  data() {
    return {
      search: {
        phone: '',
        nickName: '',
        regTime: [],
        tabName: 'all',
        vip1: '',
        vip2: '',
        vip1Date: '',
        vip2Date: ''
      },
      pagination: {
        pageNum: 1,
        pageSize: 20
      },
      totalTr: 1000, // 每次调用接口以后  用后台的total值 重新赋值
      sort: {
        prop: 'date',
        order: 'descending'
      },
      showToogle: true,
      tableData: [],
      //用户详情
      tableDetail: [],
      tableTwo: [],
      tableThree: [],
      dialogFormVisible: false,
      boxTitle: '修改会员类型', //弹窗标题
      form: {
        userId: '',
        vipType: '',
        endTime: '' //到期时间
      },
      memberType: [
        { label: '畅跑会员', value: 1 },
        { label: '年费会员', value: 0 }
      ], //会员类型
      formLabelWidth: '72px',
      head: {
        trueName: '',
        regTime: '',
        lastLogin: '',
        integral: '',
        youhuiquan: '',
        canjiacishu: '',
        vip1: '',
        vip2: '',
        headPic: ''
      },
      detailId: 0,
      isShowBigImage: false,
      tableListBigImageUrl: ''
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

  mounted: function() {},

  methods: {
    chooseTab(tabName) {
        this.search.tabName = tabName
        switch (tabName){
            case 'all':
                this.search.vip1=null
                this.search.vip2=null
                break;
            case 'common':
                this.search.vip1=1
                this.search.vip2=null
                break;
            case 'vip':
                this.search.vip1=null
                this.search.vip2=1
                break;
        }
      
      this.getTableData()
    },
    showBigImage(url) {
      this.tableListBigImageUrl = url
      this.isShowBigImage = true
    },
    handleBigImageClose(done) {
      this.tableListBigImageUrl = ''
      done()
    },

    handleSortChange(sort) {
      this.sort = sort
    },

    handleCurrentChange(currentPage) {
      this.pagination.pageNum = currentPage
      // 调用接口
      this.getTableData()
    },

    getSearchParams() {
      // 根据后台字段 对应修改
      // 最好是和后台保持一致

      // 处理 regTime 成后台接受的时间格式
      this.search.regStartTime = this.search.regTime[0] // [startTime, endTime]
      this.search.regEndTime = this.search.regTime[0]
      let params = Object.assign(this.search, this.pagination, this.sort)
      return params
    },

    getTableData() {
      var gather = this.getSearchParams()
      // ajax
      util.ajax
        .post('user/queryUser', gather)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            res.data.data.dataList.forEach((item, index, array) => {
              if (item.vip1 && item.vip2) {
                item.vipType = '年费会员 畅跑会员'
              } else {
                if (item.vip1) {
                  item.vipType = '年费会员'
                }
                if (item.vip2) {
                  item.vipType = '畅跑会员' 
                }
              }
            })
            this.tableData = res.data.data.dataList
            let total = res.data.data.totalSize || 0
            this.handleGetTableData(total)
          } else if (parseInt(res.data.code) == 20007) {
            this.$router.push('/Login')
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },

    handleGetTableData(total) {
      this.totalTr = total
    },
    //用户详情部分
    handleClickView(row) {
      this.$router.push({
        path: '/UserDetail',
        query: { row: JSON.stringify(row) }
      })
      // this.detailId = index
      // this.showToogle = false
      // this.form.userId = index
      // let params = new URLSearchParams()
      // params.append('userId', index)
      // //个人信息
      // util.ajax
      //   .get('user/queryUserInfo?' + params)
      //   .then(res => {
      //     if (parseInt(res.data.code) == 301000) {
      //       this.tableDetail = res.data.data
      //       this.pic = 'http://test.onecar.dp20.cn/api/v1.0/' + this.tableDetail[0].headPic
      //       this.head.vip1 = this.tableDetail[0].vip1
      //       this.head.vip2 = this.tableDetail[0].vip2
      //       this.head.regTime = res.data.data[0].regTime
      //       this.head.lastLogin = res.data.data[0].lastLogin
      //       this.head.endTime = '' //到期时间
      //       this.head.headPic = res.data.data[0].headPic
      //       if (!res.data.data[0].trueName) {
      //         this.head.trueName = ''
      //       } else {
      //         this.head.trueName = res.data.data[0].trueName
      //       }
      //       this.initMemberType(this.tableDetail[0])
      //     }
      //   })
      //   .catch(function(err) {
      //     console.log(err)
      //   })

      // //用户赛车登记
      // util.ajax
      //   .get('user/queryUserCarInfo?' + params)
      //   .then(res => {
      //     if (parseInt(res.data.code) == 301000) {
      //       this.tableTwo = res.data.data.data
      //       this.tableTwo.forEach((item, index) => {
      //         item.picList[0].url = `http://test.onecar.dp20.cn/api/v1.0/file/downFile?url=${item.picList[0].url}&name=${item.picList[0].name}`
      //       })
      //       // this.tableTwo = template
      //     }
      //   })
      //   .catch(function(err) {
      //     console.log(err)
      //   })
      // //用户订单
      // let order = JSON.stringify({ userId: index })
      // util.ajax
      //   .post('user/queryUserActivityOrder', order)
      //   .then(res => {
      //     if (parseInt(res.data.code) == 301000) {
      //       this.tableThree = res.data.data
      //     }
      //   })
      //   .catch(function(err) {
      //     console.log(err)
      //   })
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
    //修改会员类型
    fixedBox() {
      this.dialogFormVisible = true
    },
    resetBox() {
      this.initMemberType(this.tableDetail[0])
      this.dialogFormVisible = false
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
            params.append('userId', this.detailId)
            //个人信息
            util.ajax
              .get('user/queryUserInfo?' + params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.tableDetail = res.data.data
                  this.head.vip1 = this.tableDetail[0].vip1
                  this.head.vip2 = this.tableDetail[0].vip2
                  this.head.regTime = res.data.data[0].regTime
                  this.head.lastLogin = res.data.data[0].lastLogin
                  this.head.endTime = '' //到期时间
                  if (!res.data.data[0].trueName) {
                    this.head.trueName = ''
                  } else {
                    this.head.trueName = res.data.data[0].trueName
                  }
                  this.initMemberType(this.tableDetail[0])
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

.user-manage {
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

.user-manage .table-wrap {
  padding-bottom: 100px;
}

.user-manage .pagination-wrap {
  padding-top: 30px;
}

.user-manage .el-pagination {
  float: right;
  margin-right: 40px;
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
.tab_btn .tb:hover {
  cursor: pointer;
}
/* 用户详情部分 */
.user-detail {
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
.user_btn {
  border-radius: 4px;
  padding: 3px 14px;
  height: 22px;
  line-height: 22px;
  background-color: #fff;
  margin-right: 1px;
  background-color: rgba(24, 144, 255, 1);
  position: absolute;
  left: 326px;
  top: -4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
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
/* .el-input__inner {
  height: 32px !important;
} */
.inf_box {
  color: #333;
  font-size: 16px;
  line-height: 22px;
}

.inf_box .user_name {
  margin-right: 6px;
  font-size: 18px;
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
</style>
