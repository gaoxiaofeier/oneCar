<template>
    <el-main>
        <div class="car-config-change">
            <p class="mi_title">{{title}}</p>
            <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="用户管理" name="first">
                    <el-form :rules="formRules" ref="form" label-position="right" label-width="100px" :model="formLabel">
                        <el-form-item label="商品名：" prop="name">
                            <div style="width:200px;heigh:30px;">
                                <el-input v-model="formLabel.name" class="c_ipt"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="商品类别：">
                            <div style="width:200px;heigh:30px;">
                                 <el-select v-model="formLabel.categoryName" placeholder="请选择类别" >
                                  <el-option v-for="(item ,index) of this.category" :key="index+'a'" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <!-- <el-input v-model="formLabel.categoryName" class="c_ipt"></el-input> -->
                            </div>
                           
                        </el-form-item>
                        <el-form-item label="商品缩略图：" class="gigi">
                            <el-upload class="avatar-uploader" :limit="1" :action="this.action" :show-file-list="true" :on-success="successSuolue" :before-upload="beforeUpload" :on-remove="removePic">
                                <span v-if="formLabel.image">
                                    <img :src="formLabel.image" class="avatar">
                                </span>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <p class="img_font">文件像素300x100，支持jpg,png,jpeg文件，最多上传一张</p>
                        </el-form-item>
                        <el-form-item label="商品配图：" class="gigi">
                            <el-upload :action="action" ref="upload" multiple :limit="9" :on-success="successPei" :before-upload="beforeUploadAll" :http-request="httpUpload" list-type="picture-card" :on-remove="handleRemove" :file-list="formLabel.mainPic">
                                <div class="hidden" @click="pointHidden('peitu')">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </el-upload>
                            <div style="width:303px">
                                <el-progress v-show="showProgress" :text-inside="true" :stroke-width="15" :percentage="progress"></el-progress>
                            </div>
                            <p class="img_font">文件像素600x200，支持jpg,png,jpeg,mp4文件，最多上传九个</p>
                        </el-form-item>
                        <!-- <el-form-item label="商品视频：" class="gigi">
                            <el-upload class="avatar-uploader" :limit="1" :action="this.action" :show-file-list="true" :on-success="succesVideo" :before-upload="beforeUploadVideo" :on-remove="removePicVideo">
                                <span v-if="formLabel.video">
                                    <img :src="formLabel.video" class="avatar">
                                </span>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <p class="img_font">文件像素300x100，支持jpg,png,jpeg文件，最多上传一张</p>
                        </el-form-item> -->
                        <el-form-item label="图文介绍：" class="gigi">
                            <el-upload :action="action" ref="upload2" multiple :limit="9" :on-success="successDes" :before-upload="beforeUpload" :http-request="httpUploadDes" list-type="picture-card" :on-remove="handleRemoveDes" :file-list="formLabel.descPic">
                                <div class="hidden" @click="pointHidden('jieshao')">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </el-upload>
                            <div style="width:303px">
                                <el-progress v-show="showProgressDes" :text-inside="true" :stroke-width="15" :percentage="progressDes"></el-progress>
                            </div>
                            <p class="img_font">文件像素300x100，支持jpg,png,jpeg文件，最多上传九张</p>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="second">
                    <div>
                        <p>商品规格:</p>
                        <div class="shop_box" v-for="(item,index) in formLabel.specs" :key="index">
                            <i class="el-icon-error close_form" @click="closeSpecsVal(index,0,'outer')"></i>
                            <el-form label-position="right" label-width="100px">
                                <el-form-item label="规格名：" prop="name">
                                    <div style="width:200px;heigh:30px;">
                                        <el-input v-model="item.name" class="c_ipt"></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item label="规格值：" class="cici">
                                    <draggable v-model="item.vals">
                                        <transition-group>
                                            <div style="width:100px;heigh:30px;position:relative;float:left;" v-for="(innerItem,innerIndex) in item.vals" :key="innerIndex+'li'">
                                                <i class="el-icon-error close_form2" @click="closeSpecsVal(index,innerIndex,'inner')"></i>
                                                <el-input v-model="innerItem.value" class="specs_ipt"></el-input>
                                                <el-upload v-if="item.needPic" class="avatar-uploader" :limit="1" :action="action" :show-file-list="true" :on-success="successInnerPic.bind(null, {'outerIndex':index,'innerIndex':innerIndex,'data':innerItem})" :on-remove="removeForPic.bind(null,{'innerIndex':innerIndex})" :before-upload="beforeUpload">
                                                    <span v-if="innerItem.pic">
                                                        <img :src="innerItem.pic" class="avatar">
                                                    </span>
                                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                </el-upload>
                                            </div>
                                        </transition-group>
                                    </draggable>
                                    <el-button type="text" @click="addSpecsVal(index,'inner')">添加规格值</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div style="margin-top:20px;">
                            <el-button type="primary" @click="addSpecs">添加规格</el-button>
                            <el-button type="text" @click="createTable">生成规格明细</el-button>
                        </div>
                    </div>
                    <div v-if="collect">
                        <p class="space">规格明细:</p>
                        <el-table :data="formLabel.skus" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
                            <el-table-column prop="specsName1" :label="skusName[0].name" v-if="skusName[0].state">
                            </el-table-column>
                            <el-table-column prop="specsName2" :label="skusName[1].name" v-if="skusName[1].state">
                            </el-table-column>
                            <el-table-column prop="specsName3" :label="skusName[2].name" v-if="skusName[2].state">
                            </el-table-column>
                            
                            <el-table-column prop="commonPrice" label="普通价格（元）">
                                <template slot-scope="scope">
                                    <input v-model.number="scope.row.commonPrice" type="number" @blur="onBlur($event)" class="table_ipt" style="width:40px">
                                </template>
                            </el-table-column>
                            <el-table-column prop="vipPrice" label="VIP价格（元）">
                                <template slot-scope="scope">
                                    <input v-model.number="scope.row.vipPrice" type="number" class="table_ipt" style="width:40px;">
                                </template>
                            </el-table-column>
                            <el-table-column prop="integral" label="可用积分">
                                <template slot-scope="scope">
                                    <input v-model.number="scope.row.integral" type="number" class="table_ipt" style="width:60px;">
                                </template>
                            </el-table-column>
                            <el-table-column prop="stock" label="库存">
                                <template slot-scope="scope">
                                    <input v-model.number="scope.row.stock" class="table_ipt" style="width:60px;">
                                </template>
                            </el-table-column>
                            <el-table-column prop="remark" label="备注">
                                <template slot-scope="scope">
                                    <input type="text" v-model="scope.row.remark" class="table_ipt" style="width:120px;">
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="collect">
                            <p class="collect_font">批量设置：</p>
                            <span class="collect_color" @click="openPrice('jiage')">价格</span>
                            <span class="collect_color" @click="openPrice('kucun')">库存</span>
                        </div>
                        <div style="overflow:hidden;margin:10px 0">
                            <span class="price_font">价格：</span>
                            <input v-model="formLabel.minPrice" class="price_ipt" disabled />
                        </div>
                    </div>

                    <div>
                        <p class="space">其他相关:</p>
                        <el-form label-position="right" label-width="100px">
                            <el-form-item label="运输费：" prop="name">
                                <div style="width:200px;heigh:30px;">
                                    <el-input v-model="formLabel.postFee" @input="formLabel.postFee=formLabel.postFee.replace(/[^\d]/g,'')" class="c_ipt" placeholder="不输入则不提供运输"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item label="其他规格名：" prop="name">
                                <div style="width:200px;heigh:30px;">
                                    <el-input v-model="formLabel.elseSpecInfos[0].name" class="c_ipt" placeholder="请输入规格名，如颜色"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item label="其他规格值：" prop="name">
                                <div style="overflow:hidden;float:left;">
                                    <div style="width:250px;heigh:30px;position:relative;margin-bottom:10px;" v-for="(item,j) in formLabel.elseSpecInfos[0].vals" :key="j+'logo'">
                                        <i class="el-icon-error close_form2" @click="closeSpecsVal(j,0,'other')"></i>
                                        <el-input v-model="item.value" class="specs_ipts" placeholder="请输入规格值"></el-input>
                                        <el-input v-model="item.price" @input="item.price=item.price.replace(/[^\d]/g,'')" class="specs_ipts no_number" placeholder="请输入价格"></el-input>
                                    </div>
                                </div>
                                <el-button type="text" @click="addSpecsVal('','other')" style="float:left;">添加规格值</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div class="btn_box">
                <span class="btn_style submit" @click="btnSubmit(0,'add')">提交</span>
                <span class="btn_style cancle" @click="btnCancle('form')">取消</span>
            </div>
            <!-- 弹窗 -->
            <el-dialog title="批量设置" :visible.sync="collectbox" width="400px">
                <el-form ref="form">
                    <el-form-item :label="boxTitle" label-width="80px">
                        <div style="width:200px;float:left">
                        <el-input v-model="collectCount" @input="collectCount=collectCount.replace(/[^\d]/g,'')" autocomplete="off"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item style="display: flex;margin-left: 94px;">
                        <el-button type="primary" @click="submitCollect('form')">确 定</el-button>
                        <el-button @click="resetCollect('form')">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </el-main>
