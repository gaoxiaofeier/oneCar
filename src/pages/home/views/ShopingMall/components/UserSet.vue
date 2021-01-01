<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: GaoFei
 * @Date: 2020-11-24 11:52:43
 * @LastEditors: GaoFei
 * @LastEditTime: 2020-11-24 14:44:13
-->
<template>
    <el-form :rules="formRules" ref="form" label-position="right" label-width="100px" :model="formLabel">
        <el-form-item label="商品名：" prop="name">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="formLabel.name" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品类别：">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="formLabel.categoryName" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品缩略图：" class="gigi">
          <el-upload class="avatar-uploader" :limit="1" :action="this.action" :show-file-list="true" :on-success="successSuolue" :before-upload="beforeAvatarUpload" :on-remove="removePic">
            <span v-if="formLabel.image">
              <img :src="formLabel.image" class="avatar">
            </span>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="img_font">文件像素300x100，支持jpg,png,jpeg文件，最多上传一张</p>
        </el-form-item>
     </el-form>
</template>
<script>
export default {
    name:'UserSet',
    data(){
        return {
            title:'新增商品',
            formLabel:{
                name:'',   //商品名称
                categoryName:'', //商品分类
                image:'',   //	缩略图
                mainPic:[{ name: '', type: 1, url: '' }], //商品配图 可传递视频  type文件类型 1:图片 2：视频，，path: 文件路径
                descPic:[{ name: '', type: 1, url: '' }], //图文介绍  同上
            },
            formRules: {
                name: [{ required: true, message: '商品名不能为空', trigger: 'blur' }]
            },
            action: this.$store.getters.uploadImage + 'file/upload',
        }
    },
    created: function() {
        this.initData()
        
    },
    methods:{
        initData(){
            if(this.$route.query.pageState){//新增
                this.title = '新增商品'
            }else{
                this.title = '修改商品'
            }
        },
        //图片上传成功
        successSuolue(res, file) {
          let image = res.data[0]
          this.formLabel.image = image.url
          console.log(this.formLabel.image)
          this.$forceUpdate()
        },
        //删除图片
        removePic(file) {
          this.image=''
          //this.returnImg = ''
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
    }
}
</script>
<style scoped>
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