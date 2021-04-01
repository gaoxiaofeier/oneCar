<template>
  <el-main>
    <div class="car-config" v-if="showToogle">
      <div class="search-wrap">
        <el-form :model="search" label-width="70px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="品牌：">
                <el-input v-model="search.carbrand"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="车系：">
                <el-input v-model="search.vehicleTypeName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item label="车型：">
                <el-input v-model="search.motorcycleType"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="年份：">
                <el-date-picker v-model="search.beginYear" type="year" placeholder="起始年份" value-format="yyyy" :default-value="new Date().setFullYear(new Date().getFullYear()-10)">
                </el-date-picker>
                <!-- <span class="time-separator">~</span>
                <el-date-picker v-model="search.endYear" type="year" placeholder="最后年份">
                </el-date-picker> -->

              </el-form-item>
            </el-col>
            <el-col :span="7" style="text-align:right">
              <el-button type="primary" icon="el-icon-search" @click="getTableData">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="tab_btn">
        <span class="tb nactive" @click="modifyAlbum()">新增品牌</span>
        <!-- <span class="tb nactive" @click="importExcel">导入表格</span> -->
      </div>
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" :border="true" :span-method="objectSpanMethod">
          <!-- <el-table-column prop="id" label="id">
          </el-table-column> -->
          <el-table-column prop="carbrand" label="品牌" style="">
            <template slot-scope="scope">
              <!-- <div @click="modifyAlbum(scope.row,'xi')" type="text" size="small" style="height:20px;">
               
              </div> -->
              <el-button type="text" @click="modifyAlbum(scope.row,'xi')">
                {{scope.row.carbrand.substr(1)}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="首字母">
            <template slot-scope="scope">
              {{scope.row.initials.substr(1)}}
            </template>
          </el-table-column>
          <el-table-column prop="vehicleSystemName" label="车系">
            <template slot-scope="scope">
              {{scope.row.vehicleSystemName.substr(1)}}
            </template>
            <!-- <div @click="changeH(scope.row)" type="text" size="small" style="height:20px;">
                  <div style="width:100%;height:100%" v-if="scope.row.lastlap">
                    {{scope.row.lastlap.substr(0,2)+':'+scope.row.lastlap.substr(2,2)+':'+scope.row.lastlap.substr(4)}}
                  </div> -->
          </el-table-column>
          <el-table-column prop="vehicleType" label="车型">
            <template slot-scope="scope">
              {{scope.row.vehicleTypeName.substr(1)}}
            </template>
          </el-table-column>
          <el-table-column prop="year" label="年份">
            <template slot-scope="scope">
              {{scope.row.year}}
              <!-- {{scope.row.beginYear.substr(1)+"~"+scope.row.endYear.substr(1)}} -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" @click="modifyAlbum(scope.row,'xing')">
                修改车型
              </el-button>
              <!-- <el-button type="text" @click="modifyAlbum(scope.row,'xi')">
                改车系
              </el-button> -->
              <el-button type="text" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrap clearfix">
          <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="this.total">
          </el-pagination>
        </div>

      </div>

    </div>
    <div class="car-config-change" v-else>
      <p class="mi_title">{{title}}</p>
      <div></div>
      <el-form v-if="isShow" :rules="addRules" ref="add" label-position="right" label-width="70px" :model="addFormLabelAlign">
        <el-form-item label="品牌：" prop="carbrand">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="addFormLabelAlign.carbrand" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="首字母：">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="Ainitials" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="icon：" class="gigi">
          <el-upload class="avatar-uploader" :limit="1" :action="this.action" :show-file-list="true" :on-success="successAdd" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
            <span v-if="addFormLabelAlign.picList[0].url">
              <img :src="addFormLabelAlign.picList[0].url" class="avatar">
            </span>
            <!-- <img v-if="addFormLabelAlign.picList[0].url" :src="addFormLabelAlign.picList[0].url" class="avatar"> -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="img_font">文件像素250x250，支持jpg,png,jpeg文件，最多上传一张</p>
        </el-form-item>
        <div class="form_box" v-for="(item,index) in addFormLabelAlign.vehicleSystem" :key="index+'x'" v-if="isDel[index]">
          <div class="fb_inbox">
            <i class="el-icon-close close_form" @click="closeCarType(index)"></i>
            <el-row>
              <el-form-item label="车系：">
                <div style="width:200px">
                  <el-input v-model="addFormLabelAlign.vehicleSystem[index].vehicleName"></el-input>
                </div>
              </el-form-item>
            </el-row>
            <el-row class="car_type_moble" v-for="(item,num) in carTypeMobleXing[index]" :key="num+'1'">
              <div style="overflow:hidden;">
                <span class="inner_chexing"></span>
                <el-form-item label="车型：" style="float:left">
                  <div style="width:160px">
                    <el-input v-model="addFormLabelAlign.vehicleSystem[index].vehicleType[num].vehicleName"></el-input>
                  </div>
                </el-form-item>
              </div>
              <div style="overflow:hidden;">
                <span class="inner_chexing"></span>
                <el-form-item label="年份：" style="position:relactive">
                  <!-- <input type="text" class="year_box" v-model="addFormLabelAlign.vehicleSystem[index].vehicleType[num].beginYear"> -->
                  <!-- <span class="year_font">~</span>
                  <input type="text" class="year_box" v-model="addFormLabelAlign.vehicleSystem[index].vehicleType[num].endYear">
                  <el-tooltip class="item" effect="dark" content="输入0，为当前年份" placement="top">
                    <div style="width:20px;height:38px;float:left;">
                      <i class="el-icon-warning-outline" style="margin-left:3px;"></i>
                    </div>
                  </el-tooltip> -->
                  <el-date-picker v-model="addFormLabelAlign.vehicleSystem[index].vehicleType[num].beginYear" type="year" placeholder="选择年份" value-format="yyyy" style="width:160px" :default-value="new Date().setFullYear(new Date().getFullYear()-10)">
                  </el-date-picker>

                </el-form-item>
              </div>
            </el-row>
            <div class="add_car_xing" @click="addCarTypeXing(index,(carTypeMobleXi-1))">添加车型</div>
          </div>
        </div>
        <div class="add_car_xi" @click="addCarTypeXi('add')">添加车系</div>
        <div class="btn_box">
          <span class="btn_style submit" @click="btnSubmit(0,'add')">提交</span>
          <span class="btn_style cancle" @click="btnCancle('add')">取消</span>
        </div>
      </el-form>
      <div v-else>
        <el-form v-if="carBrandChange" label-position="right" :rules="modifyRules" ref="modify" label-width="80px" :model="modifyFormLabelAlign">
          <el-form-item label="品牌：" prop="carbrand">
            <div style="width:200px;heigh:30px;">
              <el-input v-model="modifyFormLabelAlign.carbrand" class="c_ipt"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="首字母：">
            <div style="width:200px;heigh:30px;">
              <el-input v-model="Minitials" class="c_ipt"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="icon：" class="gigi">
            <el-upload class="avatar-uploader" :limit="1" :action="this.action" :show-file-list="true" :on-success="SuccessChange" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
              <!-- 修改页面图片不刷新，所以img外加了个span -->
              <span v-if="modifyFormLabelAlign.picList[0].url">
                <img :src="modifyFormLabelAlign.picList[0].url" class="avatar">
              </span>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="img_font">文件像素250x250，支持jpg,png,jpeg文件，最多上传一张</p>
          </el-form-item>
          <div class="form_box">
            <div class="fb_inbox">
              <el-row>
                <el-form-item label="车系：">
                  <div style="width:200px">
                    <el-input v-model="modifyFormLabelAlign.vehicleSystem[0].vehicleName"></el-input>
                  </div>
                </el-form-item>
              </el-row>
              <el-row class="car_type_moble">
                <div style="overflow:hidden;">
                  <span class="inner_chexing"></span>
                  <el-form-item label="车型：" style="float:left">
                    <div style="width:160px">
                      <el-input v-model="modifyFormLabelAlign.vehicleSystem[0].vehicleType[0].vehicleName"></el-input>
                    </div>
                  </el-form-item>
                </div>
                <div style="overflow:hidden;">
                  <span class="inner_chexing"></span>
                  <el-form-item label="年份：" style="position:relactive">
                    <el-date-picker v-model="modifyFormLabelAlign.vehicleSystem[0].vehicleType[0].beginYear" type="year" placeholder="选择年份" value-format="yyyy" style="width:160px" :default-value="new Date().setFullYear(new Date().getFullYear()-10)">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-row>
            </div>
          </div>
          <div class="btn_box">
            <span class="btn_style submit" @click="btnSubmit(1,'modify')">提交</span>
            <span class="btn_style cancle" @click="btnCancle('modify')">取消</span>
          </div>
        </el-form>
        <el-form v-else :rules="carBrandRules" ref="carBrandRules" label-position="right" label-width="70px" :model="carBrandForm">
          <el-form-item label="品牌：" prop="carbrand">
            <div style="width:200px;heigh:30px;">
              <el-input v-model="carBrandForm.carbrand" class="c_ipt"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="首字母：">
            <div style="width:200px;heigh:30px;">
              <el-input v-model="carBrandForm.initials" class="c_ipt"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="icon：" class="gigi">
            <el-upload class="avatar-uploader" :limit="1" :action="this.action" :show-file-list="true" :on-success="successCar" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
              <span v-if="carBrandForm.picList[0].url">
                <img :src="carBrandForm.picList[0].url" class="avatar">
              </span>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="img_font">文件像素250x250，支持jpg,png,jpeg文件，最多上传一张</p>
          </el-form-item>
          <div class="form_box" v-for="(item,index) in carBrandForm.vehicleSystem" :key="index+'x'">
            <div class="fb_inbox">
              <i class="el-icon-close close_form" @click="closeCarType(index,'xiugai')"></i>
              <el-row>
                <el-form-item label="车系：">
                  <div style="width:200px">
                    <el-input v-model="carBrandForm.vehicleSystem[index].vehicleName"></el-input>
                  </div>
                </el-form-item>
              </el-row>
              <el-row class="car_type_moble" v-for="(item,num) in carBrandForm.vehicleSystem[index].vehicleType" :key="num+'1'">
                <div style="overflow:hidden;">
                  <span class="inner_chexing"></span>
                  <el-form-item label="车型：" style="float:left">
                    <div style="width:160px">
                      <el-input v-model="carBrandForm.vehicleSystem[index].vehicleType[num].vehicleName"></el-input>
                    </div>
                  </el-form-item>
                </div>
                <div style="overflow:hidden;">
                  <span class="inner_chexing"></span>
                  <el-form-item label="年份：" style="position:relactive">
                    <!-- <input type="text" class="year_box" v-model="carBrandForm.vehicleSystem[index].vehicleType[num].beginYear">
                    <span class="year_font">~</span>
                    <input type="text" class="year_box" v-model="carBrandForm.vehicleSystem[index].vehicleType[num].endYear">
                    <el-tooltip class="item" effect="dark" content="输入0，为当前年份" placement="top">
                      <div style="width:20px;height:38px;float:left;">
                        <i class="el-icon-warning-outline" style="margin-left:3px;"></i>
                      </div>
                    </el-tooltip> -->
                    <el-date-picker v-model="carBrandForm.vehicleSystem[index].vehicleType[num].beginYear" type="year" placeholder="选择年份" value-format="yyyy" style="width:160px" :default-value="new Date().setFullYear(new Date().getFullYear()-10)">
                    </el-date-picker>

                  </el-form-item>
                </div>
              </el-row>
              <div class="add_car_xing" @click="addCarTypeXing(index,'xiugai')">添加车型</div>
            </div>
          </div>
          <div class="add_car_xi" @click="addCarTypeXi('xiugai')">添加车系</div>
          <div class="btn_box">
            <span class="btn_style submit" @click="btnSubmit(1,'carBrandRules','xi')">提交</span>
            <span class="btn_style cancle" @click="btnCancle('carBrandRules')">取消</span>
          </div>
        </el-form>
      </div>

    </div>
  </el-main>

</template>

<script>
import util from '@/libs/util'

export default {
  name: 'CarConfig',
  data() {
    return {
      showToogle: true,
      action: this.$store.getters.uploadImage + 'file/upload',
      search: {
        carbrand: '',
        vehicleTypeName: '',
        motorcycleType: '',
        beginYear: '',
        endYear: ''
      },
      pagination: {
        pageNum: 1,
        pageSize: 20
      },
      total: 0, // 每次调用接口以后  用后台的total值 重新赋值

      tableData: [],
      tableList: [],
      //弹窗部分
      addFormLabelAlign: {
        carbrand: '',
        vehicleSystem: [
          {
            vehicleName: '',
            vehicleType: [{ vehicleName: '', beginYear: '' }]
          }
        ],
        picList: [{ name: '', url: '' }], //上传默认图片路径
        initials: '' //首字母
      },
      addRules: {
        carbrand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }]
      },
      modifyFormLabelAlign: {
        carbrand: '',
        vehicleSystem: [
          {
            vehicleName: '',
            vehicleType: [{ vehicleName: '', beginYear: '' }]
          }
        ],
        picList: [{ name: '', url: '' }], //上传默认图片路径
        initials: '' //首字母
      },
      modifyRules: {
        carbrand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }]
      },
      carBrandForm: {
        carbrand: '',
        vehicleSystem: [
          {
            vehicleName: '',
            vehicleType: [{ vehicleName: '', beginYear: '' }]
          }
        ],
        picList: [{ name: '', url: '' }], //上传默认图片路径
        initials: '' //首字母
      },
      carBrandRules: {
        carbrand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }]
      },
      title: '新增车型',
      isShow: true,
      carTypeMobleXing: [1],
      carTypeMobleXi: 1,
      isDel: [true],
      aa: 'p',
      carBrandChange: false,
      returnImg: '' //返回给后台的url
    }
  },
  computed: {
    Cinitials: {
      get: function() {
        return this.carBrandForm.initials
      },
      set: function(val) {
        this.carBrandForm.initials = val.toUpperCase()
      }
    },
    Minitials: {
      get: function() {
        return this.modifyFormLabelAlign.initials
      },
      set: function(val) {
        this.modifyFormLabelAlign.initials = val.toUpperCase()
      }
    },
    Ainitials: {
      get: function() {
        return this.addFormLabelAlign.initials
      },
      set: function(val) {
        this.addFormLabelAlign.initials = val.toUpperCase()
      }
    }
  },
  created: function() {
    this.getTableData()
  },

  mounted: function() {},
  methods: {
    addNew() {
      this.$router.push({ path: '/CarConfigChange', query: { isEdit: false } })
    },
    importExcel() {},

    handleDelete(row) {
      // 处理row 得到 params
      let params = new URLSearchParams()
      params.append('id', row.vehicleTypeId)
      util.ajax
        .get('carInfo/deleteCarInfo?' + params) // 以车型为基准 不是以 id
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            //this.$message('删除成功')
            this.getTableData()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    modifyAlbum(row, type) {
      let nowYear = new Date()
      if (arguments.length) {
        //修改
        this.showToogle = false
        this.isShow = false
        this.title = '修改车型'
        if (type == 'xing') {
          //修改具体车型
          let img = [{}]
          if (!row.picList || !row.picList[0].url) {
            img = [{ name: '', url: '' }]
          } else {
            this.returnImg = row.picList[0].url
            img[0].name = row.picList[0].name
            img[0].url = row.picList[0].url
            img[0].url = img[0].url
          }

          this.carBrandChange = true
          this.modifyFormLabelAlign = {
            id: row.id,
            carbrand: row.carbrand.substr(1),
            initials: row.initials.substr(1), //首字母
            picList: img,
            vehicleSystem: [
              {
                id: row.vehicleSystemId,
                vehicleName: row.vehicleSystemName.substr(1),
                vehicleType: [
                  {
                    id: row.vehicleTypeId,
                    vehicleName: row.vehicleTypeName.substr(1),
                    // endYear: parseInt(year[1]),
                    beginYear: row.year
                  }
                ]
              }
            ]
          }
        } else {
          //修改品牌车系
          this.modifyFormLabelAlign.picList = [{ name: '', url: '' }]
          let carbrand = row.carbrand.substr(1)
          let params = new URLSearchParams()
          params.append('carbrand', carbrand)
          util.ajax
            .get('carInfo/queryCardetailed?' + params)
            .then(res => {
              if (parseInt(res.data.code) == 301000) {
                let row = res.data.data[0]
                let img2 = [{}]
                if (!row.picList) {
                  img2 = [{ name: '', url: '' }]
                } else {
                  this.returnImg = row.picList[0].url
                  img2[0].url = row.picList[0].url
                  img2[0].name = row.picList[0].name
                }

                row.vehicleSystem.forEach((item, index) => {
                  item.vehicleType.forEach((value, index) => {
                    value.beginYear = value.beginYear.toString()
                  })
                })
                this.carBrandForm = row
                this.carBrandForm.picList = img2
                this.carBrandChange = false
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }
      } else {
        //新增

        this.showToogle = false
        this.isShow = true
        this.title = '新增车型'
        this.returnImg = ''
        this.addFormLabelAlign = {
          carbrand: '',
          initials: '', //首字母
          picList: [{ name: '', url: '' }],
          vehicleSystem: [
            {
              vehicleName: '',
              vehicleType: [{ vehicleName: '', beginYear: '' }]
            }
          ]
        }
      }
    },
    handleCurrentChange(pageNum) {
      this.pagination.pageNum = pageNum
      this.getTableData()
    },

    getSearchParams() {
      let params = Object.assign(this.search, this.pagination)
      return params
    },
    getTableData() {
      var params = this.getSearchParams() //上线换params
      util.ajax
        .post('carInfo/queryCarInfo', params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            let list = res.data.data.dataList
            this.tableList = this.analyzeData(list)
            this.tableData = list
            this.tableData.forEach((item, index) => {
              let year = item.year.split('-')
              item.year = year[0].substr(1)
            })
            let total = res.data.data.totalSize || 0
            this.handleGetTableData(total) // 根据需要增加参数
          } else if (parseInt(res.data.code) == 20007) {
            this.$router.push('/Login')
          }
        })

        .catch(function(err) {
          console.log(err)
        })
    },
    getCarBrand(carbrand) {
      let params = new URLSearchParams()
      params.append('carbrand', carbrand)
      util.ajax
        .get('carInfo/queryCardetailed?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },

    analyzeData(list) {
      let splitNodeList = []
      let toSplitField = [
        // { field: 'id', columnIndex: 0 },
        { field: 'carbrand', columnIndex: 0 },
        { field: 'initials', columnIndex: 1 },
        { field: 'vehicleSystemName', columnIndex: 2 },
        { field: 'vehicleTypeName', columnIndex: 3 },
        { field: 'year', columnIndex: 4 }
      ]

      toSplitField.forEach(fieldItem => {
        let splitNodeListOneColumn = []
        let splitNode = {
          columnId: '',
          columnIndex: '',
          splitNodeIndex: '',
          splitSpace: 0
        }

        list.forEach((item, index) => {
          if (item[fieldItem.field] !== splitNode.columnId) {
            splitNode.columnId = item[fieldItem.field]
            splitNode.columnIndex = fieldItem.columnIndex
            splitNode.splitNodeIndex = index
            splitNode.splitSpace = 1
            splitNodeListOneColumn.push(JSON.parse(JSON.stringify(splitNode)))
          } else {
            splitNodeListOneColumn[
              splitNodeListOneColumn.length - 1
            ].splitSpace = ++splitNode.splitSpace
          }
        })

        splitNodeList.push(...splitNodeListOneColumn)
      })
      return splitNodeList
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {
        return
      }
      var split = this.tableList.find(item => {
        return item.columnIndex === columnIndex && item.splitNodeIndex === rowIndex
      })

      if (split) {
        return {
          rowspan: split.splitSpace,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },

    handleGetTableData(total) {
      this.total = total
    },
    //弹窗部分
    //弹窗图片上传
    successAdd(res, file) {
      let image = res.data[0]
      this.returnImg = image.url
      this.addFormLabelAlign.picList[0].name = image.name
      this.addFormLabelAlign.picList[0].url = image.url
      this.$forceUpdate()
    },
    SuccessChange(res, file) {
      let image = res.data[0]
      this.returnImg = image.url
      this.modifyFormLabelAlign.picList[0].url = image.url
      this.modifyFormLabelAlign.picList[0].name = image.name
      this.$forceUpdate()
    },
    successCar(res, file) {
      let image = res.data[0]
      this.returnImg = image.url
      this.carBrandForm.picList[0].url = image.url
      this.carBrandForm.picList[0].name = image.name
      this.$forceUpdate()
    },

    handleRemove(file) {
      this.addFormLabelAlign.picList = [{ name: '', url: '' }]
      this.modifyFormLabelAlign.picList = [{ name: '', url: '' }]
      this.carBrandForm.picList = [{ name: '', url: '' }]
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
    //添加车型
    addCarTypeXing(index, type) {
      if (type == 'xiugai') {
        //修改品牌车系页面的添加车型
        this.carBrandForm.vehicleSystem[index].vehicleType.push({
          vehicleName: '',
          // endYear: '',
          beginYear: ''
        })
      } else {
        this.addFormLabelAlign.vehicleSystem[index].vehicleType.push({
          vehicleName: '',
          // endYear: '',
          beginYear: ''
        })
      }
      this.carTypeMobleXing[index] += 1
    },
    //添加车系
    addCarTypeXi(type) {
      this.carTypeMobleXi += 1
      //console.log(this.carTypeMobleXi)
      this.isDel.push(true)
      this.carTypeMobleXing.push(1)
      if (type == 'add') {
        //新增页面
        this.addFormLabelAlign.vehicleSystem.push({
          vehicleName: '',
          vehicleType: [{ vehicleName: '', beginYear: '' }]
        })
      } else {
        //修改新增车系
        this.carBrandForm.vehicleSystem.push({
          vehicleName: '',
          vehicleType: [{ vehicleName: '', beginYear: '' }]
        })
        //console.log(this.carBrandForm.vehicleSystem)
      }
    },
    //删除车系
    closeCarType(index, type) {
      if (type == 'xiugai') {
        this.carBrandForm.vehicleSystem.splice(index, 1)
      } else {
        this.isDel[index] = false
        this.isDel.splice(index, 1)
        this.addFormLabelAlign.vehicleSystem.splice(index, 1)
        this.closeCarType = -1
      }

      this.carTypeMobleXing.splice(index, 1)
    },
    //提交
    btnSubmit(value, formName, carType) {
      this.$refs[formName].validate(valid => {
        switch (value) {
          case 0: //新增提交
            this.addFormLabelAlign.vehicleSystem.forEach((item, i) => {
              //.log(item.vehicleName)
              item.vehicleType.forEach((value, index) => {
                if (!value.vehicleName && !value.beginYear && !item.vehicleName && i > 0) {
                  this.addFormLabelAlign.vehicleSystem.splice(i, 1)
                }
                if (!value.vehicleName && !value.beginYear && index > 0) {
                  // console.log(value)
                  item.vehicleType.splice(index, 1)
                }
              })
            })
            let template = JSON.parse(JSON.stringify(this.addFormLabelAlign))
            template.picList[0].url = this.returnImg
            let params = JSON.stringify(template)
            util.ajax
              .post('carInfo/increaseCarInfo', params) // 以车型为基准 不是以 id
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.getTableData()
                  this.showToogle = true
                  this.modifyFormLabelAlign = {
                    carbrand: '',
                    vehicleSystem: [
                      {
                        vehicleName: '',
                        vehicleType: [{ vehicleName: '', beginYear: '' }]
                      }
                    ],
                    imageUrl: '', //上传默认图片路径
                    initials: '' //首字母
                  }
                  this.isDel = [true]
                  this.carTypeMobleXing = [1]
                  this.carTypeMobleXi = 1

                  this.showToogle = true
                }
              })
              .catch(function(err) {
                console.log(err)
              })
            break
          case 1:
            let gather = {}
            if (carType) {
              //修改车系
              this.carBrandForm.vehicleSystem.forEach((item, i) => {
                item.vehicleType.forEach((value, index) => {
                  if (!value.vehicleName && !value.beginYear && !item.vehicleName && i > 0) {
                    this.carBrandForm.vehicleSystem.splice(i, 1)
                  }
                  if (!value.vehicleName && !value.beginYear && index > 0) {
                    item.vehicleType.splice(index, 1)
                  }
                })
              })
              let template2 = JSON.parse(JSON.stringify(this.carBrandForm))
              template2.picList[0].url = this.returnImg
              gather = JSON.stringify(template2)
            } else {
              //单条修改车型

              let template3 = JSON.parse(JSON.stringify(this.modifyFormLabelAlign))
              template3.picList[0].url = this.returnImg
              gather = JSON.stringify(template3)
            }

            //修改提交
            util.ajax
              .post('carInfo/updateCarInfo', gather) // 以车型为基准 不是以 id
              .then(res => {
                if (parseInt(res.data.code) == 301000) {
                  this.showToogle = true
                  this.modifyFormLabelAlign = {
                    carbrand: '',
                    vehicleSystem: [
                      {
                        vehicleName: '',
                        vehicleType: [{ vehicleName: '', beginYear: '' }]
                      }
                    ],
                    imageUrl: '', //上传默认图片路径
                    initials: '' //首字母
                  }
                  this.getTableData()
                  this.showToogle = true
                }
              })
              .catch(function(err) {
                console.log(err)
              })
            break
          case 2: //修改整个品牌车系
            break
        }
      })
    },
    //取消
    btnCancle(formName) {
      // console.log(formName)
      this.$refs[formName].resetFields()
      this.showToogle = true
      //清空数据
      // this.modifyFormLabelAlign = {
      //   carbrand: '',
      //   vehicleSystem: [
      //     {
      //       vehicleName: '',
      //       vehicleType: [{ vehicleName: '', endYear: '', beginYear: '' }]
      //     }
      //   ],
      //   imageUrl: '', //上传默认图片路径
      //   initials: '' //首字母
      // }
      // this.addFormLabelAlign = {
      //   carbrand: '',
      //   vehicleSystem: [
      //     {
      //       vehicleName: '',
      //       vehicleType: [{ vehicleName: '', endYear: '', beginYear: '' }]
      //     }
      //   ],
      //   imageUrl: '',
      //   initials: ''
      // }
    }
  }
}
</script>

<style scoped>
.car-config .search {
  width: 30%;
  float: left;
  height: 50px;
}
.car-config .search_btn {
  width: 10%;
  float: right;
}

.car-config {
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

.car-config .table-wrap {
  padding-bottom: 100px;
}

.car-config .pagination-wrap {
  padding-top: 30px;
}

.car-config .el-pagination {
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
/* 自定义表单样式 */
.car-config-change {
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

.car-config-change >>> .avatar-uploader .el-upload img {
  width: 60px;
  height: auto;
}
.mi_title {
  color: #333;
  font-size: 22px;
  height: 40px;
  line-height: 40px;
}
.form_box {
  padding-left: 80px;
  overflow: hidden;
  margin-bottom: 10px;
}
.fb_inbox {
  border: 1px solid #999;
  padding: 10px;
  overflow: hidden;
  min-height: 200px;
  width: 600px;
  position: relative;
}
.close_form {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  top: 0;
  color: #666;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  z-index: 99;
}
.year_box {
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 39px;
  height: 36px;
  color: #666;
  float: left;
  padding: 0 15px;
}
.year_font {
  line-height: 36px;
  height: 36px;
  font-size: 16px;
  float: left;
  margin: 0 5px;
  color: #666;
}
.car_type_moble .el-form-item {
  margin-bottom: 8px;
}
.car_type_moble {
  margin-bottom: 6px;
}
.add_car_xing {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 14px;
  margin: 10px 0 20px 70px;
  cursor: pointer;
}
.add_car_xi {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 14px;
  margin: 10px 0 20px 80px;
  cursor: pointer;
}
.btn_style {
  width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 2px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 14px;
  margin: 10px 0 20px 80px;
  cursor: pointer;
  float: left;
}
.btn_box {
  height: 30px;
}
.inner_chexing {
  width: 60px;
  float: left;
  height: 20px;
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
.gigi >>> .el-upload-list--text {
  width: 300px !important;
}
.gigi >>> .lable_zhu .el-form-item__label {
  height: 60px;
  line-height: 60px;
}
.gigi >>> .el-upload--text {
  height: 60px;
  display: table-cell;
  vertical-align: middle;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
.gigi >>> .el-form-item__label {
  height: 60px;
  line-height: 60px;
}
</style>