</template>
<script>
import util from '@/libs/util2'
import { ossClient } from '@/libs/alioss'
import draggable from 'vuedraggable'
import play  from '@/assets/play.jpg'
export default {
    name: 'ShopingMallChange',
    components: {
        draggable,
    },
    data() {
        return {
            showToogle: false,
            action: this.$store.getters.uploadImage + 'file/upload',
            title: '新增商品',
            activeName: 'first', //tab切换默认选中的标签
            //基本信息tab页
            formLabel: {
                name: '', //商品名称
                categoryName: '', //商品分类
                image: '', //	缩略图
                mainPic: [], //商品配图 可传递视频  type文件类型 1:图片 2：视频，，path: 文件路径
                descPic: [], //图文介绍  同上
                specs: [{ name: '第一', needPic: 1, vals: [{ value: '', pic: '' }] }],
                skus: [],
                minPrice: 0,
                postFee: null,
                elseSpecInfos: [{ name: '', vals: [{ value: '', price: null }]}],
            },
            formRules: {
                name: [{ required: true, message: '商品名不能为空', trigger: 'blur' }],
            },
            formRules2: {
                name: [{ required: true, message: '商品名不能为空', trigger: 'blur' }],
            },

            collect: false,
            collectbox: false,
            boxTitle: '价格：',
            collectCount: '', //批量input值
            collectState: true, //true 价格批量，false库存批量
            showProgress: false, //上传配图 进度条
            showProgressDes: false, //上传图文介绍 进度条
            progress: 0, //进度条数据
            progressCount: 0, //上传配图 累加计数
            progressDes: 0, //上传图文介绍
            progressDesCount: 0, //上传图文介绍  累加计数
            returnImg: [], //上传成功的线上地址http：//www
            returnImgDes: [],
            tableSplit: [],
            skusName: [
                { name: '', state: false },
                { name: '', state: false },
                { name: '', state: false },
            ],
            flag: true, //区别一列合并还是两列  true 两列， false 一俩
            skus:[],
            category:[]  //类别
        }
    },
    computed: {
        specsOne() {
            return this.formLabel.specs[0]
        },
    },
    watch: {
        specsOne(val) {
            if (this.formLabel.specs[0].length != 0) {
                this.formLabel.specs[0].needPic = 1
            }
        },
    },
     filters: {
        filtterFei(status) {
          return status
        },
    },
    created: function () {
        this.initData()  
    },
    methods: {
        initData() {
            //类别
              util.ajax
                .get('shop/category/list')
                .then(res => {
                  if (parseInt(res.data.code) == 200) {
                      this.category=res.data.data
                  }
                })
                .catch(function(err) {
                  console.log(err)
                })
              
            if (this.$route.query.pageState.state == false) {
                this.title = '修改商品'
                this.returnImg=[]
                let params = new URLSearchParams()
                let id = parseInt(this.$route.query.pageState.id)
                util.ajax
                    .get('shop/' + id)
                    .then((res) => {
                        if (parseInt(res.data.code) == 200) {
                            let resData=JSON.parse(JSON.stringify((res.data.data)))
                            let obj={}
                            resData.skus.forEach((item,i)=>{
                                let result=item.specsData.split(',')
                                let resultIndex=item.indexs.split('_')
                                switch (result.length){
                                    case 1:
                                        this.flag=false;
                                        item.specsName1=result[0];
                                        break
                                    case 2:
                                        this.flag=true;
                                        item.specsName1=result[0];
                                        item.specsName2=result[1];
                                        break
                                    case 3:
                                        this.flag=true;
                                        item.specsName1=result[0];
                                        item.specsName2=result[1];
                                        item.specsName3=result[2];
                                        break
                                }
                            })
                            this.formLabel=resData

                            this.formLabel.mainPic.forEach((item, index) => {
                                item.url = item.path
                                let temp = { type: item.type, path: item.path }

                                this.returnImg.push(temp)
                                if(item.type==2){
                                    this.formLabel.mainPic[index].url=play
                                    console.log(this.formLabel.mainPic[index])
                                }
                                console.log(resData.mainPic)
                            })
                            this.formLabel.descPic.forEach((item, index) => {
                                item.url = item.path
                                let temp = { type: item.type, path: item.path }
                                this.returnImgDes.push(temp)
                            })
                            this.formLabel.specs.forEach((item, i) => {
                                this.skusName[i].state = true
                                this.skusName[i].name = item.name
                            })
                            this.tableSplit =this.analyzeData(this.formLabel.skus)
                            if (this.formLabel.skus.length > 0) {
                                this.collect = true
                            }
                            this.progressCount= this.formLabel.mainPic.length; //上传配图 累加计数
                            this.progressDesCount= this.formLabel.descPic.length; //上传图文介绍  累加计数
                        } else if (parseInt(res.data.code) == 3002) {
                            this.$router.push('/Login')
                        }
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            } else {
                //新增
                this.title = '新增商品'
                this.formLabel = {
                    name: '', //商品名称
                    categoryName: '', //商品分类
                    image: '', //	缩略图
                    mainPic: [], //商品配图 可传递视频  type文件类型 1:图片 2：视频，，path: 文件路径
                    descPic: [], //图文介绍  同上
                    specs: [{ name: '', needPic: 1, vals: [{ value: '', pic: '' }] }],
                    skus: [],
                    minPrice: 0,
                    postFee: null,
                    elseSpecInfos: [{ name: '', vals: [{ value: '', price: null }] }],
                }
                this.skusName[0].status = false
                this.skusName[1].status = false
                this.skusName[2].status = false
            }
        },
        
         
  async httpUpload(file) {
            this.showProgress = false
            this.showProgressDes = false

            var fileName =
                new Date().getTime() + '_' + Math.ceil(Math.random() * 1000) + '_' + file.file.name
            ossClient()
                .put(fileName, file.file, {
                    ContentType: 'image/jpeg/mp4',
                })
                .then(({ res, url, name }) => {
                    if (res && res.status == 200) {
                        let typeFilter = Number
                        file.file.type == 'video/mp4' ? (typeFilter = 2) : null
                        file.file.type == 'image/jpeg' ? (typeFilter = 1) : null
                        file.file.type == 'image/png' ? (typeFilter = 1) : null
                        let temp = { type: typeFilter, path: url }
                        this.returnImg.push(temp)
                    }
                })
                .catch((err) => {
                    console.log(`阿里云OSS上传图片失败回调`, err)
                })
        },
        pointHidden(type) {
            //点击+配图，让进度条消失
            if (type == 'peitu') {
                this.showProgress = false
                this.progress = 0
            } else {
                this.showProgressDes = false
                this.progressDes = 0
            }
        },
        //图文介绍，上传
        async httpUploadDes(file) {
            var fileName =
                new Date().getTime() + '_' + Math.ceil(Math.random() * 1000) + '_' + file.file.name
            ossClient()
                .put(fileName, file.file, {
                    ContentType: 'image/jpeg',
                })
                .then(({ res, url, name }) => {
                    if (res && res.status == 200) {
                        let temp = { type: 1, path: url }
                        this.returnImgDes.push(temp)
                    }
                })
                .catch((err) => {
                    console.log(`阿里云OSS上传图片失败回调`, err)
                })
        },
        //图片上传成功
        successSuolue(res, file) {
            let image = res.data[0]
            this.formLabel.image = image.url
            this.$forceUpdate()
        },
        successInnerPic(obj, res, file) {
            let image = res.data[0]
            //要改看改成什么吧
            let outerIndex = obj.outerIndex
            let innerIndex = obj.innerIndex
            this.formLabel.specs[0].vals[innerIndex].pic = image.url
            this.$forceUpdate()
        },
        successPei(res, file) {
            if(file.raw.type=='video/mp4'){
                let urlDress={url:play}
                this.formLabel.mainPic.push(urlDress)
            }else {
                let urlDress={url:file.url}
                this.formLabel.mainPic.push(urlDress)
            }
            this.progressCount++
            let uf = this.$refs.upload.uploadFiles.length
            this.showProgress = true
            this.progress = (this.progressCount / uf) * 100
        },
        successDes(res, file) {

            this.progressDesCount++
            let uf = this.$refs.upload2.uploadFiles.length
            this.showProgressDes = true
            this.progressDes = (this.progressDesCount / uf) * 100
        },
        //删除图片
        removePic(file) {
            this.formLabel.image = ''
        },
        handleRemove(file, fileList) {
            this.showProgress = false
            this.progressCount -= 1
        
            this.returnImg.forEach((item, index) => {
                if (item.path == file.path) {
                    console.log(87)
                    this.returnImg.splice(index, 1)
                    this.formLabel.mainPic.splice(index, 1)
                }
            })
        },
        handleRemoveDes(file, fileList) {
            this.showProgressDes = false
            this.progressDesCount -= 1
            this.returnImgDes.forEach((item, index) => {
                if (item.path == file.url) {
                    this.returnImgDes.splice(index, 1)
                }
            })
        },
        removeForPic(obj, file) {
            this.$confirm('确认删除此图片么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.formLabel.specs[0].vals[obj.innerIndex].pic = ''
                })
                .catch(() => {
                    return
                })
        },
        beforeUploadAll(file) {
            // console.log(file)
            // if(file.type === 'image/jpeg'|| file.type === 'image/png'){
               
            // }else if(file.type === 'video/mp4'){
            //      const isLt50m = file.size / 1024/1024 < 50
            //       if(!isMp4){
            //         this.$message.error('上传头像图片大小不能超过 50m!')
            //     }
            // }
            //     const isJPG = file.type === 'image/jpeg'
            //     const isPng = file.type === 'image/png'
            //     const isMp4 = file.type ==='video/mp4'

            //     const isLt500kb = file.size / 1024/1024 < 50
            //     console.log(file.size,"___" ,file.size / 1024/1024,isLt500kb)
            //     if (!(isJPG || isPng || isMp4)) {
            //         this.$message.error('上传头像图片只能是 JPG, PNG, MP4格式!')
            //     }
            //     if (!isLt500kb) {
            //         this.$message.error('上传文件大小不能超过 50mb!')
            //     }
            // return (isPng || isJPG) && isLt500kb
        },
        beforeUpload(file) {
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
        //添加规格
        addSpecs() {
            if (this.formLabel.specs.length < 3) {
                if (this.formLabel.specs.length != 0) {
                    let temp = { name: '', needPic: 0, vals: [{ value: '', pic: '' }] }
                    this.formLabel.specs.push(temp)
                } else {
                    let temp = { name: '', needPic: 1, vals: [{ value: '', pic: '' }] }
                    this.formLabel.specs.push(temp)
                }
            } else {
                this.$message('最多添加三个规格')
            }
        },
        //添加规格值
        addSpecsVal(index, type) {
            if (type == 'inner') {
                let temp = { value: '', pic: '' }
                this.formLabel.specs[index].vals.push(temp)
            } else {
                let temp = { value: '', price: null }
                this.formLabel.elseSpecInfos[0].vals.push(temp)
            }
        },
        //删除规格值
        closeSpecsVal(index, innerIndex, type) {
            this.$confirm('确认删除此规格么？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    switch (type) {
                        case 'inner':
                            // let value=this.formLabel.specs[index].vals[innerIndex].value
                            // console.log(this.formLabel.skus)
                            // this.formLabel.skus.forEach((item,index)=>{
                            //     console.lg(item)
                            // //    let result=item.specsData.split(",")
                            // //    console.lg(item)
                            // //    console.log(result)
                            // //    for(let i=0;i<result.length;i++){
                            // //        console.log(result[i])
                            // //        if(result[i]==value){
                            // //            this.formLabel.skus[index].splice(index, 1)
                            // //        }
                            // //    }
                            // })

                            this.formLabel.specs[index].vals.splice(innerIndex, 1)  //删除对应规格
                            // this.tableSplit=this.analyzeData(this.formLabel.skus)
                           
                            
                            break
                        case 'outer':
                            this.formLabel.specs.splice(index, 1)
                            //删除对应的表头列
                            this.skusName[index].name = ''
                            this.skusName[index].state = false
                            if (this.formLabel.specs.length == 0) {
                                this.collect = false
                            }
                            break
                        case 'other':
                            this.formLabel.elseSpecInfos[0].vals.splice(index, 1)
                            break
                    }
                })
                .catch(() => {
                    return
                })
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (this.flag) {
                //true 为合并前两列
                if (columnIndex < 2) {
                    var split = this.tableSplit.find((item) => {
                        return item.columnIndex === columnIndex && item.splitNodeIndex === rowIndex
                    })
                    if (split) {
                        return {
                            rowspan: split.splitSpace,
                            colspan: 1,
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0,
                        }
                    }
                } else {
                    return
                }
            } else {
                return
            }
        },
        analyzeData(list) {
            let splitNodeList = []
            let toSplitField = [
                // { field: 'id', columnIndex: 0 },
                { field: 'specsName1', columnIndex: 0 },
                { field: 'specsName2', columnIndex: 1 },
            ]
            toSplitField.forEach((fieldItem) => {
                let splitNodeListOneColumn = []
                let splitNode = {
                    specsName1: '',
                    specsName2: '',
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
        //生成规格明细
        createTable() {
            this.collect = true
            this.formLabel.skus = []
            let dataArray = []
            this.formLabel.specs.forEach((item, i) => {
                this.skusName[i].state = true
                this.skusName[i].name = item.name
                dataArray.push(item.vals)
            })
            this.formLabel.skus = this.doExchange(dataArray)
            console.log('共有：' + this.formLabel.skus.length + '种组合！')
           
        },
        doExchange(doubleArrays) {
            var len = doubleArrays.length
            let tableData = {}
            if (len == 2) {
                this.flag = true //合并表格true 为要合并前两列
                var len1 = doubleArrays[0].length
                var len2 = doubleArrays[1].length
                var newlen = len1 * len2
                var temp = new Array(newlen)
                var index = 0
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        temp[index] = {
                            // id: i,
                            indexs: i + '_' + j,
                            specsName1: doubleArrays[0][i].value,
                            specsName2: doubleArrays[1][j].value,
                            specsData:
                                '' + [doubleArrays[0][i].value, doubleArrays[1][j].value] + '',
                            commonPrice: '',
                            vipPrice: '',
                            integral: '',
                            stock: '',
                            remark: '',
                        }
                        //  temp[index]=doubleArrays[0].vals[i].value+
                        // doubleArrays[1].vals[j].value;
                        index++
                    }
                }
                this.formLabel.skus = temp
                this.tableSplit = this.analyzeData(temp)
                return temp
            } else if (len == 3) {
                this.flag = true //合并表格true 为要合并前两列
                var len1 = doubleArrays[0].length
                var len2 = doubleArrays[1].length
                var len3 = doubleArrays[2].length
                var newlen = len1 * len2 * len3
                var temp = new Array(newlen)
                var index = 0
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        for (var k = 0; k < len3; k++) {
                            temp[index] = {
                                // id: i,
                                indexs: i + '_' + j + '_' + k,
                                specsName1: doubleArrays[0][i].value,
                                specsName2: doubleArrays[1][j].value,
                                specsName3: doubleArrays[2][k].value,
                                specsData:'' +[doubleArrays[0][i].value,doubleArrays[1][j].value,doubleArrays[2][k].value] +'',
                                commonPrice: '',
                                vipPrice: '',
                                integral: '',
                                stock: '',
                                remark: '',
                            }
                            index++
                        }
                    }
                }

                this.formLabel.skus = temp
                this.tableSplit = this.analyzeData(temp)
                return temp
            } else {
                this.flag = false //合并表格true 为要合并前两列
                let dataTemp = {}
                this.skusName[0].state = true
                this.skusName[0].name = this.formLabel.specs[0].name
                this.formLabel.specs[0].vals.forEach((item, i) => {
                    dataTemp = {
                        indexs: i,
                        specsName1: item.value,
                        specsData: '' + [item.value] + '',
                        commonPrice: '',
                        vipPrice: '',
                        integral: '',
                        stock: '',
                        remark: '',
                    }
                    this.formLabel.skus.push(dataTemp)
                })

                return this.formLabel.skus
            }
        },
        //批量设置
        openPrice(type) {
            if (type == 'jiage') {
                this.boxTitle="价格："
                this.collectCount = ''
                this.collectState = true
                this.collectbox = true
            } else {
                this.boxTitle="库存："
                this.collectCount = ''
                this.collectState = false
                this.collectbox = true
            }
        },
        //最小价格
        onBlur(event) {
            let arr = []
            this.formLabel.skus.forEach((item, index) => {
                if (item.commonPrice) {
                    arr.push(item.commonPrice)
                }
            })
            this.formLabel.minPrice = Math.min.apply(null, arr) //直接Math.max(arr)会报错
        },
        submitCollect() {
            if (this.collectState) {
                this.formLabel.skus.forEach((item, index) => {
                    item.commonPrice = this.collectCount
                })
                this.formLabel.minPrice = this.collectCount
            } else {
                this.formLabel.skus.forEach((item, index) => {
                    item.stock = this.collectCount
                })
            }
            this.collectbox = false
        },
        resetCollect() {
            this.collectbox = false
        },

        //提交
        btnSubmit(value, formName) {
            let template = JSON.parse(JSON.stringify(this.formLabel))
            template.mainPic = this.returnImg
            template.descPic = this.returnImgDes
            // template.elseSpecInfos.forEach((item,i)=>{
            //     if(item.name==''){
            //         template.elseSpecInfos.splice(i,1)
            //     }
            // })
            let params = JSON.stringify(template)
            util.ajax
                .post('shop/renew', params) // 以车型为基准 不是以 id
                .then((res) => {
                    if (parseInt(res.data.status)) {
                        this.$router.push({
                            path: '/ShopingMall',
                        })
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        },
        //取消
        btnCancle(formName) {
            this.$refs[formName].resetFields()
            this.showToogle = true
            //清空数据
            this.formLabel = {
                name: '', //商品名称
                categoryName: '', //商品分类
                image: '', //	缩略图
                mainPic: [], //商品配图 可传递视频  type文件类型 1:图片 2：视频，，path: 文件路径
                descPic: [], //图文介绍  同上
                specs: [{ name: '', needPic: 1, vals: [{ value: '', pic: '' }] }],
                skus: [],
                minPrice: 0,
                postFee: null,
                elseSpecInfos: [{ name: '', vals: [{ value: '', price: null }] }],
            }
            this.$router.push({ path: '/ShopingMall' })
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
input[type='number'] {
    -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
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
    color: rgb(129, 129, 129);
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    z-index: 99;
    opacity: 0.5;
}
.close_form2 {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 7px;
    top: -7px;
    color: #d0d0d0;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    z-index: 99;
    opacity: 0.6;
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

.cici >>> .lable_zhu .el-form-item__label {
    height: 60px;
    line-height: 60px;
}
.cici >>> .el-upload--text {
    height: 60px;
    display: table-cell;
    vertical-align: middle;
    border: 1px dashed #ccc;
    border-radius: 4px;
}
.cici >>> .el-form-item__label {
    height: 60px;
    line-height: 60px;
}

/* 商品规格 */
.shop_box {
    border: 1px solid rgb(201, 200, 200);
    padding: 10px;
    overflow: hidden;
    min-height: 200px;
    width: 600px;
    position: relative;
    margin: 10px 0px;
}
.hidden {
    width: 58px;
    height: 58px;
}
.car-config-change >>> .el-upload--picture-card {
    width: 60px;
    height: 60px;
    line-height: 68px;
}
.car-config-change >>> .el-upload-list--picture-card .el-upload-list__item {
    width: 60px;
    height: 60px;
}
.specs_ipt {
    width: 90px;
}
.table_ipt {
    height: 20px;
    background: rgba(240, 240, 240, 1);
    display: block;
}
.price_font {
    float: left;
    font-size: 16px;
    line-height: 26px;
}
.price_ipt {
    width: 80px;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    float: left;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.space {
    margin: 16px 0;
}
.collect {
    border: 1px solid #ebeef5;
    margin-top: -1px;
    height: 40px;
}
.collect_font {
    float: left;
    font-size: 14px;
    color: #606266;
    margin-right: 10px;
    line-height: 30px;
    cursor: pointer;
}
.collect_color {
    font-size: 14px;
    color: #1890ff;
    margin-right: 10px;
    line-height: 30px;
    cursor: pointer;
}
.specs_ipts{
    width:119px
}

/*在Chrome下移除input[number]的上下箭头*/
.car-config-change >>> .no-number input ::-webkit-outer-spin-button,
.car-config-change >>> .no-number input ::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none !important;
}
 
.car-config-change >>> .no-number input[type="number"]::-webkit-outer-spin-button,
.car-config-change >>> .no-number input[type="number"]::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none !important;
}
 
/*在firefox下移除input[number]的上下箭头*/
.no-number {
  -moz-appearance: textfield;
}
 
.no-number input[type="number"] {
  -moz-appearance: textfield;
}
.car-config-change >>>.no-number .el-input__inner{
widows: 500px;
}
</style>
