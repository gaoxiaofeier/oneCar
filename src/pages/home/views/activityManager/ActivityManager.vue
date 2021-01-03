<template>
  <el-main>
    <div class="activity-manager-list" v-if="showToogle">
      <div class="search-wrap">
        <el-form :model="search" label-width="100px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="活动名称：">
                <el-input v-model="search.actName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动时间：" label-width="110px">
                <el-date-picker v-model="search.regTime" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
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
        <span class="tb" :class="{'nactive': search.status === ''}" @click="chooseTab('')">全部</span>
        <span class="tb" :class="{'nactive': search.status === '0'}" @click="chooseTab('0')">待发布</span>
        <span class="tb" :class="{'nactive': search.status === '1'}" @click="chooseTab('1')">已发布</span>
      </div>
      <div class="add_btn" @click="modifyAlbum()">新增活动</div>
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" border>
          <!-- <el-table-column prop="actId" label="id" width="80">
          </el-table-column> -->
          <el-table-column prop="actName" label="活动名称" width="120">
          </el-table-column>
          <el-table-column prop="actLocation" label="活动地点" width="120">
          </el-table-column>
          <el-table-column prop="date" label="日期" width="120">
            <template slot-scope="scope">
              {{scope.row.date|timeFiltersTime}}
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间" width="100">

          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="100">

          </el-table-column>
          <el-table-column prop="price" label="普通价格" width="100">
          </el-table-column>
          <el-table-column prop="vipPrice" label="vip价格" width="120">
          </el-table-column>
          <el-table-column prop="lastCount" label="参赛剩余名额" width="120">
          </el-table-column>
          <el-table-column label="主图" width="80">
            <template slot-scope="scope">
              <div @click="showImageDetail([scope.row.CmainPic[0]])" style="width: 100%; height: 100%;" v-if="scope.row.CmainPic[0].url">
                <img style="width: 60px; height: 40px; display: block;" :src="scope.row.CmainPic[0].url" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="配图" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click="showImageDetail(scope.row.CotherPic)" v-show="scope.row.CotherPic.length>0"> 查看图片 </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="rem" label="备注" width="120">
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <span> {{scope.row.status | statusFilter}} </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed='right'>
            <template slot-scope="scope">
              <el-button @click.native.prevent="handleClickView(scope.$index, scope.row)" type="text" size="small">
                查看
              </el-button>
              <el-button type="text" size="small" @click.native.prevent="modifyAlbum(scope.row)">
                修改
              </el-button>
              <br />
              <el-button type="text" size="small" v-if="!(parseInt(scope.row.status))" @click="publish(scope.row.actId, scope.row.status)" style="margin-left:0px;color:#E6A23C">
                发布
              </el-button>
              <el-button type="text" size="small" @click="deleteConform(scope.row)" style="color:red">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>

        </div>

      </div>
      <el-dialog :visible.sync="isShowBigImage" :before-close="handleBigImageClose">
        <div class="img-wrap">
          <el-carousel trigger="click" v-if="bigImageUrlList.length > 1">
            <el-carousel-item v-for="(url, index) in bigImageUrlList" :key="index">
              <img :src="url.url" />
            </el-carousel-item>
          </el-carousel>
          <img v-if="bigImageUrlList.length === 1 && bigImageUrlList[0]" :src="bigImageUrlList[0].url" />

        </div>
      </el-dialog>
    </div>
    <div class="activity-change" v-else>
      <p class="mi_title">{{title}}</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="活动名称:" prop="actName">
          <el-input v-model="ruleForm.actName" class="ipt_width"></el-input>
        </el-form-item>
        <el-form-item label="活动地点:" prop="actLocation">
          <el-select v-model="ruleForm.actLocation" placeholder="请选择地点">
            <el-option v-for="(item, index) in optionsList" :key="index" :label="item.label" :value="item" class="ipt_width">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动日期:" prop="date">
          <el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期" style="color:#666">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间:" prop="startTime">
          <el-time-picker v-model="ruleForm.startTime" placeholder="选择时间" format="HH:mm" value-format="HH:mm" :picker-options="{selectableRange:`08:00:00 -${ruleForm.endTime ? ruleForm.endTime+':00' : '21:59:59'}`}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-time-picker v-model="ruleForm.endTime" placeholder="选择时间" format="HH:mm" value-format="HH:mm" :picker-options="{selectableRange:`${ruleForm.startTime ? ruleForm.startTime+':00' : '00:00:00'}-22:00:00`}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="普通价格:" prop="price">
          <el-input v-model.number="ruleForm.price" class="ipt_width" type="price"></el-input>
        </el-form-item>
        <el-form-item label="优惠券:" prop="isCoupon">
            <template>
                <el-radio v-model="ruleForm.isCoupon" label='0'>可使用</el-radio>
                <el-radio v-model="ruleForm.isCoupon" label='1'>不可使用</el-radio>
            </template>
        </el-form-item>
        <el-form-item label="回馈积分:" prop="maxIntegral ">
            <el-input v-model.number="ruleForm.reward " class="ipt_width" type="maxIntegral " placeholder="请输入回馈积分，没有为0"></el-input>
        </el-form-item>
        <el-form-item label="使用积分上限:" prop="maxIntegral ">
            <el-input v-model.number="ruleForm.maxIntegral " class="ipt_width" type="maxIntegral " placeholder="输入积分上限，不可使用为0"></el-input>
        </el-form-item>
        <el-form-item label="VIP价格:" prop="vipPrice">
          <el-input v-model.number="ruleForm.vipPrice" class="ipt_width" type="vipPrice"></el-input>
        </el-form-item>
        <el-form-item label="参赛名额:" prop="allCount">
          <el-input v-model.number="ruleForm.allCount" class="ipt_width" type="allCount" autocomplete="off"></el-input>
          <!-- <el-input type="age" v-model.number="numberValidateForm.age" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="上传主图:" class="lable_zhu">
          <div class="zhu_box">
            <el-upload :limit="1" :action="this.action" :show-file-list="true" :on-success="SuccessZhu" :http-request="httpUploadZhu" :before-upload="beforeUpload" :on-remove="removeZhu">
              <img v-if="ruleForm.mainPicList[0].url" :src="ruleForm.mainPicList[0].url" class="avatar" style="width:60px;height:auto">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
    
          </div>

          <p class="img_font">文件像素500x500，支持jpg,png,jpeg文件，最多上传一张</p>
        </el-form-item>
        <el-form-item label="上传配图:" class="lable_zhu">
          <el-upload action="#" ref="upload" multiple :on-success="SuccessPei" :before-upload="beforeUpload" :http-request="httpUpload" list-type="picture-card" :on-remove="handleRemove" :file-list="ruleForm.otherPicList">
            <div class="hidden"   @click="pointHidden">
                <i class="el-icon-plus"></i>
            </div>
          </el-upload>
          <div style="width:303px">
                <el-progress
                  v-show="showProgress"
                  :text-inside="true"
                  :stroke-width="15"
                  :percentage="progress"
                ></el-progress>
          </div>
          <p class="img_font">文件像素500x500，支持jpg,png,jpeg文件，最多上传八张</p>
        </el-form-item>
        <el-form-item label="上传分享图:" class="lable_zhu">
          <div class="zhu_box">
            <el-upload :limit="1" :action="this.action" :show-file-list="true" :http-request="httpUploadShare" :before-upload="beforeUploadShare" :on-remove="removeShare">
              <img v-if="ruleForm.sharePicList[0].url" :src="ruleForm.sharePicList[0].url" class="avatar" style="width:60px;height:auto">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>

          <p class="img_font">支持jpg,png,jpeg文件，最多上传一张</p>
        </el-form-item>
        <el-form-item label="活动说明:" prop="content" style="max-width:500px;">
          <el-input type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="rem" style="max-width:500px;">
          <el-input type="textarea" v-model="ruleForm.rem"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 确认删除弹框 -->
    <el-dialog
      :visible.sync="conformDeleteVisible"
      width="300px"
      center>
      <p style="text-align:center">确认删除？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible" size="small">取 消</el-button>
        <el-button type="primary" @click="deleteTr" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>
