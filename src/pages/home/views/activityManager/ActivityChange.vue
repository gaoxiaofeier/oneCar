<template>
  <el-main>
    <div class="activity-change">
      <p class="mi_title">{{title}}</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动地点" prop="actLocation">
          <el-select v-model="ruleForm.actLocation" placeholder="请选择地点">
            <el-option v-for="(item, index) in optionsList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动日期" required>
          <el-date-picker v-model="ruleForm.date" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="普通价格" prop="price">
          <el-input v-model="ruleForm.price"></el-input>
        </el-form-item>

        <el-form-item label="VIP价格" prop="vipPrice">
          <el-input v-model="ruleForm.VPrice"></el-input>
        </el-form-item>
        <el-form-item label="参赛名额" prop="allCount">
          <el-input v-model="ruleForm.allCount"></el-input>
        </el-form-item>
        <el-form-item label="上传主图：">
          <el-upload class="avatar-uploader" :limit="1" action="http://localhost:8080/CarConfigChange" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <div class="avatar-uploader-icon">
              <img v-if="ruleForm.mainPic" :src="ruleForm.mainPic.url" class="avatar">
              <span class="avatar-upload">+</span>
            </div>
          </el-upload>
          <p class="img_font">文件像素250x250，支持jpg,png,jpeg文件，最多上传一张</p>
        </el-form-item>
        <el-form-item label="上传配图：">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :file-list="ruleForm.illustrationPic" :limit="8">
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

          <p class="img_font">文件像素250x250，支持jpg,png,jpeg文件，最少上传两站，最多上传八张</p>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
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
import util from '@/libs/util'
export default {
  name: 'ActivityChange',
  data() {
    return {
      optionsList: [
        { label: '区域一', value: 'shanghai' },
        { label: '区域二', value: 'beijing' },
        { label: '区域三', value: 'guangzhou' }
      ],
      ruleForm: {
        name: '',
        region: '',
        date: [],
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        sPrice: '',
        VPrice: '',
        imageUrl: '',
        illustrationPic: []
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        sPrice: [{ required: true, message: '请输入普通价格', trigger: 'change' }],
        vPrice: [{ required: true, message: '请输入VIP价格', trigger: 'blur' }]
      },
      isEdit: this.$route.query.isEdit,
      title: '新增活动'
    }
  },
  created: function() {
    if (this.isEdit) {
      this.title = '修改活动'
      this.isEditInitData()
    } else {
      this.title = '新增活动'
    }
  },
  methods: {
    isEditInitData() {
      // 带入数据 赋值
      console.log(this.$route.query.row)
      this.title = '修改活动'
      let row = this.$route.query.row
      this.ruleForm = {
        name: row.actName,
        actLocation: row.actLocation,
        date: row.date,
        price: row.price,
        vipPrice: row.vipPrice,
        allCount: row.allCount,
        mainPic: row.mainPic,
        illustrationPic: row.illustrationPic
      }
    },

    handleRemove(file) {
      console.log(file)
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
      return (isPng || isJPG) && isLt500kb;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.ruleForm
          console.log(JSON.stringify(this.ruleForm.date)) // ["2020-01-13T16:00:00.000Z","2020-02-12T16:00:00.000Z"]
          return
          util.ajax
            .post('/increaseOrUpActivity', params)
            .then(res => {
              console.log('res', res)
              this.$router.go(-1)
            })
            .catch(function(err) {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: '/ActivityManager' })
    }
  }
}
</script>

<style scoped>
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

.activity-change >>> .el-upload-list .el-upload-list__item,
.activity-change >>> .el-upload--picture-card {
  width: 60px;
  height: 60px;
}
.activity-change >>> .el-icon-plus {
  position: relative;
  top: -36px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  background: #ccc;
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
  margin-right: 10px;
  float: left;
}

.avatar-uploader-icon .avatar {
  width: 100%;
  height: 100%;
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
