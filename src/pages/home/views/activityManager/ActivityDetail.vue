<template>
  <el-main>
    <div class="main_inner">
      <div style="">
        <div class="act_out">
          <p class="act_title">{{this.titleData.actName}}</p>
          <el-row :gutter="20" style="font-size:18px;">

            <el-col :span="6">
              <div>
                <span class="user_name">地点：</span>
                <span class="user_inf">{{this.titleData.actLocation}}</span>
              </div>

            </el-col>
            <el-col :span="7">
              <div>
                <span style="float:left">活动时间：</span>
                <div style="float:left">
                  <span class="">{{this.titleData.date|timeFiltersTime}}</span>
                  <span>{{this.titleData.startTime}}</span>~<span>{{this.titleData.endTime}}</span>
                </div>

              </div>
            </el-col> 
            <el-col :span="4">
              <div>
                <span>剩余名额：</span>
                <span>{{this.titleData.lastCount+'/'+this.titleData.allCount}}</span>
              </div>
            </el-col>
            <!--  改--后续要加上的1 -->
            <el-col :span="6">
              <div>
                <span style="float:left">天气：</span>
                <el-input v-model="weather" size="mini"  style="float:left;width:100px;margin-top:-5px"></el-input>
                <div class="weather_change"  @click="weatherChange(weather,titleData.actId)" style="float:left;">修改</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="height:30px;background:rgba(240, 242, 245, 1);"></div>
      </div>
      <div style="padding:20px 20px 30px">
        <div class="search-wrap">
          <el-form :model="search" label-width="70px" label-position="left">
            <el-row>
              <el-col :span="5">
                <el-form-item label="手机号：">
                  <el-input v-model="search.phone" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-form-item label="昵称：">
                  <el-input v-model="search.nickName" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="2">
                <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
            <!-- <div class="add_btn" >导出表格</div> -->
            <div class="hand_join"  @click="handJoin()">手动添加</div>
        </div>
        <div class="table-wrap">
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column prop="phone" label="手机号" width="110">
            </el-table-column>
            <el-table-column prop="nickName" label="昵称">
            </el-table-column>
            <el-table-column prop="trueName" label="真实姓名" style="">
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
            <el-table-column prop="vip1" label="VIP状态">
              <template slot-scope="scope" v-if="parseInt(scope.row.vip1)">
                {{'年费会员'}}
              </template>
              <template slot-scope="scope" v-if="parseInt(scope.row.vip2)">
                {{'畅跑会员'}}
              </template>
            </el-table-column>
            <el-table-column label="参赛车辆">
              <template slot-scope="scope">
                <!-- 品牌车系，车型，年份，排量 后台没给-->
                {{scope.row.carBrand+','+scope.row.carName+','+scope.row.carType+','+scope.row.carYear+','+scope.row.ed}}
              </template>
            </el-table-column>
            <!--  改--后续要加上的2 -->
            <el-table-column prop="tyre" label="轮胎">
                <template slot-scope="scope">
                    <div @click="changeL(scope.row)" type="text" size="small" style="min-height:50px;line-height:50px;cursor:pointer;">
                      <div style="width:100%;height:100%;" v-if="scope.row.tyre">
                        {{scope.row.tyre}}
                      </div>
                      <div v-else>
                          {{'--'}}
                      </div>
                    </div>
              </template>
            </el-table-column>
            <el-table-column prop="lastlap" label="赛道历史圈速" :width=90>
              <template slot-scope="scope">
                <div @click="changeH(scope.row)" type="text" size="small" style="min-height:50px;line-height:50px;cursor:pointer;">
                  <div style="width:100%;height:100%;" v-if="scope.row.lastlap">
                    {{scope.row.lastlap.substr(0,2)+':'+scope.row.lastlap.substr(2,2)+'.'+scope.row.lastlap.substr(4)}}
                  </div>
                  <div style="width:100%;height:100%;" v-else>
                      {{'00:00:000'}}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="userCount" sortable label="参加活动次数">
            </el-table-column>
            <el-table-column label="是否参与活动">
              <template slot-scope="scope">
                {{scope.row.ifAct|actFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="rem" label="备注">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <!-- 确认：当是否参与活动状态为否时，点击确认后 状态改为 是  取消：当状态为 是 时，点击取消后 状态改为 否 -->
              <template slot-scope="scope">

                <el-button type="text" size="small" v-if="scope.row.ifAct" style="color:red" @click.native.prevent="joinAct(scope.row)">
                  取消
                </el-button>
                <el-button type="text" size="small" v-else @click.native.prevent="joinAct(scope.row)">
                  确认
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
      <!-- 赛道历史圈速弹窗 -->
      <el-dialog :visible.sync="dialogFormVisible" width="400px">
        <el-form :model="form" ref="form" :rules='rules' :validate-on-rule-change="false">
          <el-form-item label="分钟：" prop="hover" :label-width="formLabelWidth" style="margin-bottom: 18px;">
            <el-input v-model="form.hover" autocomplete="off" style="width:270px;"></el-input>
          </el-form-item>
          <el-form-item label="分秒：" prop="minute" :label-width="formLabelWidth" style="margin-bottom: 18px;">
            <el-input v-model="form.minute" autocomplete="off" style="width:270px"></el-input>
          </el-form-item>
          <el-form-item label="毫秒：" prop="second" :label-width="formLabelWidth" style="margin-bottom: 18px;">
            <el-input v-model="form.second" autocomplete="off" style="width:270px;"></el-input>
          </el-form-item>
          <div class="dialog-footer" style="text-align:center;">
            <el-button @click="resetForm('form')">取 消</el-button>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 轮胎弹窗 -->
      <el-dialog :visible.sync="tyreVisible" width="400px">
        <el-form :model="tyreForm" ref="tyreForm" :rules='tyreRules' :validate-on-rule-change="false">
          <el-form-item label="轮胎：" prop="tyre" :label-width="formLabelWidth" style="margin-bottom: 18px;">
            <el-input v-model="tyreForm.tyre" autocomplete="off" style="width:270px;"></el-input>
          </el-form-item>
         
          <div class="dialog-footer" style="text-align:center;">
            <el-button @click="tyreResetForm('tyreForm')">取 消</el-button>
            <el-button type="primary" @click="tyreSubmitForm('tyreForm')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
      <!-- 手动添加一条报名信息弹窗 -->
      <el-dialog :visible.sync="handJoinVisible" :title="boxTitle"  width="500px"   v-if="innerVisible">
        <el-form :model="handForm" ref="handForm" :rules='joinRules' :validate-on-rule-change="false" >
          <el-form-item label="用户：" prop="userName" :label-width="handLabelWidth" label-position='right' style="margin-bottom: 18px;">
            <el-input v-model="handForm.userName" autocomplete="off" style="width:270px;"></el-input>
            <div class="guan_lian" @click="connect">关联</div>

          </el-form-item>
          <el-form-item label="选用赛车：" prop="userCarId" :label-width="handLabelWidth" label-position='right' style="margin-bottom: 18px;">
            <el-select v-model="handForm.userCarId" placeholder="请选择" style="width:270px;">
                 <el-option v-for="(item ,index) of this.car_w" :key="index+'b'" :label="item.label" :value="item.value"></el-option>

            </el-select>

          </el-form-item>
          
          <el-form-item label="实付金额：" prop="money" :label-width="handLabelWidth" label-position='right' style="margin-bottom: 18px;">
            <el-input v-model.number="handForm.money" autocomplete="off" style="width:270px;"></el-input>
          </el-form-item>
          <el-form-item label="是否使用优惠券：" prop="isCoupon" :label-width="handLabelWidth" label-position='right' v-if="couponState">
            <template>
                <el-radio v-model="handForm.isCoupon" label='0'>使用</el-radio>
                <el-radio v-model="handForm.isCoupon" label='1'>不使用</el-radio>
            </template>
        </el-form-item>
         <el-form-item label="备注：" prop="rem" style="max-width:550px;" :label-width="handLabelWidth" label-position='right'>
          <el-input type="textarea" v-model="handForm.rem"  style="width:270px;"></el-input>
        </el-form-item>
          <div class="dialog-footer" style="text-align:center;">
            <el-button @click="handResetForm('handForm')">取 消</el-button>
            <el-button type="primary" @click="handSubmitForm('handForm')">确 定</el-button>
          </div>
        </el-form>
        
      </el-dialog>
      <el-dialog :visible.sync="handJoinVisible" :title="boxTitle"  v-else width="1100px" :before-close="joinInnerClose">
         <div class="search-wrap">
            <el-form :model="searchInner" label-width="70px">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="手机号：">
                    <el-input v-model="searchInner.phone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="昵称：">
                    <el-input v-model="searchInner.nickName"></el-input>
                  </el-form-item>
                </el-col>
               
                <el-col :span="2"  :offset="6">
                  <el-button type="primary" @click="getInnerTableData" icon="el-icon-search">搜索</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
         
        <div class="table-wrap">
            <el-table :data="innerTableData" border style="width: 100%" @sort-change="handleSortChange">
               <el-table-column label="" width="55">
                    <template slot-scope="scope">
                       <el-radio :label="scope.$index" v-model="connectRadio" @change.native="getConnectRow(scope.row)">{{&nbsp;}}</el-radio>
                    </template>
               </el-table-column>
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
              <el-table-column prop="rem" label="备注">
              </el-table-column>
              <!-- <el-table-column label="操作" fixed='right'>
                <template slot-scope="scope">
                  <el-button @click.native.prevent="handleClickView(scope.row)" type="text" size="small">
                    查看
                  </el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="pagination-wrap clearfix" style="height:40px;margin-bottom:5px"> 
              <el-pagination v-if="innerTableData.length > 0" @current-change="handleCurrentChangeInner" :current-page.sync="paginationInner.pageNum" :page-size="paginationInner.pageSize" layout="total,prev, pager, next, jumper" :total="innerTtotalTr">
              </el-pagination>
            </div>
          </div>
           <div class="dialog-footer" style="text-align:center;">
            <el-button @click="connectResetForm">取 消</el-button>
            <el-button type="primary" @click="connectResult">确 定</el-button>
          </div>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
import { export_json_to_excel } from '@/public/Export2Excel'
import util from '@/libs/util'
import util2 from '@/libs/util2'

export default {
  name: 'UserDetail',
  data() {
    return {
      search: {
        phone: '',
        nickName: '',
        actId: JSON.parse(this.$route.query.row).actId
        // actId: this.$route.query.row.actId ? this.$route.query.row.actId : 1
      },
      searchInner:{
        phone: '',
        nickName: '',
      },
      tableData: [],
      innerTableData:[],//弹窗内表格数据
      userTableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 20
      },
      paginationInner: {
        pageNum: 1,
        pageSize: 5
      },
      sort: {  //手动加数据--赛车字段--排序
        prop: 'date',
        order: 'descending'
      },
      totalTr: 0, // 每次调用接口以后  用后台的total值 重新赋值
      innerTtotalTr: 0, // 每次调用接口以后  用后台的total值 重新赋值
      dialogFormVisible: false,  //赛道历史圈速弹窗
      tyreVisible: false,  //轮胎弹窗
      handJoinVisible:false,  //手动添加一条报名信息弹窗
      innerVisible:true, //手动添加报名信息弹窗 ---内部小弹窗隐藏/显示
      connectRadio:'', //手动添加报名信息弹窗 ---关联--单选框数据
      connectRadioRsult:'',// 手动添加报名信息弹窗 ---关联--单选框选择结果
      form: {
        hover: '', //时
        minute: '', //分
        second: '' //秒
      },
      tyreForm:{
        tyre:''//轮胎
      },
      tyreUserId:'',//修改轮胎存的用户id
      car_w: [], // [型号1，型号2]
      handForm:{
          userName:'',
          userCarId:'',
          money:'',
          isCoupon: '1',  //0为使用优惠券，1不使用
          rem:''
      },
      couponState:true,
      boxTitle: '手动添加', //弹窗标题
      rules: {
        hover: [
          { required: true, message: '分钟不能为空', trigger: ['blur', 'change'] },
          { pattern: /^\d{1,2}$/, message: '分钟最大为99', trigger: ['blur', 'change'] }
        ],
        minute: [
          { required: true, message: '分秒不能为空', trigger: ['blur', 'change'] },
          { pattern: /^\d{1,2}$/, message: '分秒最大为99', trigger: ['blur', 'change'] }
        ],
        second: [
          { required: true, message: '毫秒不能为空', trigger: ['blur', 'change'] },
          { pattern: /^\d{1,3}$/, message: '毫秒最大位999', trigger: ['blur', 'change'] }
        ]
      },
      joinRules: {
        userName: [{ required: true, message: '用户名不能为空', trigger: ['blur', 'change'] },],
        userCarId: [{ required: true, message: '赛车不能为空', trigger: 'blur' }],
        
        isCoupon: [
          { required: true, message: '优惠券不能为空', trigger: ['blur'] }
        ],
        money: [
          { required: true, message: '金额不能为空', trigger: ['blur', 'change'] },
          { type: 'number', message: '金额必须为数字值',trigger: ['blur', 'change']}
        ],
      },
     tyreRules: {
        tyre: [
          { required: true, message: '轮胎不能为空', trigger: ['blur', 'change'] },
        ]
      },
      formLabelWidth: '65px',
      handLabelWidth: '135px',
    //   titleData: {
    //     actLocation: '-',
    //     date: '',
    //     allCount: '-',
    //     lastCount: '-',
    //     startTime: '',
    //     endTime: '',
    //     actId:''
    //   },
      titleData:JSON.parse(this.$route.query.row),
      lapType: true, //圈速值不为空
      row: '', //表中每一行的数据
      weather:''  //天气
    }
  },
  filters: {
    actFilter(status) {
      switch (status) {
        case 1:
          return '是';
        case 0:
          return '否';
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
        return newDate.substring(0, 10);;
      }
    },
    timeFilters(date) {
      if (date) {
        let dateee = new Date(date).toJSON()
        let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return newDate.substring(0, 10);
      }
    },
  },
  created: function() {
    this.getTableData()
  },
  methods: {
    //天气修改
    weatherChange(weather,actId){
        let params = new URLSearchParams()
        params.append('actId', actId)
        params.append('weather', weather)
        util.ajax
        .get('activity/updateWeather?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.$message('天气修改成功')
          } else if (parseInt(res.data.code) == 20007) {
            this.$router.push('/Login')
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    chooseTab(tabName) {
      this.search.tabName = tabName
    },

    handleClickView(index, row) {
      // https://www.jianshu.com/p/5dff306fdb0f
      this.$router.push({ path: '/UserDetail', query: { row: JSON.parse(JSON.stringify(row)) } })
    },

    handleCurrentChange(currentPage) {
      this.pagination.pageNum = currentPage
      // 调用接口
      this.getTableData()
    },
    handleCurrentChangeInner(currentPage) {
      this.pagination.pageNum = currentPage
      // 调用接口
      this.getInnerTableData()
    },

    getSearchParams() {
      // 根据后台字段 对应修改
      // 最好是和后台保持一致

      // 处理 regTime 成后台接受的时间格式
      let params = Object.assign(this.search, this.pagination)
      return params
    },
    getInnerSearchParams() {
      // 根据后台字段 对应修改
      // 最好是和后台保持一致

      // 处理 regTime 成后台接受的时间格式
      let params = Object.assign(this.searchInner, this.paginationInner)
      return params
    },

    getTableData() {
      var params = this.getSearchParams()
      let gather = JSON.stringify({
        pageNum: 1,
        pageSize: 20
      })
      // ajax  queryDetailsActivity
      util.ajax
        .post('activity/queryDetailsActivity', params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            if (res.data.data.dataList.length) {
              this.titleData = res.data.data.dataList[0]
              this.weather=this.titleData.weather  //天气数据
              this.tableData = res.data.data.dataList
              let total = res.data.data.totalSize || 0
              this.handleGetTableData(total) // 根据需要增加参数
            }
          } else if (parseInt(res.data.code) == 20007) {
            this.$router.push('/Login')
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    getInnerTableData() {
     var gather = this.getInnerSearchParams()
     this.connectRadio=''
     
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
            this.innerTableData = res.data.data.dataList
            let total = res.data.data.totalSize || 0
            this.handleGetTableData2(total)  
          } else if (parseInt(res.data.code) == 20007) {
            this.$router.push('/Login')
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    //赛车字段 排序
    handleSortChange(sort) {
      this.sort = sort
    },
    handleGetTableData(total) {
      this.totalTr = total
    },
    handleGetTableData2(total) {
      this.innerTtotalTr = total
    },

    //手动添加一条数据
    handJoin(){
        this.handJoinVisible=true
        this.handForm={
          userName:'',
          userCarId:'',
          money:'',
          isCoupon: '1',  //0为使用优惠券，1不使用
          rem:''
        }
    },
    //手动添加数据  关联按钮点击
    connect(){
        this.innerVisible=false
        this.searchInner.nickName=''
        this.searchInner.phone=''
       // this.connectRadioRsult=''
        this.getInnerTableData()
    },
    //手动添加--关联--选中一条数据
    getConnectRow(row){
        
        if(parseInt(row.cars)!==0){
            this.connectRadioRsult=row
        }else{
            this.connectRadioRsult='';
            this.$message('请选择已绑定赛车的用户！');
        }
    },
    connectResult(){
        if(this.connectRadioRsult==''){
            this.$message('请选择已绑定赛车的用户！');
        }else{
                this.innerVisible=true
                console.log(this.connectRadioRsult)
                this.handForm.userName=this.connectRadioRsult.phone
                //关联成功把赛道、赛道选中数据清空
                this.car_w=[]
                this.handForm.userCarId=''
                //判断是否使用优惠券是否展示  coupon:0 =》有优惠券，coupon:1 =》没优惠券
                if(!this.connectRadioRsult.coupon){
                    this.couponState=true
                }else{
                    this.handForm.isCoupon=1
                    this.couponState=false
                }
                //用户赛车
                let params = new URLSearchParams()
                params.append('userId', this.connectRadioRsult.userId)
                 util.ajax
                    .get('user/queryUserCarInfo?' + params)
                    .then(res => {
                      if (parseInt(res.data.code) == 301000) {
                         
                         res.data.data.data.forEach((item, index, array) => {
                            let temp={value:item.userCarId,label:item.carBrand+item.carName}
                            this.car_w.push(temp)
                        })
                        console.log(this.car_w)
                        
                      } 
                    })
                    .catch(function(err) {
                      console.log(err)
                })
            
        }
        
    },
    //点击赛道历史圈速修改
    changeH(row) {
      this.dialogFormVisible = true
      this.row = row

      if (row.lastlap) {
        this.form.hover = row.lastlap.substring(0, 2)
        this.form.minute = row.lastlap.substring(2, 4)
        this.form.second = row.lastlap.substr(4)
        //this.lapType = true
      } else {
        this.form = {
          hover: '', //时
          minute: '', //分
          second: '' //秒
        }
        //this.lapType = false //原laplast没有值，状态false为新增
      }
    },
    //点击轮胎修改
    changeL(row) {
      this.tyreVisible = true
      this.tyreUserId=row.id
      if (row.tyre) {
        this.tyreForm.tyre = row.tyre  //数据参数看后台咋定，要改
      } else {
        this.tyreForm.tyre = ''
      }
    },
    //点击轮胎关闭弹窗
    tyreResetForm(formName) {
      this.$refs[formName].resetFields()
      this.tyreVisible = false
    },
    //点击提交轮胎修改数据，关闭弹窗
    tyreSubmitForm(formName){
        this.$refs[formName].validate(valid => {
            if (valid) {
              
              let params = new URLSearchParams()
              params.append('id', this.tyreUserId)
              params.append('tyre', this.tyreForm.tyre)
              util.ajax
                .get('activityOrder/updateTyre?' + params)
                .then(res => {
                  if (parseInt(res.data.code) == 301000) {
                    this.tyreVisible = false
                    this.$message('轮胎修改成功！')
                    this.getTableData()
                  }
                })
                .catch(function(err) {
                  console.log(err)
                })
              
              
            }
        })
    },
    joinAct(row) {
      let state = ''
      if (row.ifAct) {
        state = 0
      } else {
        state = 1
      }
      let params = new URLSearchParams()
      params.append('id', row.id)
      params.append('ifAct', state)
      util.ajax
        .get('activityOrder/updateOrderActivity?' + params)
        .then(res => {
          if (parseInt(res.data.code) == 301000) {
            this.dialogFormVisible = false
            this.getTableData()
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    },
    //关闭关联--手动添加弹窗
    joinInnerClose(){
        this.innerVisible=true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let hover = this.form.hover < 10 ? '0' + parseInt(this.form.hover) : this.form.hover
          let minute = this.form.minute < 10 ? '0' + parseInt(this.form.minute) : this.form.minute
          let second = ''
          if (this.form.second < 10) {
            second = '00' + parseInt(this.form.second)
          } else if (this.form.second < 100) {
            second = '0' + parseInt(this.form.second)
          } else {
            second = this.form.second
          }
          let time = hover + minute + second
          let temp = {
            id: this.row.id,
            trackId: this.row.trackId,
            userId: this.row.userId,
            nickName: this.row.nickName,
            actTime: this.row.date,
            actId: this.row.actId,
            carBrand: this.row.carBrand,
            carType: this.row.carType,
            carName: this.row.carName,
            year: this.row.carYear,
            ed: this.row.ed,
            lastlap: time
          }
          let params = temp
          util.ajax
            .post('activity/updateLastLap', params)
            .then(res => {
              if (parseInt(res.data.code) == 301000) {
                this.dialogFormVisible = false
                this.getTableData()
                this.$refs[formName].clearValidate()
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }
      })
    },
    //手动添加用户--表单提交
    handSubmitForm(formName){
        this.$refs[formName].validate(valid => {
            if (valid) {
            let activityData=JSON.parse(this.$route.query.row)
              let params={
                  userId:this.connectRadioRsult.userId,
                  actId:this.titleData.actId,
                  userCarId:this.handForm.userCarId,
                  money:this.handForm.money,
                  isCoupon:this.handForm.isCoupon,
                  rem:this.handForm.rem,
                  integral:''
              }
              util.ajax
                .post('activityOrder/insertOrderActity', params)
                .then(res => {
                  if (parseInt(res.data.code) == 301000) {
                    this.handJoinVisible = false
                    this.getTableData()
                    this.$refs[formName].clearValidate()
                  }
                })
                .catch(function(err) {
                  console.log(err)
                })
             }
      })
    },
    handResetForm(formName) {
      this.$refs[formName].resetFields()
      this.handJoinVisible = false
    },
    connectResetForm(formName) {
      this.innerVisible = true  
    },
    //导出表格
    export2Excel() {
      require.ensure([], () => {
        const tHeader = [
          '手机号',
          '昵称',
          '真实姓名',
          '身份证',
          '性别',
          '血型',
          '身高',
          '体重',
          'VIP状态',
          '参赛车辆',
          '赛道历史圈速',
          '是否参与活动',
          '备注'
        ] // 对应表格输出的中文title

        const filterVal = ['name', 'address', 'date'] // 对应表格输出的数据

        const list = this.tableData // 表格data

        const data = this.formatJson(filterVal, list)

        export_json_to_excel(tHeader, data, 'xlsx') // 对应下载文件的名字
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
  padding-bottom: 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.act_out {
  border-radius: 6px;
  width: 100%;
  height: 118px;
  background-color: #fff;
  padding: 10px 20px 0 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.act_title {
  color: #333;
  font-size: 22px;
  height: 60px;
  line-height: 60px;
}
.inf_box {
  color: #666;
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
.user_inf {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
}
.user_name {
  width: 55px;
  float: left;
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
  margin: 10px 30px 20px 0;
  float: left;
}
.add_btn:hover {
  cursor: pointer;
}
.hand_join {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 14px;
  margin: 10px 30px 20px 0;
  float: left;
}
.hand_join:hover {
  cursor: pointer;
}
.weather_change{
  width: 40px;
  height: 29px;
  line-height: 29px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 12px;
  margin: -6px 30px 20px 20px;
  float: left;
}
.weather_change:hover {
  cursor: pointer;
}
.el-form-item {
  margin-bottom: 10px;
}
.main_inner .el-pagination {
  float: right;
  margin-right: 40px;
}
.guan_lian{
  width:50px;
  position:absolute;
  right:0px;
  top:1px;
  height:40px;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(24, 144, 255, 1);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
</style>
