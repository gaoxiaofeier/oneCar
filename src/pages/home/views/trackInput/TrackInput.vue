<template>
  <el-main class="track-input">
    <div>
      <div class="search-wrap">
        <el-form :model="search" label-width="70px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="省：">
                <el-input v-model="search.province"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="市：">
                <el-input v-model="search.city"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="赛道名：" label-width="110px">
                <el-input v-model="search.trackName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" :push="2">
              <el-button type="primary" icon="el-icon-search" @click="getTableData">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="tab_btn" @click="addNewTrack">新增赛道</div>

      <div class="table-wrap">
        <el-table :data="tableData" border style="width: 100%">
          <!-- <el-table-column prop="trackId" label="id" width="150">
          </el-table-column> -->
          <el-table-column prop="province" label="省">
          </el-table-column>
          <el-table-column prop="city" label="市">
          </el-table-column>
          <el-table-column prop="trackName" label="赛道名">
          </el-table-column>
          <el-table-column label="赛道图" width="120">
            <template slot-scope="scope">
              <div @click="showBigImage(scope.row.CmainPic[0].url)" style="width: 100%; height: 100%;" v-if="scope.row.CmainPic[0].url">
                <img style="width: 50px; height: auto; ddisplay: block;" :src="scope.row.CmainPic[0].url" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="rem" label="备注">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="modifyOpenBox(scope.row)">
                修改
              </el-button>
              <el-button type="text" size="small" style="color:red" @click="deleteTr(scope.row.trackId)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pagenum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="isShowBigImage" :before-close="handleBigImageClose">
      <div class="img-wrap">
        <img :src="tableListBigImageUrl" />
      </div>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog :title="boxTitle" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="省：" :label-width="formLabelWidth">
          <el-input v-model="form.province" autocomplete="off" height="20px"></el-input>
        </el-form-item>
        <el-form-item label="市：" :label-width="formLabelWidth">
          <el-input v-model="form.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="赛道名：" :label-width="formLabelWidth">
          <el-input v-model="form.trackName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="赛道图：" class="lable_zhu">

          <el-upload :limit="1" :action="this.action" :show-file-list="true" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
            <img v-if="form.trackListPic[0].url" :src="form.trackListPic[0].url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <el-upload :limit="1" action="http://test.onecar.dp20.cn/api/v1.0/file/upload" :show-file-list="true" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
            <img v-if="form.trackListPic[0].url" :src="form.trackListPic[0].url" class="avatar" style="width:60px;height:auto">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->

          <p class="img_font">文件像素250x250，支持jpg、png、jpeg文件，最多上传一张</p>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.rem"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddOrModifyMsg">确 定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>
<script>
import util from '@/libs/util'

