<template>
  <el-main>
    <div class="track-album-change">
      <p class="mi_title">{{title}}</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="ruleForm.activityName" size="medium" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="影集内容" prop="content">
          <el-input type="textarea" v-model="ruleForm.content" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="上传配图：">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :file-list="ruleForm.pic" :limit="8">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <el-upload action="#" ref="upload" :before-upload="beforeUpload" :http-request="upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <p class="img_font">文件像素250x250，支持jpg,png,jpeg文件，最少上传两站，最多上传八张</p>
        </el-form-item>
        <el-form-item label="所属人：">
          <el-radio-group v-model="ruleForm.byWho" size="medium">
            <el-radio border :label="0" style="border:0px">所有人</el-radio>
            <el-radio border :label="1" style="border:0px">VIP用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-top:-10px;width:320px;">
          <el-input v-model="ruleForm.phone" size="medium"></el-input>
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
export default {
  name: 'TrackAlbumChange',
  data() {
    return {
      ruleForm: {
        phone: '',
        region: '',
        date1: '',
        time: '',
        delivery: false,
        type: [],
        byWho: 0, //所属人
        phone: '',
        desc: '',
        sPrice: '',
        VPrice: '',
        imageUrl: '',
        pic: []
      },
      isEdit: this.$route.query.isEdit,
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        time: [{ type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }],
        sPrice: [{ required: true, message: '请输入普通价格', trigger: 'change' }],
        vPrice: [{ required: true, message: '请输入VIP价格', trigger: 'blur' }]
      },
      title: '新增影集'
    }
  },

  mounted: function() {
    if (this.isEdit) {
      this.isEditInitData()
    }
  },

  methods: {
    isEditInitData() {
      let row = this.$route.query.row
      console.log('photo-row', row)
      this.title = '修改影集'
      this.ruleForm = {
        pic: row.pic, // 配图数组
        // 其他的修改字段加在这里
        name: row.activityName,
        content: row.content,
        rem: row.rem,
        byWho: 1, //和后台确认所属人
        phone: row.phone
      }
    },

    handleAvatarSuccess(res, file) {
      this.formLabelAlign.imageUrl = URL.createObjectURL(file.raw)
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

    handleRemove(file) {
      console.log(file)
    },

    submitForm(formName) {
      let params = this.ruleForm
      if (this.title == '新增影集') {
        util.ajax
          .post('/increasePhoto', params)
          .then(res => {
            this.dialogFormVisible = false
            console.log(res)
            this.getTableData()
          })
          .catch(function(err) {
            console.log(err)
          })
      } else {
        util.ajax
          .post('/updatePhoto', params)
          .then(res => {
            this.dialogFormVisible = false
            console.log(res)
            this.getTableData()
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //     alert('submit!')
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/TrackAlbum' })
    }
  }
}
</script>
<style scoped>
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
.icon_box .icon_update {
  float: left;
  width: 300px;
  height: 40px;
  background-color: red;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border: 1px dashed #d9d9d9;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
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
/* .avatar {
  width: 178px;
  height: 178px;
  display: block;
} */
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
/* 自定义表单样式 */
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
</style>
