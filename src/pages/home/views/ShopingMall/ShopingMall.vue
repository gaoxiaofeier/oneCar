<template>
    <el-main>
        <div class="car-config">
            <div class="search-wrap">
                <el-form :model="search" label-width="70px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="商品名：">
                                <el-input v-model="search.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" :offset="1">
                          <el-form-item label="类别：" label-width="50px">
                            <el-select v-model="search.categoryId" placeholder="请选择类别" style="width:270px;">
                              <el-option v-for="(item ,index) of this.category" :key="index+'a'" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2" :offset="1" style="text-align:right">
                            <el-button type="primary" icon="el-icon-search" @click="getTableData">搜索</el-button>
                        </el-col>
                        <el-col :span="2" :offset="1" style="text-align:right">
                            <el-button type="primary" icon="el-icon-search" @click="addType('new')">新增类别</el-button>
                        </el-col>

                        <el-col :span="5" :offset="2" >
                             <div class="table-wrap">
                                    <el-table :data="typeTable" style="width: 100%" :border="true"  :highlight-current-row='false'>
                                        <el-table-column prop="name" label="类别" style="">
                                        </el-table-column>
                                        <el-table-column prop="name" label="操作">
                                            <template slot-scope="scope">
                                                <div style="text-align:center">
                                                    <el-button type="text" @click="addType('change',scope.row.id)">
                                                        修改
                                                    </el-button>
                                                    <el-button type="text" @click="typeDelete(scope.row.id)">
                                                        删除
                                                    </el-button>
                                                </div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                             </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="tab_btn">
                <span class="tb nactive" @click="pageTab(true)">新增商品</span>
                <!-- <span class="tb nactive" @click="importExcel">导入表格</span> -->
            </div>
            <div class="table-wrap">
                <el-table :data="tableData" style="width: 100%" :border="true" :span-method="objectSpanMethod" :highlight-current-row='false'>
                    <!-- <el-table-column prop="id" label="id">
          </el-table-column> -->
                    <el-table-column prop="id" label="id" style="">

                    </el-table-column>
                    <el-table-column prop="name" label="商品SPU">

                    </el-table-column>
                    <el-table-column prop="categoryName" label="类别">
                    </el-table-column>
                    <el-table-column prop="image" label="主图">
                        <template slot-scope="scope">
                            <div @click="showImageDetail([{'path':scope.row.image}])" style="width: 100%; height: 100%;" v-if="scope.row.image">
                                <img style="width: 60px; height: 40px; display: block;" :src="scope.row.image" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mainPic" label="商品图">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showImageDetail(scope.row.mainPic)" v-show="scope.row.mainPic.length>0"> 查看图片 </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ownSpec" label="SKU">
                        <template slot-scope="scope">
                            {{scope.row.ownSpec | typeFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="commonPrice" label="普通价格">
                    </el-table-column>
                    <el-table-column prop="vipPrice" label="会员价格">
                    </el-table-column>
                    <el-table-column prop="integral" label="积分上限">
                    </el-table-column>
                    <el-table-column prop="stock" label="库存">
                    </el-table-column>
                    <el-table-column prop="id" label="操作">
                        <template slot-scope="scope">
                            <div style="text-align:center">
                                <el-button type="text" @click="changeStatus(scope.row.id,scope.row.status)" style="marin-left:10px;">
                                    {{scope.row.status | statusFilter}}
                                </el-button>
                                <el-button type="text" @click="pageTab(false,scope.row.id)">
                                    修改
                                </el-button>
                                <el-button type="text" @click="handleDelete(scope.row.id)">
                                    删除
                                </el-button>
                            </div>
                            
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-wrap clearfix">
                    <el-pagination v-if="tableData.length > 0" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum" :page-size="pagination.pageSize" layout="total,prev, pager, next, jumper" :total="this.total">
                    </el-pagination>
                </div>
            </div>
            <el-dialog :visible.sync="isShowBigImage" :before-close="handleBigImageClose">
                <div class="img-wrap">
                    <el-carousel trigger="click" v-if="bigImageUrlList.length > 1">
                        <el-carousel-item v-for="(item, index) in bigImageUrlList" :key="index">
                            <img v-if="item.type == 1" :src="item.path" />
                            <video  v-if="item.type == 2" :src="item.path" controls="controls">
                                您的浏览器不支持 video 标签。
                            </video>
                        </el-carousel-item>
                    </el-carousel>
                    <div v-else>
                        <img v-if="bigImageUrlList[0] && bigImageUrlList[0].type == 1" :src="bigImageUrlList[0].path" />
                        <video  v-if="bigImageUrlList[0] && bigImageUrlList[0].type == 2" :src="bigImageUrlList[0].path" controls="controls">
                            您的浏览器不支持 video 标签。
                        </video>
                    </div>      
                    
                </div>
            </el-dialog>
            <!-- 弹窗 -->
            <el-dialog title="编辑商品类别" :visible.sync="typeBox" width="400px">
                <el-form ref="form">
                    <el-form-item label="编辑商品类别" label-width="80px">
                        <div style="width:200px;float:left">
                        <el-input v-model="typeCount"  autocomplete="off"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item style="display: flex;margin-left: 94px;">
                        <el-button type="primary" @click="submitType('add')">确 定</el-button>
                        <el-button @click="resetType('form')">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

    </el-main>

</template>

<script>
import util from '@/libs/util2'
import UserSet from './components/UserSet'
import ConfigeManage from './components/ConfigeManage'

export default {
    components: {
        UserSet,
        ConfigeManage,
    },
    name: 'ShopingMall',
    data() {
        return {
            showToogle: false,
            action: this.$store.getters.uploadImage + 'file/upload',
            search: {
                name: '',
                categoryId:''
            },
            pagination: {
                pageNum: 1,
                pageSize: 20,
            },
            total: 0, // 每次调用接口以后  用后台的total值 重新赋值
            tableData: [],
            tableList: [],
            title: '新增商品',
            isShow: true,
            isDel: [true],
            carBrandChange: false,
            returnImg: '', //返回给后台的url
            activeName: 'first', //tab切换默认选中的标签
            setTab: true, //是新增商品 or 修改商品
            pageState: {},
            shelves: '',
            isShowBigImage: false, //查看图片
            bigImageUrlList: [],
            category:[],
            typeBox:false, //修改类别弹窗
            typeCount:'',  //类别input
            typeTable:[],
            categoryOper:false,  //true 新增类别   false修改类别
            categoryId:''  //修改类别的id
        }
    },
    filters: {
        typeFilter(val) {
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
        statusFilter(val) {
            if (parseInt(val) == 1) {
                return '上架'
            } else {
                return '下架'
            }
        },
    },
    computed: {
        Cinitials: {
            get: function () {
                return this.carBrandForm.initials
            },
            set: function (val) {
                this.carBrandForm.initials = val.toUpperCase()
            },
        },
        Minitials: {
            get: function () {
                return this.modifyFormLabelAlign.initials
            },
            set: function (val) {
                this.modifyFormLabelAlign.initials = val.toUpperCase()
            },
        },
        Ainitials: {
            get: function () {
                return this.addFormLabelAlign.initials
            },
            set: function (val) {
                this.addFormLabelAlign.initials = val.toUpperCase()
            },
        },
    },
    created: function () {
        this.getTableData();
        this.categoryList()
    },

    mounted: function () {},
    methods: {
        pageTab(state, id) {
            this.pageState = { state: state, id: id }
            this.$router.push({ path: '/ShopingMallChange', query: { pageState: this.pageState } })
        },
        modifyTable() {},
        importExcel() {},

        handleDelete(id) {
            this.$confirm('确认删除此商品么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    let params = new URLSearchParams()
                    let ids = parseInt(id)
                    params.append('shopId', ids)
                    util.ajax
                        .delete('v2.0/shop/' + ids) // 以车型为基准 不是以 id
                        .then((res) => {
                            console.log(res)
                            if (parseInt(res.data.code) == 200) {
                                this.$message('删除成功')
                                this.getTableData()
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                })
                .catch(() => {
                    return
                })
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
            var params = this.getSearchParams()
            console.log(params)
            util.ajax
                .post('v2.0/shop/list', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        let list = res.data.data.data
                        this.tableList = this.analyzeData(list) //画表格
                        this.tableData = list
                        let total = res.data.data.total
                        this.handleGetTableData(total) // 根据需要增加参数
                        // this.tableData.forEach((item, index) => {
                        //     console.log(item.mainPic)
                        //     let newArr=item.mainPic
                        //     let returnArr=[]
                        //     newArr.forEach((inner,index)=>{
                        //        returnArr.push(inner.path)
                        //     })
                        //     console.log(returnArr)
                        //     item.mainPic=returnArr
                        //     // item.image =
                        //     //     'http://app-onecar.oss-cn-beijing.aliyuncs.com/oneCar/272aabae-2995-44af-b7ef-c339571dc928.jpg'
                        //     //item.mainPic=["http://app-onecar.oss-cn-beijing.aliyuncs.com/1609651419443_950_011fb337c2f5d0d0463f1ba79e4d9808.jpg"]
                        // })
                    } else if (parseInt(res.data.code) == 3002) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        categoryList(){
            //类别
              util.ajax
                .get('v2.0/shop/category/list')
                .then(res => {
                  if (parseInt(res.data.code) == 200) {
                      this.category=res.data.data
                      this.typeTable=res.data.data
                  }
                })
                .catch(function(err) {
                  console.log(err)
                })
        },
        analyzeData(list) {
            const newArr = []
            const obj = {}
            for (let i = 0; i < list.length; i++) {
                if (i === 0) {
                    obj.row = 1
                    obj.col = 1
                    newArr.push(obj)
                } else {
                    if (list[i].id === list[i - 1].id) {
                        newArr.push({ row: 0, col: 0 })
                        const index = list.findIndex((item) => {
                            return item.id === list[i - 1].id
                        })
                        newArr[index].row++
                    } else {
                        newArr.push({ row: 1, col: 1 })
                    }
                }
            }
            return newArr
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex < 5) {
                const row = this.tableList[rowIndex].row
                const col = this.tableList[rowIndex].col
                return {
                    rowspan: row,
                    colspan: col,
                }
            }
            if (columnIndex == 10) {
                const row = this.tableList[rowIndex].row
                const col = this.tableList[rowIndex].col
                return {
                    rowspan: row,
                    colspan: col,
                }
            }
        },

        handleGetTableData(total) {
            this.total = total
        },
        //商品上下架
        changeStatus(shopId, status) {
            let value = Number
            parseInt(status) == 1 ? (value = 2) : (value = 1)
            let params = {
                shopId: shopId,
                status: value,
            }
            util.ajax
                .post('v2.0/shop/status', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.$message('操作成功')
                        this.getTableData()
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        //查看图片
        handleBigImageClose(done) {
            this.bigImageUrlList = []
            done()
        },
        showImageDetail(list) {
            if (list.length != 0) {
                this.bigImageUrlList = list;
                this.isShowBigImage = true; 
                console.log(this.bigImageUrlList)
            }
        },
        //商品类别增删改
        addType(type,id){
            if(type=='add'){
                this.categoryOper=true
                this.typeBox=true;
            }else{
               this.categoryOper=false
                this.categoryId=id
            }
            this.typeBox=true;
            this.typeCount='';
            
        },
        submitType(){
            if(this.categoryOper){//新增
                let params = {
                    id: '',
                    name: this.typeCount,
                }
                util.ajax
                .post('v2.0/shop/category/renew', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.$message('操作成功');
                        this.typeBox=false;
                        this.categoryList()
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
            }else{
                let params = {
                    id: this.categoryId,
                    name: this.typeCount,
                }
                util.ajax
                .post('v2.0/shop/category/renew', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.$message('操作成功');
                        this.typeBox=false;
                        this.categoryList()
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
            }
        },
        resetType(){
            this.typeCount='';
            this.typeBox=false;
        },
        //删除
        typeDelete(id){

        }
    },
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

.el-table tbody tr:hover > td {
    background-color: red;
}
.car-config >>> .el-dialog .el-dialog__body div.img-wrap {
    text-align: center;
}

.car-config >>> .el-dialog .el-dialog__body div.img-wrap img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
.car-config >>> .el-dialog .el-dialog__body div.img-wrap video {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
.el-button+.el-button {
    margin-left: 0px;
}
</style>