export default {
  name: 'TrackInput',
  data() {
    return {
      action: this.$store.getters.uploadImage + 'file/upload',
      search: {
        province: '',
        city: '',
        trackName: ''
      },
      pagination: {
        pageNum: 1,
        pageSize: 20,
        total: 1000 // 每次调用接口以后  用后台的total值 重新赋值
      },
      boxTitle: '新增记录', //弹窗标题
      tableData: [],
      dialogFormVisible: false,
      form: {
        province: '',
        city: '',
        trackName: '', //弹窗赛道名
        trackListPic: [{ name: '', url: '' }],
        rem: ''
      },
      formLabelWidth: '70px',
      isShowPic: true, //表格中赛道图是否显示
      isShowBigImage: false,
      tableListBigImageUrl: '',
      imgPath: '',
      returnImg: '', //返回给后台的url
      globleImg: this.$store.getters.golbleImage
    }
  },
  created: function() {
    this.getTableData()
  },
  mounted: function() {},
  methods: {
    handleCurrentChange(currentPage) {
      this.pagination.pagenum = currentPage
      this.getTableData()
    },

    getSearchParams() {
      let params = Object.assign(this.search, this.pagination)
      return params
    },

    getTableData() {
      var gather = this.getSearchParams()
      // console.log(params)
      let params = new URLSearchParams()
      params.append('province', gather.province)
      params.append('city', gather.city)
      params.append('trackName', gather.trackName)
      params.append('pageNum', gather.pageNum)
      params.append('pageSize', gather.pageSize)

      util.ajax
        .get('track/queryTrack?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            res.data.data.dataList.forEach((item, index) => {
              item.CmainPic = [{ name: '', url: '' }]
              if (!item.trackListPic || !item.trackListPic[0].url) {
                item.trackListPic = [{ name: '', url: '' }]
              } else {
                item.CmainPic[0].name = item.trackListPic[0].name
                item.CmainPic[0].url = item.trackListPic[0].url
              }
            })
            this.tableData = res.data.data.dataList
            let total = res.data.data.totalSize || 0
            this.$forceUpdate()
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
    },

    showBigImage(url) {
        alert(87)
      this.tableListBigImageUrl = url
      this.isShowBigImage = true
    },
    handleBigImageClose(done) {
      this.tableListBigImageUrl = ''
      done()
    },
    //弹窗中的上传图片
    handleAvatarSuccess(res, file) {
      this.returnImg = res.data[0].url
      this.form.trackListPic = [JSON.parse(JSON.stringify(res.data[0]))]
      this.form.trackListPic[0].url = res.data[0].url
    },
    handleError() {
      this.$message('上传失败')
    },
    handleRemove(file, fileList) {
      this.form.trackListPic = [{ name: '', url: '' }]
      this.returnImg = ''
    },
    beforeAvatarUpload(file) {
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

    //点击新增修改按钮
    addNewTrack() {
      this.boxTitle = '新增记录'
      this.dialogFormVisible = true
      this.returnImg = ''
      this.form = {
        province: '',
        city: '',
        trackName: '', //弹窗赛道名
        trackListPic: [{ name: '', url: '' }],
        rem: ''
      }
    },
    modifyOpenBox(row) {
      this.boxTitle = '修改记录'
      let img = [{}]
      this.form = JSON.parse(JSON.stringify(row))

      if (!row.trackListPic || !row.trackListPic[0].url) {
        this.form.trackListPic = [{ name: '', url: '' }]
        this.returnImg = ''
      } else {
        this.returnImg = row.trackListPic[0].url
        this.form.trackListPic[0].url = this.form.trackListPic[0].url
      }
      this.dialogFormVisible = true
    },
    submitAddOrModifyMsg() {
      let template = {
        trackId: this.form.trackId,
        province: this.form.province,
        city: this.form.city,
        trackName: this.form.trackName,
        rem: this.form.rem,
        trackListPic: JSON.parse(JSON.stringify(this.form.trackListPic))
      }
      template.trackListPic[0].url = this.returnImg
      if (this.boxTitle == '新增记录') {
        if (
          !template.province &&
          !template.city &&
          !template.trackName &&
          !template.rem &&
          !template.trackListPic[0].url
        ) {
          this.dialogFormVisible = false
          return
        }
        let params = JSON.stringify(template)
        util.ajax
          .post('track/increaseTrack', params)
          .then(res => {
            if (parseInt(res.data.code) == 301000) {
              this.dialogFormVisible = false

              this.getTableData()
              //this.$message('新增成功')
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      } else {
        let gather = JSON.stringify(template)
        util.ajax
          .post('track/updateTrack', gather)
          .then(res => {
            if (parseInt(res.data.code) == 301000) {
              this.dialogFormVisible = false
              this.$message('修改成功')
              this.getTableData()
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    //删除数据
    deleteTr(id) {
      let params = JSON.stringify({
        id: id
      })
      util.ajax
        .post('track/deleteTrack', params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            //成功刷新数据
            this.getTableData()
          } else {
            this.deleteTip()
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
.track-input .search {
  width: 30%;
  float: left;
  height: 50px;
}
.track-input .search_btn {
  width: 10%;
  float: right;
}

.track-input {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  padding: 30px 20px;
}

.track-input .table-wrap {
  padding-bottom: 100px;
}

.track-input .pagination-wrap {
  padding-top: 30px;
}

.track-input .el-pagination {
  float: right;
  margin-right: 40px;
}
.tab_btn {
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
.tab_btn:hover {
  cursor: pointer;
}
/* 弹窗 */
.el-message-box__wrapper >>> .el-message-box__header {
  padding-bottom: 6px;
  border-bottom: 1px solid #333;
}
.input_box {
  width: 300px;
}
.img_font {
  color: #999;
  font-size: 12px;
  height: 34px;
  line-height: 34px;
  padding-left: 70px;
}
/* 上传图片样式 */
。.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.track-input >>> .el-dialog .el-dialog__body img.avatar {
  width: 60px;
  height: auto;
  display: inline-block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  /* border: 1px dashed #d9d9d9; */
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
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

.track-input >>> .el-dialog .el-dialog__body div.img-wrap {
  text-align: center;
}

.track-input >>> .el-dialog .el-dialog__body div.img-wrap img {
  width: 100%;
}
.el-upload-list__item-name {
  color: #606266;
  display: block;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 66px;
  text-overflow: ellipsis;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
  white-space: nowrap;
}
.track-input >>> .el-upload-list__item:first-child {
  margin-top: 10px;
  padding-left: 63px;
  width: 300px;
}
.track-input >>> track-input >>> .el-upload-list .el-upload-list__item div {
  display: table-cell;
  width: 100%;
  height: 60px;
  vertical-align: middle;
}
.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 100%;
  height: auto;
}
.track-input >>> .el-upload--picture-card {
  width: 60px;
  height: 60px;
  line-height: 68px;
}
.track-input >>> .lable_zhu .el-form-item__label {
  height: 60px;
  line-height: 60px;
}
.lable_zhu >>> .el-upload--text {
  height: 60px;
  display: table-cell;
  vertical-align: middle;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
</style>

<style>
</style>