<script>
import { ossClient } from '@/libs/alioss'
import util from '@/libs/util'
export default {
  name: 'ActivityManager',
  data() {
    return {
      showToogle: true,
      showProgress:false,//上传配图 进度条  
      progress: 0, //进度条数据
      progressCount: 0,//上传配图 累加计数
      action: this.$store.getters.uploadImage + 'file/upload',
      search: {
        actName: '',
        regTime: [], // [startTime, endTime]
        startTime: '',
        endTime: '',
        status: ''
      },
      pagination: {
        pageNum: 1,
        pageSize: 20,
        total: 0 // 每次调用接口以后  用后台的total值 重新赋值
      },
      isShowBigImage: false,
      bigImageUrlList: [],
      // dv: '08:00:00',
      tableData: [],
      // 新增修改弹窗
      optionsList: [],
      ruleForm: {
        trackId: '',
        actName: '',
        date: '',
        price: '',
        vipPrice: Number,
        reward:Number,  //回馈积分
        maxIntegral:Number, //积分上限
        isCoupon:'0',                            //优惠券
        mainPicList: [{ name: '', url: '' }],
        sharePicList: [{ name: '', url: '' }],
        otherPicList: [],
        rem: '',
        actLocation: '',
        endTime: '',
        startTime: '',
        allCount: '',
        content: ''
      },
      returnMpic: [],
      returnOpic: [],
      returnSpic: [],
      rules: {
        actName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        actLocation: [{ required: true, message: '请选择活动区域', trigger: 'blur' }],
        date: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        allCount: [
          { required: true, message: '请输入参赛名额', trigger: 'blur' },
          { type: 'number', message: '参赛名额必须为数字值' }
        ],
        price: [
          { required: true, message: '请输入普通价格', trigger: 'blur' },
          { type: 'number', message: '价格必须为数字值' }
        ],
        vipPrice: [
          { required: true, message: '请输入VIP价格' },
          { type: 'number', message: '价格必须为数字值' }
        ],
        maxIntegral: [
          { required: true, message: '请输入回馈积分' },
          { type: 'number', message: '积分必须为数字值' }
        ]  
      },
      isEdit: this.$route.query.isEdit,
      title: '新增活动',
      conformDeleteVisible:false,//确认删除记录弹框
      deleteData:'',//被删除的数据行
    }
  },
  filters: {
    statusFilter(status) {
      switch (status) {
        case 0:
          return '未发布';
        case 1:
          return '已发布';
        default:
          return '--';
      }
    },
    timeFiltersTime(date) {
      if (date) {
        let dateee = new Date(date).toJSON()
        let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return newDate.substring(0, 10);
      }
    }
  },
  created: function() {
    this.getTableData()
    this.trackName()
   
  
  },


  methods: {
      pointHidden(){  //点击+配图，让进度条消失
         this.showProgress=false
         this.progress=0
      },
    
    async httpUploadZhu(file) {
       
      var fileName = file.file.name
      fileName = new Date().getTime() + '_' + Math.ceil(Math.random() * 1000) + '_' + file.file.name
      var file1 = file.file
      console.log(file)

      ossClient()
        .put(fileName, file1, {
          ContentType: 'image/jpeg'
        })
        .then(({ res, url, name }) => {
          if (res && res.status == 200) {
            let temp = [{ name: name, url: url }]
            this.ruleForm.mainPicList = temp
            this.returnMpic = temp
          }
        })
        .catch(err => {
          console.log(`阿里云OSS上传图片失败回调`, err)
        })
    },
    async httpUploadShare(file) {
      var fileName = file.file.name
      fileName = new Date().getTime() + '_' + Math.ceil(Math.random() * 1000) + '_' + file.file.name
      var file1 = file.file
      
      ossClient()
        .put(fileName, file1, {
          ContentType: 'image/jpeg'
        })
        .then(({ res, url, name }) => {
          if (res && res.status == 200) {
            let temp = [{ name: name, url: url }]
            this.ruleForm.sharePicList = temp
            this.returnSpic = temp
          }
        })
        .catch(err => {
          console.log(`阿里云OSS上传图片失败回调`, err)
        })
    },

    async httpUpload(file) {
       
        this.showProgress=false
        var fileName =new Date().getTime() + '_' + Math.ceil(Math.random() * 1000) + '_' + file.file.name
        ossClient()
          .put(fileName, file.file, {
            ContentType: 'image/jpeg',
          })
          .then(({ res, url, name }) => {
            if (res && res.status == 200) {
              let temp = { name: name, url: url }
              this.returnOpic.push(temp)
            }
        })  
        .catch(err => {
          console.log(`阿里云OSS上传图片失败回调`, err)
        })
    },
    chooseTab(tabName) {
      this.search.status = tabName
      this.getTableData()
    },
    handleClickView(index, row) {
      if (arguments.length) {
        this.$router.push({
          path: '/ActivityDetail',
          query: { row: JSON.stringify(row) }
        })
      }
    },

    handleCurrentChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.getTableData()
    },

    getSearchParams() {
      if (Array.isArray(this.search.regTime) && this.search.regTime.length == 2) {
        this.search.startTime = this.search.regTime[0]
        this.search.endTime = this.search.regTime[1]
      }
      let params = Object.assign(this.search, this.pagination, this.sort)
      return params;
    },
    getTableData() {
      var params = this.getSearchParams()
      let fei = JSON.stringify({
        pageNum: 1,
        pageSize: 20
      })
      util.ajax
        .post('activity/queryActivity', params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            res.data.data.dataList.forEach((item, index) => {
              item.CmainPic = [{ name: '', url: '' }]
              if (item.mainPicList.length == 0 || !item.mainPicList[0].url) {
                item.mainPicList = [{ name: '', url: '' }]
              } else {
                item.CmainPic[0].name = item.mainPicList[0].name
                item.CmainPic[0].url = item.mainPicList[0].url
              }
              if (item.otherPicList) {
                item.CotherPic = JSON.parse(JSON.stringify(item.otherPicList))
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
    //获取活动地点
    trackName() {
      let trackParams = new URLSearchParams()

      trackParams.append('pageNum', 1)
      trackParams.append('pageSize', 20)
      util.ajax
        .get('track/queryTrack?' + trackParams)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            let list = res.data.data.dataList
            list.forEach((item, index) => {
              this.optionsList.push({
                label: item.city + ' / ' + item.trackName,
                value: item.trackId
              })
            })
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    handleGetTableData(total) {
      this.pagination.total = total
    },

    showImageDetail(list) {
      if (list.length != 0) return this.bigImageUrlList = list,  this.isShowBigImage = true;
    },

    handleBigImageClose(done) {
      this.bigImageUrlList = []
      done()
    },

    //删除数据
    deleteConform(row){
        this.conformDeleteVisible=true
        this.deleteData=row
    },
    deleteTr() {
      let params = new URLSearchParams()
      params.append('actId', this.deleteData.actId) //可能是actId
      util.ajax
        .get('activity/deleteActivity?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
             this.conformDeleteVisible=false
            //成功刷新数据
            this.getTableData()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    deleteVisible(){
        this.conformDeleteVisible=false
    },
    //发布
    publish(id, type) {
      if (!parseInt(type)) {
        let params = new URLSearchParams()
        params.append('actId', id)
        params.append('status', 1)
        util.ajax
          .get('activity/releaseActivity?' + params) //走不通
          .then(res => {
            if (res.data.code == '301000') {
              //成功刷新数据
              this.$message('发布成功')
              this.getTableData()
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    //新增修改弹窗部分
    modifyAlbum(row) {
        console.log(row)
      if (arguments.length) {
        this.showToogle = false
        this.title = '修改活动'
        this.showProgress=false  //上传配图进度条
        this.progress=0   //上传配图进度条--百分比
        this.ruleForm.actName = row.actName
        let temp = { label: row.actLocation, value: row.trackId }
        this.ruleForm.actLocation = temp
        this.ruleForm.date = new Date(row.date)
        this.ruleForm.startTime = row.startTime
        this.ruleForm.endTime = row.endTime
        this.ruleForm.price = Number(row.price)
        this.ruleForm.vipPrice = Number(row.vipPrice)
        this.ruleForm.maxIntegral = Number(row.maxIntegral)  //使用积分上限积分改
        this.ruleForm.reward = Number(row.reward)  //回馈积分改
        this.ruleForm.isCoupon =  String(row.isCoupon)   //优惠券改
        this.ruleForm.allCount = row.allCount
        this.ruleForm.actId = row.actId
        this.ruleForm.content = row.content
        this.ruleForm.rem = row.rem
        let img = [{ name: '', url: '' }]
        // 主图
        if (row.mainPicList.length===0) {
          this.ruleForm.mainPicList = [{ name: '', url: '' }]
        } else {
          this.returnMpic = row.mainPicList
          this.ruleForm.mainPicList = JSON.parse(JSON.stringify(row.mainPicList))
        }
        //配图
        if (row.otherPicList) {
          this.returnOpic = row.otherPicList
          let template = []
          this.progressCount=row.otherPicList.length//上传配图进度条  图片上传成功个数累加
           console.log(this.ruleForm.otherPicList)
          row.otherPicList.forEach((item, index) => {
            template[index] = { name: item.name, url: item.url }
            template[index].url = item.url
             console.log(row.otherPicList)
            if (index === row.otherPicList.length - 1) {
              this.ruleForm.otherPicList = template
            }
          })
                      console.log(this.ruleForm.otherPicList)

        } else {
          this.ruleForm.otherPicList = []
        }
        //分享图
        if (row.sharePicList.length===0) {
          this.ruleForm.sharePicList = [{ name: '', url: '' }]
        } else {
          this.returnSpic = row.sharePicList
          this.ruleForm.sharePicList = JSON.parse(JSON.stringify(row.sharePicList))
        }
      } else {
        this.showProgress=false  //上传配图进度条
        this.progress=0   //上传配图进度条--百分比
        this.progressCount=0//上传配图进度条  图片上传成功个数累加
        this.showToogle = false
        this.title = '新增活动'
        this.returnMpic = []
        this.returnOpic = []
        this.returnSpic = []
        this.ruleForm = {
          trackId: '',
          actName: '',
          date: '',
          price: '',
          vipPrice: '',
          maxIntegral: '',  //使用积分上限
          reward: '',  //回馈积分
          isCoupon:'0',      //优惠券   
          mainPicList: [{ name: '', url: '' }],
          sharePicList: [{ name: '', url: '' }],
          otherPicList: [],
          rem: '',
          actLocation: '',
          endTime: '',
          startTime: '08:00:00',
          allCount: '',
          content: ''
        }
      }
    },
    handleRemove(file, fileList) {
      this.progressCount-=1
      this.returnOpic.forEach((item, index) => {
        if (item.name == file.name) {
          //this.ruleForm.otherPicList.splice(index, 1)
          this.returnOpic.splice(index, 1)
        }
      })
    },
    removeZhu(file) {
      this.ruleForm.mainPicList = [{ name: '', url: '' }]
      this.returnMpic = []
    },
    removeShare(file) {
      this.ruleForm.sharePicList = [{ name: '', url: '' }]
      this.returnSpic = []
    },
    handleAvatarSuccess(res, file) {
      // this.returnOpic.push(res.data[0])
      // let image = { name: '', url: '' }
      // image.name = res.data[0].name
      // image.url = res.data[0].url
      // image.url = image.url
      // this.ruleForm.otherPicList.push(image)
    },
    SuccessZhu(res, file) {
      // let image = res.data[0]
      // this.returnMpic = image.url
      // this.ruleForm.mainPicList[0].name = image.name
      // this.ruleForm.mainPicList[0].url = image.url
    },
    SuccessPei(res, file){
        console.log(this.ruleForm.otherPicList)
        console.log(this.returnOpic)
       this.progressCount++
       let uf=this.$refs.upload.uploadFiles.length
       console.log(uf)
       this.showProgress=true
       this.progress=(this.progressCount/uf)*100
       console.log('百分数',this.progress)
    },
    handleError() {
      this.$message('上传失败')
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt500kb = file.size / 1024 < 1000
      if (!(isJPG || isPng)) {
        this.$message.error('上传头像图片只能是 JPG, PNG 格式!')
      }
      if (!isLt500kb) {
        this.$message.error('上传头像图片大小不能超过 1M!')
      }
      return (isPng || isJPG) && isLt500kb
    },
    beforeUploadShare(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt500kb = file.size / 1024 < 1000
      if (!(isJPG || isPng)) {
        this.$message.error('上传头像图片只能是 JPG, PNG 格式!')
      }

      return isPng || isJPG
    },
    submitForm(formName) {
      this.showProgress=false  //上传配图进度条
      this.progress=0   //上传配图进度条--百分比
      this.$refs[formName].validate(valid => {
        if (valid) {
          let template = JSON.parse(JSON.stringify(this.ruleForm))
          console.log(template)
          template.mainPicList = this.returnMpic
          template.otherPicList = this.returnOpic
          template.sharePicList = this.returnSpic
          let temp = template.actLocation
          template.trackId = temp.value
          template.actLocation = temp.label
          let params = JSON.stringify(template)
          util.ajax
            .post('activity/increaseOrUpActivity', params)
            .then(res => {
              if (parseInt(res.data.code) == 301000) {
                this.getTableData()
                this.showToogle = true
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
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
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
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
  /* margin-right: 10px; */
  float: left;
}

.activity-change >>> .avatar {
  width: 60px;
  height: 60px;
  border-radius: 4px;
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
/* .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
} */
.activity-change >>> .avatar-uploader .el-upload-list__item {
  width: 60px;
  height: 60px;
}
.activity-change >>> .el-upload--picture-card {
  width: 60px;
  height: 60px;
  line-height: 68px;
}
.activity-change >>> .el-upload-list .el-upload-list__item div {
  display: table-cell;
  width: 100%;
  height: 60px;
  vertical-align: middle;
}
.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 100%;
  height: auto;
}
.zhu_box >>> .el-upload-list__item:first-child {
  width: 400px;
}
.activity-change >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 60px;
  height: 60px;
}
/* .activity-change >>> .lable_zhu .el-form-item__label {
  height: 60px;
  line-height: 60px;
}
.activity-change >>> .el-upload--text {
  height: 60px;
  display: table-cell;
  vertical-align: middle;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
.activity-change >>> .el-upload-list .el-upload-list__item {
  width: 60px;
  height: 60px;
} */
/* 上传配图上的隐藏图标 */
.hidden{
    width: 58px;
    height: 58px;
}
</style>
