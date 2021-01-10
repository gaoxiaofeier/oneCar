<template>
  <el-main>
    <div class="activity-manager-list">
      <div class="search-wrap">
        <el-form :model="search" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="昵称：">
                <el-input v-model="search.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="赛道：" label-width="80px">
                <el-select v-model="search.trackId" placeholder="请选择" style="width:270px;">
                  <el-option v-for="(item ,index) of this.saidao_w" :key="index+'a'" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="2">
              <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <div class="add_btn" @click="changOpenBox('add')">新增记录</div>
        <!-- <div class="import_btn" @click="importTable()">导入表格</div> -->
      </div>
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" @sort-change="handleSortChange" border>
          <!-- <el-table-column prop="id" label="id" width="100">
          </el-table-column> -->
          <el-table-column prop="nickName" label="昵称" width="100">
          </el-table-column>
          <el-table-column prop="trackName" label="赛道" width="100">
          </el-table-column>

          <el-table-column sortable prop="lapTime" label="圈速" width="90">
            <template slot-scope="scope" v-if="scope.row.lapTime">
              {{scope.row.lapTime.substr(0,2)+':'+scope.row.lapTime.substr(2,2)+'.'+scope.row.lapTime.substr(4)}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop='canJiaCheLiang' label="参赛车辆" width="200">
          </el-table-column> -->
          <el-table-column label="参赛车辆" width="180">
            <template slot-scope="scope">
              <!-- 品牌车系，车型，年份，排量 -->
              <!-- {{scope.row.carBrand+','+scope.row.carType+','+scope.row.year+','+scope.row.ed}} -->
              {{scope.row|carsFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创造时间" min-width="96">
            <template slot-scope="scope">
              {{scope.row.createTime|timeFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="inputTime" label="录入时间" min-width="104">
            <template slot-scope="scope">
              {{scope.row.inputTime|timeFiltersTime}}
            </template>
          </el-table-column>
          <el-table-column prop="rem" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="modifyOpenBox(scope.row)">
                修改
              </el-button>
              <el-button type="text" size="small" style="color:red;margin-left:0px;" @click="deleteTr(scope.row.id)">
                删除
              </el-button>
            </template>

          </el-table-column>
        </el-table>

        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="totalTr">
          </el-pagination>
        </div>
      </div>
      <!-- 弹窗 -->
      <el-dialog :title="boxTitle" :visible.sync="dialogFormVisible" width="400px">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="车手：" :label-width="formLabelWidth">
            <el-input v-model="form.nickName" autocomplete="off" height="20px"></el-input>
          </el-form-item>
          <el-form-item label="品牌：" :label-width="formLabelWidth">
            <el-input v-model="form.carName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="车系：" :label-width="formLabelWidth">
            <el-input v-model="form.carBrand" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="车型：" :label-width="formLabelWidth">
            <el-input v-model="form.carType" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年份：" :label-width="formLabelWidth">
            <el-input v-model="form.year" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排量：" :label-width="formLabelWidth">
            <el-input v-model="form.ed" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="圈速：" prop="lapTime" :label-width="formLabelWidth">
            <el-input v-model="form.lapTime" class="ipt_width" placeholder="请输入圈速  示例：00:00.000"></el-input>
          </el-form-item>
          <el-form-item label="赛道：" prop="trackId" :label-width="formLabelWidth">
            <el-select v-model="form.trackId" placeholder="请选择赛道">
              <el-option v-for="(item ,index) of this.saidao_w" :key="index+'b'" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.rem"></el-input>
          </el-form-item>
          <el-form-item style="display: flex;justify-content: flex-end">
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            <el-button @click="resetForm('form')">取 消</el-button>
          </el-form-item>

        </el-form>

      </el-dialog>
    </div>
  </el-main>

</template>

<script>
import util from '@/libs/util'
export default {
  name: 'SpeedRanking',
  data() {
    const item = {
      tackId: '9',
      nickName: '王小虎',
      sandao: '3', //表无
      lapName: '52', //圈速
      canJiaCheLiang: '宝马', //表无
      creatTime: '2019-12-30 15:41:23',
      addTime: '2020-1-10 15:41:23',
      rem: '挺好的',
      vehicleSystem: '奔驰',
      vehicleType: 'x1.suv',
      year: ' 2018',
      emissions: ' 200'
    }
    return {
      search: {
        nickName: '',
        trackId: ''
      },
      saidao_w: [], // [赛道1，赛道2]
      pagination: {
        pageNum: 1,
        pageSize: 20
      },
      totalTr: 1000, // 每次调用接口以后  用后台的total值 重新赋值
      boxTitle: '新增记录', //弹窗标题
      sort: {
        prop: '',
        order: 'ascending' //ascending
      },
      dialogFormVisible: false,
      form: {
        nickName: '', //赛道
        carBrand: '', //车牌
        carName: '', //车系
        carType: '', //车型
        year: '', //年份
        ed: '', //排量
        lapTime: '', //圈速
        trackId: ''
      },
      rules: {
        lapTime: [
          { pattern: /^\d{2}\:\d{2}\.\d{3}$/, message: '请输入mm:ss.sss格式', trigger: 'blur' }
        ],
        trackId: [{ required: true, message: '赛道不能为空', trigger: 'blur' }]
      },
      formLabelWidth: '70px',
      item: item,
      tableData: []
    }
  },
  filters: {
    carsFilter(status) {
      if (status.carBrand == '' && status.carType == '' && status.year == '' && status.ed == '') {
        return ''
      } else {
        return status.carBrand
          ? status.carBrand
          : '' + status.carType
          ? status.carType
          : '' + status.ed
          ? status.ed
          : '' + status.year
          ? status.ed
          : ''
      }
    },
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
  created: function() {
    this.getTableData()
    this.getTruck()
  },

  mounted: function() {},

  methods: {
    handleClickView(index, row) {
      if (arguments.length) {
        // // https://www.jianshu.com/p/5dff306fdb0fconsole.log(argumentus)
        this.$router.push({
          path: '/ActivityDetail',
          query: { row: JSON.parse(JSON.stringify(row)) }
        })
      } else {
        this.$router.push({
          path: '/ActivityChange'
        })
      }
    },
    handleSortChange(sort) {
      this.sort = sort
    },

    handleCurrentChange(pageNum) {
      this.pagination.pageNum = pageNum
      // 调用接口
      this.getTableData()
    },
    getSearchParams() {
      // 根据后台字段 对应修改

      // 处理 regTime 成后台接受的时间格式   startTime: '',
      // endTime: '',
      let params = Object.assign(this.search, this.pagination, this.sort)
      return params
    },

    getTableData() {
      let gather = this.getSearchParams()

      let params = new URLSearchParams()
      params.append('pageNum', gather.pageNum)
      params.append('pageSize', gather.pageSize)
      params.append('nickName', gather.nickName)
      params.append('trackId', gather.trackId)
      params.append('order', gather.order)
      util.ajax
        .get('trackRace/queryTrackRace?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.tableData = res.data.data.dataList
            this.tableData.forEach((item, index) => {
              for (let key in item) {
                if (!item[key]) {
                  item[key] = ''
                }
              }
            })
            // this.saidao = res.data.data.saidao
            //分页
            let total = res.data.data.totalSize || 0
            this.pagination.pageSize = res.data.data.totalPage || 10
            this.handleGetTableData(total)
          } else if (parseInt(res.data.code) == 20007) {
            this.$router.push('/Login')
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getTruck() {
      let params = new URLSearchParams()
      params.append('province', '')
      params.append('city', '')
      params.append('trackName', '')
      params.append('pageNum', 1)
      params.append('pageSize', 10)
      util.ajax
        .get('track/queryTrack?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            res.data.data.dataList.forEach((item, index) => {
              let temp = { value: item.trackId, label: item.trackName }
              this.saidao_w.push(temp)
            })
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleGetTableData(total) {
      this.totalTr = total
    },

    //点击新增修改按钮
    changOpenBox(type, changeId) {
      this.dialogFormVisible = true
      //弹窗标题字要改 新增
      this.boxTitle = '新增记录'
      this.form = {
        nickName: '', //赛道
        carBrand: '', //车牌
        carName: '', //车系
        carType: '', //车型
        year: '', //年份
        ed: '', //排量
        lapTime: '', //圈速
        trackId: ''
      }
    },
    modifyOpenBox(row) {
        console.log(row)
      this.boxTitle = '修改记录'
      let lap = row.lapTime
      if (lap) {
        this.form.lapTime = lap.substr(0, 2) + ':' + lap.substr(2, 2) + '.' + lap.substr(4)
      } else {
        this.form.lapTime = ''
      }
      this.form.nickName = row.nickName
      this.form.carBrand = row.carBrand
      this.form.nickName = row.nickName
      this.form.carName = row.carName
      this.form.carType = row.carType
      this.form.year = row.year
      this.form.trackId = row.trackId
      this.form.id = row.id
      this.dialogFormVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.lapTime) {
            this.form.lapTime = this.form.lapTime
              .split(':')
              .join('')
              .split('.')
              .join('')
          }
          let params = JSON.stringify(this.form)
          if (this.boxTitle == '新增记录') {
            util.ajax
              .post('trackRace/increaseTrackRace', params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.dialogFormVisible = false
                  this.getTableData()
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          } else {
            util.ajax
              .post('trackRace/updateTrackRace', params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.dialogFormVisible = false
                  this.getTableData()
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    //删除数据
    deleteTr(deleteId) {
      let params = JSON.stringify({
        id: deleteId
      })
      util.ajax
        .post('trackRace/deleteTrackRace', params)
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
    //导入表格
    importTable() {
      //等后台
    }
  }
}
</script>

<style scoped>
.activity-manager-list .search {
  width: 30%;
  float: left;
  height: 50px;
}
.activity-manager-list .search_btn {
  width: 10%;
  float: right;
}

.activity-manager-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px 20px 0px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
}

.activity-manager-list .table-wrap {
  padding-bottom: 100px;
}

.activity-manager-list .pagination-wrap {
  padding-top: 30px;
}

.activity-manager-list .el-pagination {
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
.add_btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 14px;
  margin: 10px 0 20px 0;
  float: left;
}
.add_btn:hover {
  cursor: pointer;
}
.import_btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 14px;
  margin: 10px 0 20px 0;
  float: left;
  margin-left: 40px;
}
.import_btn:hover {
  cursor: pointer;
}
.el-form-item {
  margin-bottom: 20px;
  width: 300px;
}
.el-form-item input.el-input__inner {
  height: 20px !important;
}
</style>
