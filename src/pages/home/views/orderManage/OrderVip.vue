<template>
  <el-main>
    <div class="user-manage">
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
            <el-col :span="5">
              <el-form-item label="vip类型：" label-width="90px">
                <el-select v-model="search.vipType" placeholder="请选择类型">
                  <el-option label="全部会员" value=""></el-option>
                  <el-option label="年费会员" value="vip1"></el-option>
                  <el-option label="畅跑会员" value="vip2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="2">
              <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="tab_btn">
        <span class="tb" :class="{'nactive': search.tabName === 'all'}" @click="chooseTab('all')">全部</span>
        <span class="tb" :class="{'nactive': search.tabName === 'alipay'}" @click="chooseTab('alipay')">支付宝</span>
        <span class="tb" :class="{'nactive': search.tabName === 'wechart'}" @click="chooseTab('wechart')">微信</span>
      </div>

      <div class="table-wrap">
        <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange">
          <!-- <el-table-column prop="id" label="id">
          </el-table-column> -->
          <el-table-column label="手机号">
            <template slot-scope="scope">
              {{scope.row.user.phone}}
            </template>
          </el-table-column>
          <el-table-column label="昵称">
            <template slot-scope="scope">
              {{scope.row.user.nickName}}
            </template>
          </el-table-column>
          <!-- 后台没有vipType -->
          <el-table-column prop="vipType" label="vip类型">
          </el-table-column>
          <el-table-column prop="buyTime" label="购买时间" width="100px">
            <template slot-scope="scope">
              {{scope.row.buyTime|timeFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="vipEndTime" label="vip到期日" width="100px">
            <template slot-scope="scope">
              {{scope.row.vipEndTime|timeFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="buyType" sortable label="支付方式">
          </el-table-column>
          <el-table-column prop="money" label="支付金额" width="90">
            <template slot-scope="scope">
              {{(scope.row.money/100).toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column prop="rem" label="备注">
          </el-table-column>
        </el-table>
        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>

      </div>

    </div>
  </el-main>

</template>

<script>
import util from '@/libs/util'
export default {
  name: 'OrderVip',
  data() {
    const item = {
      orderId: '3', //id"
      phone: '3', //手机号"
      nickName: '3', //昵称
      vipTime: '3', //vip到期日
      payType: '3', //支付方式  ,排序
      vipType: '3', //vip类型
      byeTime: '3', //购买时间
      money: '3', //支付金额
      rem: '3' //备注
    }
    return {
      search: {
        phone: '',
        nickName: '',
        vipType: '', //vip类型:vip1是vip会员，1是畅跑会员  ''是全部会员
        tabName: 'all'
      },
      pagination: {
        pageNum: 1,
        pageSize: 20,
        total: 0 // 每次调用接口以后  用后台的total值 重新赋值
      },
      sort: {
        prop: 'date',
        order: 'descending'
      },
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
        return newDate
        return '--'
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
      this.getTableData()
    },

    handleClickView(index, row) {
      // https://www.jianshu.com/p/5dff306fdb0f
      this.$router.push({ path: '/UserDetail', query: { row: JSON.parse(JSON.stringify(row)) } })
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
      let params = Object.assign(this.search, this.pagination, this.sort)
      return params
    },

    getTableData() {
      var gather = this.getSearchParams()

      util.ajax
        .post('vipOrder/queryVipOrder', gather)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            res.data.data.dataList.forEach((item, index, array) => {
              if (item.user.vip1 && item.user.vip2) {
                item.vipType = '年费会员，畅跑会员'
              } else {
                if (item.user.vip1) {
                  item.vipType = '年费会员'
                }
                if (item.vip2) {
                  item.user.vipType = '畅跑会员'
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
  width: 100%;
  height: 40px;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 10px;
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
