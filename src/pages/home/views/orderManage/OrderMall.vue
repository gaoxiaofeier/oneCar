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
                            <el-form-item label="商品名：">
                                <el-input v-model="search.shopName" style="width:150px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2" :offset="1">
                            <el-button type="primary" @click="getTableData" icon="el-icon-search">搜索</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" >
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
                    <span class="tb" :class="{'nactive': search.paymentType === 0}" @click="chooseTab1(0)">全部</span>
                    <span class="tb" :class="{'nactive': search.paymentType === 1}" @click="chooseTab1(1)">支付宝</span>
                    <span class="tb" :class="{'nactive': search.paymentType === 2}" @click="chooseTab1(2)">微信</span>

                </div>
                <div class="tab_btn" style="width:380px;">
                    <span class="tb" :class="{'nactive': search.status === 0}" @click="chooseTab2(0)">全部</span>
                    <span class="tb" :class="{'nactive': search.status === 1}" @click="chooseTab2(1)">待付款</span>
                    <span class="tb" :class="{'nactive': search.status === 3}" @click="chooseTab2(3)">未发货</span>
                    <span class="tb" :class="{'nactive': search.status === 4}" @click="chooseTab2(4)">已发货</span>
                    <span class="tb" :class="{'nactive': search.status === 5}" @click="chooseTab2(5)">待解决</span>
                    <span class="tb" :class="{'nactive': search.status === 6}" @click="chooseTab2(6)">已解决</span>
                </div>
                <div class="tab_btn pay">
                    <span class="tb" :class="{'nactive': search.fettle === 1}" @click="chooseTab3(1)">正常订单</span>
                    <span class="tb" :class="{'nactive': search.fettle === 2}" @click="chooseTab3(2)">取消订单</span>
                </div>
            </el-row>
            <div class="table-wrap">
                <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange">
                    <!-- <el-table-column prop="Id" label="Id" width="80">
          </el-table-column> -->
                    <el-table-column prop="orderId" label="订单号" width="120">
                    </el-table-column>
                    <el-table-column prop="phone" label="手机号" width="120">
                    </el-table-column>
                    <el-table-column prop="nickName" label="昵称">
                    </el-table-column>
                    <el-table-column prop="shopName" label="商品名" width="120">
                    </el-table-column>
                    <el-table-column prop="ownSpec" label="商品规格" width="120">
                        <template slot-scope="scope">
                            {{scope.row.ownSpec|elseSpec}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="elseSpec" label="其他规格" width="120">
                        <template slot-scope="scope">
                            {{scope.row.elseSpec|elseSpec}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="buyTime" label="购买时间" width="102px">
                    </el-table-column>
                    <el-table-column prop="paymentType" label="支付方式" width="110" sortable>
                        <template slot-scope="scope">
                            {{scope.row.paymentType|payType}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="actualPay" label="支付金额(分)" width="80">
                        <template slot-scope="scope">
                            {{scope.row.actualPay|formatNull}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="useIntegralNum" label="使用积分" width="80">
                    </el-table-column>
                    <el-table-column prop="num" label="数量" width="80">
                    </el-table-column>
                    <el-table-column prop="shippingCode" label="物流单号" width="80">
                        <template slot-scope="scope">
                            <div @click="changeCode(scope.row)" type="text" size="small" style="min-height:50px;line-height:50px;cursor:pointer;width:100%">
                              {{scope.row.shippingCode}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="solution" label="协商结果" width="80">
                    </el-table-column>
                    <el-table-column prop="remark" label="备注">
                        <template slot-scope="scope">
                        <div @click="changeH(scope.row.orderId)" type="text" size="small" style="min-height:50px;line-height:50px;cursor:pointer;">
                          {{scope.row.remark}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            {{scope.row.status|formateStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140px" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="scope.row.delivery" @click="deliveryBtn(scope.row)" class="status_btn">已发货</el-button>
                            <el-button type="text" v-if="scope.row.sure" class="status_btn" @click="haveProblem(scope.row.orderId)">有问题</el-button>
                            <div v-if="scope.row.solve">
                                <el-button type="text" class="status_btn" @click="noProblem(scope.row.orderId)">无问题</el-button>
                                <el-button type="text" class="status_btn" @click="solutionBtn(scope.row.orderId)">已解决</el-button>
                            </div>
                            <el-button type="text" style="color:red;" @click="cancelOrder(scope.row.orderId)" class="status_btn">
                                取消订单
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrap clearfix">
                    <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
            <!-- 弹窗 -->
            <el-dialog title="物流单号" :visible.sync="logisticsFormVisible" width="400px">
                <el-form ref="form">
                    <el-form-item label="物流单号：" >
                        <el-input v-model="logistics" autocomplete="off" height="20px"></el-input>
                    </el-form-item>
                    <el-form-item style="display: flex;justify-content: flex-end">
                        <el-button type="primary" @click="submitLogistics">确 定</el-button>
                        <el-button @click="resetLogistics">稍后填写</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog tititle="解决方案" :visible.sync="solutionFormVisible" width="400px">
                <el-form ref="form">
                    <el-form-item label="解决方案：" >
                        <el-input type="textarea" v-model="solution"></el-input>
                    </el-form-item>
                    <el-form-item style="display: flex;justify-content: flex-end">
                        <el-button type="primary" @click="submitSolution">确 定</el-button>
                        <el-button @click="resetSolution">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 修改备注弹窗 -->
              <el-dialog title="备注修改" :visible.sync="remarkVisible" width="380px">
                <el-form  >
                  <el-form-item label="备注：" prop="hover" width="60px" style="margin-bottom: 18px;">
                    <el-input type="textarea" v-model="remarkBox" style="width:260px"></el-input>
                  </el-form-item>
                  <div class="dialog-footer" style="text-align:center;">
                    <el-button @click="resetRemark('form')">取 消</el-button>
                    <el-button type="primary" @click="submitRemark()">确 定</el-button>
                  </div>
                </el-form>
              </el-dialog>
        </div>
    </el-main>
</template>
<script>
import util from '@/libs/util2'
export default {
    name: 'OrderMall',
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
        }
        return {
            search: {
                phone: '',
                shopName: '',
                nickName: '',
                paymentType: 0, //付款方式
                status: 0, //1、未付款 2、取消付款（付款失败） 3、未发货 4、已发货 5、待解决 6、已解决
                fettle: 1,
                payTime: [],
            },
            handle: '123',
            pagination: {
                pageNum: 1,
                pageSize: 20,
                total: Number, // 每次调用接口以后  用后台的total值 重新赋值
            },
            sort: {
                prop: '',
                order: '',
            },
            order: '',
            payOrder: '',
            tableData: [],
            logisticsFormVisible: false, //物流弹框
            orderIId: '',
            logistics: '', //弹窗内input
            solutionFormVisible: false, //解决方案弹窗
            solution: '', //弹窗内input
            remarkVisible:false, //备注弹窗
            remarkBox:'',  //备注弹窗input
            remarkId:Number, //备注弹窗传的id
            opType:null, //物流状态，  1：填写单号 2：修改单号
        }
    },
    filters: {
        timeFiltersTime(date) {
            if (date) {
                let dateee = new Date(date).toJSON()
                let newDate = new Date(+new Date(dateee) + 8 * 3600 * 1000)
                    .toISOString()
                    .replace(/T/g, ' ')
                    .replace(/\.[\d]{3}Z/, '')
                return newDate.substring(0, 10)
            }
        },
        formatNull(data) {
            if (data) {
                return data
            } else {
                return 0
            }
        },
        elseSpec(val) {
            if (val == null || val == '') {
                return ''
            } else {
                let value = JSON.parse(val)
                let valStr = ''
                for (let item in value) {
                    valStr += value[item]
                }
                return valStr
            }
        },
        payType(val) {
            switch (val) {
                case 1:
                    return '支付宝'
                    break
                case 2:
                    return '微信'
                    break
            }
        },
        formateStatus(val) {
            switch (val) {
                case 1:
                    return '待付款'
                    break
                case 2:
                    return '取消付款（付款失败）'
                    break
                case 3:
                    return '待发货'
                    break
                case 4:
                    return '已发货'
                    break
                case 5:
                    return '待解决'
                    break
                case 6:
                    return '已解决'
                    break
            }
        },
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
            deep: true,
        },
    },

    created: function () {
        this.getTableData()
    },

    mounted: function () {},

    methods: {
        chooseTab1(tabName) {
            this.search.paymentType = tabName
            this.getTableData()
        },
        chooseTab2(tabName) {
            this.search.status = tabName
            this.getTableData()
        },
        chooseTab3(tabName) {
            this.search.fettle = tabName
            this.getTableData()
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
            if (this.search.payTime.length != 0) {
                this.search.startTime = this.search.payTime[0]
                this.search.endTime = this.search.payTime[1]
            } else {
                this.search.startTime = ''
                this.search.endTime = ''
            }
            let params = Object.assign(this.search, this.pagination)
            return params
        },
        getTableData() {
            var gather = this.getSearchParams()
            util.ajax
                .post('/order/list', gather)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        let list = res.data.data.data
                        list.forEach((item, index) => {
                            if (
                                parseInt(item.status) == 1 ||
                                parseInt(item.status) == 2 ||
                                parseInt(item.status) == 6
                            ) {
                                item.delivery = false
                                item.sure = false
                                item.solve = false
                            } else if (parseInt(item.status) == 3) {
                                item.delivery = true
                                item.sure = false
                                item.solve = false
                            } else if (parseInt(item.status) == 4) {
                                item.delivery = false
                                item.sure = true
                                item.solve = false
                            } else if (parseInt(item.status) == 5) {
                                item.delivery = false
                                item.sure = false
                                item.solve = true
                            } else {
                                item.delivery = false
                                item.sure = false
                                item.solve = false
                            }
                        })
                        this.tableData = list
                        let total = res.data.data.total||0
                        this.handleGetTableData(total)
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },

        handleGetTableData(total) {
            this.pagination.total = total
        },
        //取消订单
        cancelOrder(orderId) {
            var params = {
                orderId: orderId,
                type: 1
            }
            util.ajax
                .post('order/operate', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.$message('取消订单成功')
                        this.getTableData()
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }else{
                        this.$message('取消订单失败')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        //已发货
        deliveryBtn(row) {
            this.logisticsFormVisible = true
            this.logistics= row.shippingCode
            this.orderIId = row.orderId
            this.opType=1
        },
        //物流弹窗提交
        submitLogistics() {
            var params = {
                orderId: this.orderIId,
                shippingCode: this.logistics,
                opType:this.opType
            }
            util.ajax
                .post('order/writeShipping', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.logisticsFormVisible = false
                        this.$message('发货成功')
                        this.getTableData()
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        
        //取消物流提交
        resetLogistics() {
            this.logistics = ''
            this.logisticsFormVisible = false
        },
        //修改物流单号
        changeCode(row){
            if(row.status==4||row.status==5||row.status==6){
                this.logisticsFormVisible = true;
                this.logistics= row.shippingCode;
                this.orderIId = row.orderId;
                this.opType=2
            }else{
                this.$message('待发货，不能填写物流')
                return;
            }

        },
        //解决方案弹窗
        solutionBtn(orderId){
            this.solutionFormVisible = true;
            this.orderIId = orderId
        },
        submitSolution() {
            var params = {
                orderId: this.orderIId,
                solution: this.solution
            }
            util.ajax
                .post('order/writeSolution', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.solutionFormVisible = false
                        this.$message('已提交解决方案')
                        this.getTableData()
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        //解决方案取消提交
        resetSolution() {
            this.solution = '';
            this.solutionFormVisible = false;
            
        },
        //有问题-》待解决状态
        haveProblem(orderId){
            var params = {
                orderId: orderId,
                type: 2
            }
            util.ajax
                .post('order/operate', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.logisticsFormVisible = false
                        this.getTableData()
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        //无问题
        noProblem(orderId){
            var params = {
                orderId: orderId,
                type: 3
            }
            util.ajax
                .post('order/operate', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.$message('返回已发货状态')
                        this.getTableData()
                    } else if (parseInt(res.data.code) == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        //点击备注修改
        changeH(id) {
          this.remarkVisible = true  //备注弹窗
          this.remarkId = id
        },
        resetRemark() {
          this.remarkVisible = false
        },
        submitRemark() {
            if(this.remarkBox){
                let params = {
                    orderId:this.remarkId,
                    remark:this.remarkBox
                }
            util.ajax
                .post('order/writeRemark', params) // 以车型为基准 不是以 id
                .then((res) => {
                   if (parseInt(res.data.code) == 200) {
                        this.remarkVisible = false
                        this.$message('备注修改成功')
                        this.getTableData()
                    }else if (res.data.code == 3003) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
            }else{

            }
            
        }
    },
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
.status_btn {
    width: 55px;
    text-align: left;
    float: left;
    margin-left: 0px;
}
.el-button+.el-button {
    margin-left: 0px;
}
</style>
