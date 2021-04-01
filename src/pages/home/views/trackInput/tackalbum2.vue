<template>
  <el-main>
    <div class="activity-manager-list" v-if="showToogle">
      <div class="search-wrap">
        <el-form :model="search" label-width="120px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="活动名称：">
                <el-input v-model="search.activityContent"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-form-item label="所有人:">
                <el-input v-model="search.userId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="add_btn" @click="modifyAlbum()">新增影集</div>
      <div class="table-wrap">
        <el-table :data="tableData" border :default-sort="{prop: 'id', order: 'descending'}">
          <el-table-column prop="id" label="id" width="90">
          </el-table-column>
          <el-table-column prop="activityName" label="活动名">
            <template slot-scope="scope">
              {{scope.row.activityName|nullFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="影集内容" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.content|nullFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="pic.length" label="照片">
            <template slot-scope="scope">
              <!-- pic数组类型，若没值后台只给null -->
              {{(scope.row.picList?scope.row.picList.length:0)+'张'}}
            </template>
          </el-table-column>
          <el-table-column prop="byWho" label="所属人">
            <template slot-scope="scope">
              {{scope.row.byWho | nullFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="editTime" label="录入时间">
            <template slot-scope="scope">
              {{scope.row.editTime|timeFilters}}
            </template>
          </el-table-column>
          <el-table-column prop="reTime" label="发布时间">
            <template slot-scope="scope">
              {{scope.row.reTime|timeFilters}}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.type | typeFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="rem" label="备注">
            <template slot-scope="scope">
              {{scope.row.rem|nullFilters}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click.native.prevent="modifyAlbum(scope.row)">
                修改
              </el-button>
              <el-button type="text" size="small" v-if="!scope.row.type" @click="publish(scope.row.id, scope.row.type)" style="margin-left:0px;color:red">
                发布
              </el-button>
              <el-button type="text" size="small" @click="deleteTr(scope.row.id)" style="margin-left:0px;color:red">
                删除
              </el-button>
            </template>

          </el-table-column>
        </el-table>

        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="prev, pager, next, jumper" :total="totalTr">
          </el-pagination>
        </div>

      </div>
    </div>

    <div class="track-album-change" v-else>
      <p class="mi_title">{{title}}</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称:" prop="activityName">
          <!-- <el-select v-model="ruleForm.activityId" placeholder="请选择活动名称">
            <el-option  v-for="(item,index) in this.actNameGather" :key="index+'v'" :label="item.actName" :value="item.actId"></el-option>
          </el-select> -->
          <el-input v-model="ruleForm.activityName" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="影集内容" prop="content">
          <el-input type="textarea" v-model="ruleForm.content" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="上传配图：">
          <el-upload :action="this.action" list-type="picture-card" :file-list="ruleForm.picList" :limit="8" :onSuccess="uploadSuccess" :headers="headers" :http-request="handleHttpRequest">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click.stop="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <p class="img_font">文件像素250x250，支持jpg,png,jpeg文件，最少上传两站，最多上传八张</p>
        </el-form-item>
        <el-form-item label="所属人：">
          <el-radio-group v-model="ruleForm.byWho" size="medium">
            <!-- 规定0为所有人，1为vip用户 -->
            <el-radio border :label="0" style="border:0px">所有人</el-radio>
            <el-radio border :label="1" style="border:0px">VIP用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-top:-10px;width:320px;">
          <el-input v-model.number="ruleForm.phone" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input type="textarea" v-model="ruleForm.rem" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-main>

</template>

<script>
import util from '@/libs/util'

export default {
  name: 'TrackAlbum',
  data() {
    return {
      showToogle: true,
      search: {
        activityContent: '',
        userId: ''
      },
      pagination: {
        pageNum: 1,
        pageSize: 20
      },
      sort: {
        prop: 'id',
        order: 'descending'
      },
      totalTr: 1000, // 每次调用接口以后  用后台的total值 重新赋值
      tableData: [],
      actNameGather: [],
      //弹窗
      title: '新增影集',
      ruleForm: {
        phone: '',
        byWho: 0, //所属人
        rem: '',
        picList: [],
        activityName: '',
        content: ''
      },
      rules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      img: {}
    }
  },

  filters: {
    typeFilter(val) {
      switch (Number(val)) {
        case 0:
          return '未发布'
        case 1:
          return '已发布'
        default:
          return '--'
      }
    },
    byWhoFilter(val) {
      switch (Number(val)) {
        case 0:
          return '所有人'
        default:
          return 'VIP用户'
      }
    },
    nullFilters(value) {
      if (value) {
        return value
      } else {
        return '--'
      }
    },
    timeFilters(date) {
      if (date) {
        let dateee = new Date(date).toJSON()
        let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return newDate
      } else {
        return '--'
      }
    }
  },
  computed: {
    headers() {
      return {
        Authorization: this.token // 直接从本地获取token就行
      }
    }
  },
  created: function() {
    this.getTableData()
    this.getActName()
  },

  mounted: function() {},

  methods: {
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pagination.pageNum = pageNum
      // 调用接口
      this.getTableData()
    },
    getSearchParams() {
      // 根据后台字段 对应修改
      // 最好是和后台保持一致

      // 处理 regTime 成后台接受的时间格式   startTime: '',
      // endTime: '',
      let params = Object.assign(this.search, this.pagination, this.sort)
      console.log(params, JSON.stringify(params))
      return params
    },
    getTableData() {
      let gather = this.getSearchParams()

      let params = new URLSearchParams()
      params.append('pageNum', gather.pageNum)
      params.append('pageSize', gather.pageSize)
      params.append('activityContent', gather.activityContent)
      params.append('userId', gather.userId)
      // params.append('order', gether.order)
      util.ajax
        .get('photo/queryPhoto?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            console.log('我来了')
            this.tableData = res.data.data.dataList
            this.tableData.forEach((item, index) => {
              for (let key in item) {
                if (!item[key]) {
                  item[key] = ''
                }
              }
            })
            let total = res.data.data.totalSize || 0
            this.handleGetTableData(total)
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getActName() {
      util.ajax
        .get('activity/queryActivityName')
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.actNameGather = res.data.data
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleGetTableData(total) {
      this.totalTr = total
    },
    deleteTip() {
      this.$message('删除错误')
    },
    //删除数据

    deleteTr(deleteId) {
      let params = JSON.stringify({
        id: deleteId
      })
      util.ajax
        .post('photo/deletePhoto', params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            //成功刷新数据
            this.$message('删除成功')
            this.getTableData()
          } else {
            this.deleteTip()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    //发布
    publish(id, type) {
      console.log(id)
      if (!parseInt(type)) {
        let params = new URLSearchParams()
        params.append('id', id)
        util.ajax
          .post('photo/releasePhoto', params)
          .then(res => {
            if (parseInt(res.data.code) == 301000) {
              //成功刷新数据
              console.log('发布成功')
              this.getTableData()
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    //表单
    modifyAlbum(row) {
      console.log(row)
      if (arguments.length) {
        this.showToogle = false
        this.title = '修改影集'
        if (row.picList) {
          this.ruleForm.picList = row.picList
        } else {
          this.ruleForm.picList = []
        }
        this.ruleForm.activityName = row.activityName
        //this.ruleForm.activityId = row.activityId
        this.ruleForm.content = row.content
        this.ruleForm.byWho = parseInt(row.byWho) //和后台确认所属人
        this.ruleForm.rem = row.rem
        this.ruleForm.phone = row.phone
        this.ruleForm.id = row.id
      } else {
        this.showToogle = false
        this.title = '新增影集'
        this.ruleForm = {
          phone: '',
          byWho: 0, //所属人
          rem: '',
          picList: [],
          activityName: '',
          content: ''
        }
      }
    },
    beforeUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt500kb = file.size / 1024 < 500

      if (!(isJPG || isPng)) {
        this.$message.error('上传头像图片只能是 JPG, PNG 格式!')
      }
      if (!isLt500kb) {
        this.$message.error('上传头像图片大小不能超过 500kb!')
      }
      return (isPng || isJPG) && isLt500kb
    },
    handleHttpRequest(a) {
      console.log(a.file)
      let formData = new FormData()
      formData.append('file', a.file)
      //http://test.onecar.dp20.cn/api/v1.0/
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      util.ajax
        .post('file/upload', formData, config)
        .then(res => {
          console.log(res)
          if (parseInt(res.data.code) == 301000) {
            console.log(res.data.data[0])
            this.img = res.data.data[0]
            let params = new URLSearchParams()
            params.append('name', this.img.name)
            params.append('url', this.img.url)
            util.ajax
              .get('file/downFile?' + params)
              .then(res => {
                this.img.url = res.config.url
                console.log(this.img)
                this.ruleForm.picList.push(this.img)
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
    handleRemove(file, fileList) {
      console.log(fileList)
      this.ruleForm.picList.forEach((item, index) => {
        if (item.name == file.name) {
          this.ruleForm.picList.splice(index, 1)
        }
      })
      console.log(file)
    },
    uploadSuccess(response, file, fileList) {
      console.log(fileList)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.actNameGather.forEach((item, index) => {
            // if (item.actId == this.ruleForm.activityId) {
            //   this.ruleForm.activityName = item.actName
            //   console.log(this.ruleForm)
            // }
          })
          // if (this.actNameGather.length == index + 1) {
          console.log(this.ruleForm)
          let params = JSON.stringify(this.ruleForm)
          if (this.title == '新增影集') {
            util.ajax
              .post('photo/increasePhoto', params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.dialogFormVisible = false
                  console.log(res)
                  this.getTableData()
                  this.showToogle = true
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          } else {
            util.ajax
              .post('photo/updatePhoto', params)
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.dialogFormVisible = false
                  console.log(res)
                  this.getTableData()
                  this.showToogle = true
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          }
          // }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.showToogle = true
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
  padding: 30px 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
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
}
.add_btn:hover {
  cursor: pointer;
}
.activity-manager-list .el-form-item {
  margin-bottom: 10px;
  width: 300px;
}
.activity-manager-list .el-form-item input.el-input__inner {
  height: 20px !important;
}
/* 自定义表单样式 */
.track-album-change {
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
.form_box {
  padding-left: 80px;
  overflow: hidden;
}
.fb_inbox {
  border: 1px solid #333;
  padding: 10px;
  overflow: hidden;
  min-height: 200px;
  width: 600px;
  position: relative;
}
.close_form {
  width: 20px;
  height: 20px;
  background-color: pink;
  position: absolute;
  right: 0;
  top: 0;
}
.track-album-change >>> .el-upload-list .el-upload-list__item,
.track-album-change >>> .el-upload--picture-card {
  width: 60px;
  height: 60px;
}
.track-album-change >>> .el-icon-plus {
  position: relative;
  top: -36px;
}
</style>
