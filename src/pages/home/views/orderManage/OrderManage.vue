<template>
  <el-main>
    <div class="user-manage">
      <div class="search-wrap">
        <el-form :model="search" label-width="80px" label-position="left">
          <el-row>
            <el-col :span="5">
              <el-form-item label="手机号：" label-width="80px">
                <el-input v-model="search.phone" style="width:150px;"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5" :offset="1">
              <el-form-item label="昵称：" label-width="60px">
                <el-input v-model="search.nickName" style="width:150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="活动名：">
                <el-input v-model="search.activityName" style="width:150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="活动时间：" label-width="90px">
                <el-date-picker style="margin-left:-10px" v-model="search.actTime" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="3">
              <el-form-item label="购买时间：" label-width="90px">
                <el-date-picker v-model="search.payTime" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row style="padding-left:0px;margin-bottom:10px;">
        <div class="tab_btn">
          <span class="tb" :class="{'nactive': search.payType === ''}" @click="chooseTab1('')">全部</span>
          <span class="tb" :class="{'nactive': search.payType === 'common'}" @click="chooseTab1('common')">普通会员</span>
          <span class="tb" :class="{'nactive': search.payType === 'vip'}" @click="chooseTab1('vip')">vip会员</span>
        </div>
        <div class="tab_btn pay">
          <span class="tb" :class="{'nactive': search.ifAct === ''}" @click="chooseTab2('')">全部</span>
          <span class="tb" :class="{'nactive': search.ifAct === '1'}" @click="chooseTab2('1')">参加活动</span>
          <span class="tb" :class="{'nactive': search.ifAct === '0'}" @click="chooseTab2('0')">未参加活动</span>
        </div>
      </el-row>
      <div class="table-wrap">
        <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange">
          <!-- <el-table-column prop="Id" label="Id" width="80">
          </el-table-column> -->
          <el-table-column prop="phone" label="手机号" width="120">
          </el-table-column>
          <el-table-column prop="nickName" label="昵称" width="120">
          </el-table-column>
          <el-table-column prop="actName" label="活动名称">
          </el-table-column>
          <el-table-column prop="actLocation" label="活动地点" width="120">
          </el-table-column>
          <el-table-column prop="date" label="活动日期">
            <template slot-scope="scope">
              {{scope.row.date|timeFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="buyTime" label="购买时间" width="102px" sortable>
            <template slot-scope="scope">
              {{scope.row.buyTime|timeFiltersTime}}
            </template>
          </el-table-column>
          <el-table-column label="参赛车辆" width="180">
            <template slot-scope="scope">
              <!-- 品牌，车型，年份，排量 -->
              {{scope.row.carBrand+'，'+scope.row.carType+'，'+scope.row.carYear+'，'+scope.row.ed}}
            </template>
          </el-table-column>
          <el-table-column prop="buyType" label="支付方式" width="110" sortable>
          </el-table-column>
          <el-table-column prop="money" label="支付金额" width="80">
            <template slot-scope="scope">
              {{(scope.row.money/100).toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column prop="ifAct" label="是否参与" width="80">
          </el-table-column>
          <el-table-column prop="recommend" label="备注">
          </el-table-column>
          <!-- <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.native.prevent="handleClickView(scope.$index, scope.row)" type="text" size="small">
                查看
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </el-main>
</template>
<script>
import util from '@/libs/util'
export default {
  name: 'OrderManage',
  data() {
    const item = {
      orderId: '2', //订单id
      phone: '15021445685', //手机号
      nickName: 'lili', //昵称
      actName: '赛车', //活动名称
      actAddress: '上海xxxxxxx', //label="活动地点"
      actDate: '2019-12-30', //活动日期
      byeTime: '2019-12-30', //购买时间
      car: '宝马', //参赛车辆
      byeType: '支付宝', //支付方式
      money: '20000', //支付金额
      partake: '是', //是否参与
      rem: '哒哒哒', //备注"
      actTime: []
    }
    return {
      search: {
        phone: '',
        activityName: '',
        nickName: '',
        payType: '', //会员状态tab:普通会员,vip会员
        ifAct: '', //参加活动状态tab:参加活动:1,未参加活动:0
        actTime: [],
        payTime: []
      },

      pagination: {
        pageNum: 1,
        pageSize: 20,
        total: 1000 // 每次调用接口以后  用后台的total值 重新赋值
      },
      sort: {
        prop: '',
        order: ''
      },
      order: '',
      payOrder: '',
      item: item,
      tableData: []
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
    }
  },
  watch: {
    sort: {
      handler(val, oldVal) {
        if (val.prop == 'buyTime') {
          if (val.order == 'ascending') {
            this.order = 'ascending'
          } else {
            this.order = ''
          }
        } else if (val.prop == 'buyType') {
          if (val.order == 'ascending') {
            this.payOrder = 'ascending'
          } else {
            this.payOrder = ''
          }
        } else {
          this.order = ''
          this.payOrder = ''
        }
      },
      deep: true
    }
  },

  created: function() {
    this.getTableData()
  },

  mounted: function() {},

  methods: {
    chooseTab1(tabName) {
      this.search.payType = tabName
      this.getTableData()
    },
    chooseTab2(tabName) {
      this.search.ifAct = tabName
      this.getTableData()
    },

    handleClickView(index, row) {
      // console.log('index', index)
      //console.log('row', row)
      // https://www.jianshu.com/p/5dff306fdb0f
      this.$router.push({ path: '/UserDetail', query: { row: JSON.parse(JSON.stringify(row)) } })
    },

    handleSortChange(sort) {
      this.sort = sort
    },

    handleCurrentChange(currentPage) {
      // console.log(currentPage)
      this.pagination.pageNum = currentPage
      // 调用接口
      this.getTableData()
    },

    getSearchParams() {
      // 根据后台字段 对应修改
      // 最好是和后台保持一致

      // 处理 regTime 成后台接受的时间格式
      if (this.search.actTime) {
        this.search.activityStartTime = this.search.actTime[0]
        this.search.activityEndTime = this.search.actTime[1]
      } else {
        this.search.activityStartTime = ''
        this.search.activityEndTime = ''
      }
      if (this.search.payTime) {
        this.search.buyStartTime = this.search.payTime[0]
        this.search.buyEndTime = this.search.payTime[1]
      }
      let params = Object.assign(this.search, this.pagination)
      return params
    },
    p(s) {
      return s < 10 ? '0' + s : s
    },
    toogleDate(dd) {
      let d = new Date(dd)
      let resDate = d.getFullYear() + '-' + this.p(d.getMonth() + 1) + '-' + this.p(d.getDate())
      return resDate
    },
    getTableData() {
      var gather = this.getSearchParams()
      // var d = new Date('Wed Dec 04 2019 00:00:00 GMT+0800 (中国标准时间)')
      // console.log(this.order, this.payOrder)
      //console.log(this.order)
      let params = JSON.stringify({
        pageNum: gather.pageNum,
        pageSize: gather.pageSize,
        phone: gather.phone,
        activityName: gather.activityName,
        nickName: gather.nickName,
        payType: gather.payType, //会员状态tab:普通会员,vip会员
        ifAct: gather.ifAct, //参加活动状态tab:参加活动:1,未参加活动:0
        activityStartTime: gather.activityStartTime ? gather.activityStartTime : '',
        activityEndTime: gather.activityEndTime ? gather.activityEndTime : '',
        buyStartTime: gather.buyStartTime ? gather.buyStartTime : '',
        buyEndTime: gather.buyEndTime ? gather.buyEndTime : '',
        order: this.order,
        payorder: this.payOrder
      })
      util.ajax
        .post('activityOrder/queryActivityOrder', params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
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
      this.pagination.total = total
    }
  }
}
</script>

<style scoped>
.user-manage .search {
  width: 30%;
  float: left;
  height: 50px;
}
.user-manage .search_btn {
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
  width: 300px;
  height: 40px;
  overflow: hidden;
  background-color: #fff;
  float: left;
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
</style>
