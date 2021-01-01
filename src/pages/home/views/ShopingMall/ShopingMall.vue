<template>
    <el-main>
        <div class="car-config">
            <div class="search-wrap">
                <el-form :model="search" label-width="70px">
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="商品名：">
                                <el-input v-model="search.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" style="text-align:right">
                            <el-button type="primary" icon="el-icon-search" @click="getTableData">搜索</el-button>
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
                    <el-table-column prop="minPic" label="主图">
                        <template slot-scope="scope">
                            <div @click="showImageDetail(scope.row.minPic,'zhu')" style="width: 100%; height: 100%;" v-if="scope.row.minPic">
                                <img style="width: 60px; height: 40px; display: block;" :src="scope.row.minPic" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mainPic" label="商品图">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showImageDetail(scope.row.mainPic,'pei')" v-show="scope.row.mainPic.length>0"> 查看图片 </el-button>
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
                            <el-button type="text" @click="changeStatus(scope.row.id,scope.row.status)">
                                {{scope.row.status | statusFilter}}
                            </el-button>
                            <el-button type="text" @click="pageTab(false,scope.row.id)">
                                修改
                            </el-button>
                            <el-button type="text" @click="handleDelete(scope.row.id)">
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
        this.getTableData()
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
            util.ajax
                .post('v2.0/shop/list', params)
                .then((res) => {
                    console.log(res)
                    if (parseInt(res.data.code) == 200) {
                        let list = res.data.data
                        this.tableList = this.analyzeData(list)
                        this.tableData = list
                        let total = res.data.data.length
                        this.handleGetTableData(total) // 根据需要增加参数
                    } else if (parseInt(res.data.code) == 3002) {
                        this.$router.push('/Login')
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        getCarBrand(carbrand) {
            let params = new URLSearchParams()
            params.append('carbrand', carbrand)
            util.ajax
                .get('carInfo/queryCardetailed?' + params)
                .then((res) => {
                    if (parseInt(res.data.code) == 301000) {
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        showImageDetail(list, type) {
            if (type == 'zhu') {
                if (list.length != 0)
                    return (this.bigImageUrlList = list), (this.isShowBigImage = true)
            } else {
                if (list.length != 0)
                    return (this.bigImageUrlList = list), (this.isShowBigImage = true)
            }
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
            let params = {
                shopId: shopId,
                status: status,
            }
            //let order = JSON.stringify({ userId: this.id })
            util.ajax
                .post('v2.0/shop/status', params)
                .then((res) => {
                    if (parseInt(res.data.code) == 200) {
                        this.getTableData()
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
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

        //提交
        btnSubmit(value, formName, carType) {
            this.$refs[formName].validate((valid) => {
                switch (value) {
                    case 0: //新增提交
                        this.addFormLabelAlign.vehicleSystem.forEach((item, i) => {
                            //.log(item.vehicleName)
                            item.vehicleType.forEach((value, index) => {
                                if (
                                    !value.vehicleName &&
                                    !value.beginYear &&
                                    !item.vehicleName &&
                                    i > 0
                                ) {
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
                            .then((res) => {
                                if (parseInt(res.data.code) == 301000) {
                                    this.getTableData()
                                    this.showToogle = true
                                    this.modifyFormLabelAlign = {
                                        carbrand: '',
                                        vehicleSystem: [
                                            {
                                                vehicleName: '',
                                                vehicleType: [{ vehicleName: '', beginYear: '' }],
                                            },
                                        ],
                                        imageUrl: '', //上传默认图片路径
                                        initials: '', //首字母
                                    }
                                    this.isDel = [true]
                                    this.carTypeMobleXing = [1]
                                    this.carTypeMobleXi = 1

                                    this.showToogle = true
                                }
                            })
                            .catch(function (err) {
                                console.log(err)
                            })
                        break
                    case 1:
                        let gather = {}
                        if (carType) {
                            //修改车系
                            this.carBrandForm.vehicleSystem.forEach((item, i) => {
                                item.vehicleType.forEach((value, index) => {
                                    if (
                                        !value.vehicleName &&
                                        !value.beginYear &&
                                        !item.vehicleName &&
                                        i > 0
                                    ) {
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
                            .then((res) => {
                                if (parseInt(res.data.code) == 301000) {
                                    this.showToogle = true
                                    this.modifyFormLabelAlign = {
                                        carbrand: '',
                                        vehicleSystem: [
                                            {
                                                vehicleName: '',
                                                vehicleType: [{ vehicleName: '', beginYear: '' }],
                                            },
                                        ],
                                        imageUrl: '', //上传默认图片路径
                                        initials: '', //首字母
                                    }
                                    this.getTableData()
                                    this.showToogle = true
                                }
                            })
                            .catch(function (err) {
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
        },
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
</style>
