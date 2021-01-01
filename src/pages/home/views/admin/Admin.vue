<template>
  <el-main>
    <div class="role-manage">
      <div class="tab_btn"><span class="tb nactive" @click="modify()">添加管理员</span></div>
      <div class="table-wrap">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="userName" label="账号">
          </el-table-column>
          <el-table-column prop="role" label="角色">
          </el-table-column>
          <el-table-column prop="power" label="权限">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="modify(scope.row)" type="text" size="small">
                修改
              </el-button>
              <el-button @click="deleteTr(scope.row)" type="text" size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="totalTr">
          </el-pagination>
        </div> -->
      </div>
      <!-- 弹窗 -->
      <el-dialog :title="boxTitle" :visible.sync="dialogFormVisible" width="580px">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="账号：" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="form.userName" autocomplete="off" height="20px"></el-input>
          </el-form-item>
          <el-form-item label="密码：" :label-width="formLabelWidth" prop="passWord">
            <el-input v-model="form.passWord" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色：" :label-width="formLabelWidth">
            <el-input v-model="form.role" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限：" :label-width="formLabelWidth">
            <el-radio-group v-model="powerForm" size="medium">
              <!-- 规定0为全部权限，1为部分权限 -->
              <el-radio border :label="0" style="border:0px">全部权限</el-radio>
              <el-radio border :label="1" style="border:0px">部分权限</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" :label-width="formLabelWidth">
            <el-checkbox-group v-model="form.permissionList" :min=1 style="border:1px dashed #DCDFE6; border-radius:4px;padding-left:10px;margin-top:-10px">
              <el-checkbox v-for="range in allPowerRange" :label="range" :key="range+'9'" style="width:80px">{{range}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item style="display: flex;justify-content: flex-end ">
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
  name: 'Admin',
  data() {
    return {
      tableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 20
      },
      totalTr: 0,
      boxTitle: '新增角色',
      dialogFormVisible: false,
      isIndeterminate: true,
      form: {
        userName: '',
        passWord: '',
        role: '',
        permissionList: this.detailPower
      },
      rules: {
        userName: [{ required: true, message: '账户名不能为空', trigger: 'blur' }],
        passWord: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
          // {
          //   pattern: /^(?=.*\d)(?=.*[A-Za-z])[\x20-\x7e]{6,8}$/,
          //   message: '密码必须为6~8位的数字和字母组合',
          //   trigger: 'blur'
          // }
        ]
      },
      powerForm: 0,
      allPowerRange: [
        '管理员',
        '用户管理',
        '赛车配置',
        '赛道录入',
        '活动管理',
        '订单管理',
        '赛道影像',
        '车速排名'
      ],
      formLabelWidth: '80px',
      detailPower: ['管理员']
    }
  },
  filters: {
    statusFilter(status) {
      switch (status) {
        case 0:
          return '未发布'
        case 1:
          return '已发布'
        default:
          return '--'
      }
    },
    timeFiltersTime(date) {
      if (date) {
        let dateee = new Date(date).toJSON()
        let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return newDate.substring(0, 10)
      }
    }
  },
  watch: {
    powerForm: {
      handler(val, oldVal) {
        if (parseInt(val) == 0) {
          this.form.permissionList = [
            '管理员',
            '用户管理',
            '赛车配置',
            '赛道录入',
            '活动管理',
            '订单管理',
            '赛道影像',
            '车速排名'
          ]
        } else {
          this.form.permissionList = this.detailPower
        }
      }
    }
  },
  created: function() {
    this.getTableData()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.boxTitle == '新增角色') {
            let params = JSON.stringify({
              userName: this.form.userName,
              passWord: this.form.passWord,
              role: this.form.role,
              permissionList: this.form.permissionList
            })
            util.ajax
              .post('admin/increaseAdmin', params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.getTableData()
                  this.dialogFormVisible = false
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          } else {
            let params = JSON.stringify(this.form)
            util.ajax
              .post('admin/updateAdmin', params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.getTableData()
                  this.dialogFormVisible = false
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
    handleCurrentChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.getTableData()
    },
    getTableData() {
      let params = new URLSearchParams()
      params.append('token', this.token)
      util.ajax
        .get('admin/queryAdmin') //.post('/admin')
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            res.data.data.forEach((item, index) => {
              if (item.permissionList) {
                if (item.permissionList.length == 8) {
                  item.power = '全部'
                } else {
                  item.power = '部分权限'
                }
              } else {
                item.power = ''
              }
            })
            this.tableData = res.data.data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleGetTableData(total) {
      this.totalTr = total
    },
    //新增修改弹窗部分
    modify(row) {
      if (arguments.length) {
        this.boxTitle = '修改角色'
        this.dialogFormVisible = true
        this.detailPower = ['用户管理']
        if (row.permissionList) {
          if (row.permissionList.length == 8) {
            this.powerForm = 0
          } else {
            this.powerForm = 1
            this.detailPower = row.permissionList
          }
        } else {
          this.powerForm = 1
          row.permissionList = this.detailPower
        }
        this.form = row
      } else {
        this.dialogFormVisible = true
        this.boxTitle = '新增角色'
        this.powerForm = 1
        this.form = {
          userName: '',
          passWord: '',
          role: '',
          permissionList: this.detailPower
        }
      }
    },
    //删除数据
    deleteTr(row) {
      let params = new URLSearchParams()
      params.append('id', row.id)
      util.ajax
        .get('admin/deleteAdmin?' + params)
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
.role-manage {
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
.role-manage .search {
  width: 30%;
  float: left;
  height: 50px;
}
.role-manage.search_btn {
  width: 10%;
  float: right;
}

.role-manage .table-wrap {
  padding-bottom: 100px;
  margin-top: 20px;
}

.role-manage .pagination-wrap {
  padding-top: 30px;
}

.role-manage .el-pagination {
  float: right;
  margin-right: 40px;
}
.ipt_width {
  width: 220px;
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
.tab_btn .tb:hover {
  cursor: pointer;
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
}
.add_btn:hover {
  cursor: pointer;
}

.activity-manager-list >>> .el-dialog .el-dialog__body div.img-wrap {
  text-align: center;
}

.activity-manager-list >>> .el-dialog .el-dialog__body div.img-wrap img {
  width: 100%;
}

/* 新增修改弹窗 */
.activity-change {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px 80px 30px 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.avatar-uploader-icon {
  /* background: #ccc; */
  position: relative;
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border: 1px dashed #d9d9d9;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  float: left;
}

.avatar-uploader-icon .avatar {
  width: 100%;
  height: 100%;
}
.avatar-upload {
  position: absolute;
  font-size: 30px;
  width: 30px;
  height: 30px;
  color: #fff;
  left: 50%;
  top: 50%;
  margin-top: -15px;
  margin-left: -15px;
  text-align: center;
  line-height: 30px;
  z-index: 10;
}
.img_font {
  color: #999;
  font-size: 12px;
  height: 34px;
  line-height: 34px;
}
.mi_title {
  color: #333;
  font-size: 22px;
  height: 40px;
  line-height: 40px;
}

.activity-change >>> .avatar-uploader .el-upload-list__item,
.activity-change >>> .el-upload--picture-card {
  width: 60px;
  height: 60px;
  line-height: 68px;
}
.power_box {
  width: 100%;
  border: 1px solid #999;
  height: 100px;
}
</style>
