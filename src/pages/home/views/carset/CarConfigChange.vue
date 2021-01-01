<template>
  <el-main>
    <div class="car-config-change">
      <p class="mi_title">{{title}}</p>
      <div></div>
      <el-form v-if="isShow" label-position="right" label-width="70px" :model="addFormLabelAlign">
        <el-form-item label="品牌：">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="addFormLabelAlign.carbrand" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="首字母：">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="addFormLabelAlign.initial" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="icon：">
          <el-upload class="avatar-uploader" :limit="1" action="http://localhost:8080/CarConfigChange" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="modifyFormLabelAlign.imageUrl" :src="modifyFormLabelAlign.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="img_font">文件像素100x100，支持jpg,png,jpeg文件，最多上传一张</p>
        </el-form-item>
        <div class="form_box" v-for="(item,index) in addFormLabelAlign.vehicleSystem.length" :key="index+'x'" v-if="isDel[index]">
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
                    <el-input v-model="addFormLabelAlign.vehicleSystem[index].vehicleType[num]"></el-input>
                  </div>
                </el-form-item>
              </div>
              <div style="overflow:hidden;">
                <span class="inner_chexing"></span>
                <el-form-item label="年份：" style="position:relactive">
                  <input type="text" class="year_box" v-model="addFormLabelAlign.vehicleSystem[index].yearName[num].beginYear">
                  <span class="year_font">~</span>
                  <input type="text" class="year_box" v-model="addFormLabelAlign.vehicleSystem[index].yearName[num].endYear">
                  <i class="el-icon-warning-outline" style="margin-left:3px;"></i>
                </el-form-item>
              </div>
            </el-row>
            <div class="add_car_xing" @click="addCarTypeXing(index,(carTypeMobleXi-1))">添加车型</div>
          </div>
        </div>
        <div class="add_car_xi" @click="addCarTypeXi">添加车系</div>
        <div class="btn_box">
          <span class="btn_style submit" @click="btnSubmit(1)">提交</span>
          <span class="btn_style cancle" @click="btnCancle">取消</span>
        </div>
      </el-form>
      <el-form v-else label-position="right" label-width="80px" :model="addFormLabelAlign">
        <el-form-item label="品牌：">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="modifyFormLabelAlign.carbrand" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="首字母：">
          <div style="width:200px;heigh:30px;">
            <el-input v-model="modifyFormLabelAlign.initial" class="c_ipt"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="icon：">
          <el-upload class="avatar-uploader" :limit="1" action="http://localhost:8080/CarConfigChange" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="addFormLabelAlign.imageUrl" :src="modifyFormLabelAlign.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="img_font">文件像素100x100，支持jpg,png,jpeg文件，最多上传一张</p>
        </el-form-item>
        <div class="form_box">
          <div class="fb_inbox">
            <el-row>
              <el-form-item label="车系：">
                <div style="width:200px">
                  <el-input v-model="modifyFormLabelAlign.vehicleSystem.vehicleName"></el-input>
                </div>
              </el-form-item>
            </el-row>
            <el-row class="car_type_moble">
              <div style="overflow:hidden;">
                <span class="inner_chexing"></span>
                <el-form-item label="车型：" style="float:left">
                  <div style="width:160px">
                    <el-input v-model="addFormLabelAlign.vehicleSystem.vehicleType"></el-input>
                  </div>
                </el-form-item>
              </div>
              <div style="overflow:hidden;">
                <span class="inner_chexing"></span>
                <el-form-item label="年份：" style="position:relactive">
                  <input type="text" class="year_box" v-model="addFormLabelAlign.vehicleSystem.yearName.beginYear">
                  <span class="year_font">~</span>
                  <input type="text" class="year_box" v-model="addFormLabelAlign.vehicleSystem.yearName.endYear">
                  <i class="el-icon-warning-outline" style="margin-left:3px;"></i>
                </el-form-item>
              </div>
            </el-row>
            <div class="add_car_xing" @click="addCarTypeXing(index,(carTypeMobleXi-1))">添加车型</div>
          </div>
        </div>
        <div class="add_car_xi" @click="addCarTypeXi">添加车系</div>
        <div class="btn_box">
          <span class="btn_style submit" @click="btnSubmit(0)">提交</span>
          <span class="btn_style cancle" @click="btnCancle">取消</span>
        </div>
      </el-form>
    </div>
  </el-main>
</template>
<script>
import util from '@/libs/util'
export default {
  name: 'CarConfigChange',
  data() {
    return {
      addFormLabelAlign: {
        carbrand: '',
        vehicleSystem: [
          { vehicleName: '', vehicleType: [], yearName: [{ endYear: '', beginYear: '' }] }
        ],
        imageUrl: '', //上传默认图片路径
        initial: '' //首字母
      },
      modifyFormLabelAlign: {
        carbrand: '',
        vehicleSystem: [
          { vehicleName: '', vehicleType: [], yearName: [{ endYear: '', beginYear: '' }] }
        ],
        imageUrl: '', //上传默认图片路径
        initial: '' //首字母
      },
      title: '新增车型',
      isShow: true,
      isEdit: this.$route.query.isEdit,
      carTypeMobleXing: [1],
      carTypeMobleXi: 1,
      isDel: [true]
    }
  },
  created: function() {
    let row = this.$route.query.row
    if (this.isEdit) {
      this.modifyFormLabelAlign.imageUrl = row.brandPic.url
    }
    this.isEditInitData()
  },
  methods: {
    isEditInitData() {
      // 带入数据 赋值
      console.log(this.$route.query.row)
      if (this.isEdit) {
        isShow: false
        this.title = '修改车型'
      } else {
        isShow: true
        this.title = '新增车型'
      }
    },
    handleAvatarSuccess(res, file) {
      this.addFormLabelAlign.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt200kb = file.size / 1024 < 200
      if (!(isJPG || isPng)) {
        this.$message.error('上传头像图片只能是 JPG, PNG 格式!')
      }
      if (!isLt200kb) {
        this.$message.error('上传头像图片大小不能超过 200kb!')
      }
      return (isPng || isJPG) && isLt200kb
    },
    //添加车型
    addCarTypeXing(index) {
      this.addFormLabelAlign.vehicleSystem[index].yearName.push({ endYear: '', beginYear: '' })
      console.log(this.addFormLabelAlign.vehicleSystem[index].years)
      this.carTypeMobleXing[index] += 1
    },
    //添加车系
    addCarTypeXi() {
      this.carTypeMobleXi += 1
      console.log(this.carTypeMobleXi)
      this.isDel.push(true)
      this.carTypeMobleXing.push(1)
      this.addFormLabelAlign.vehicleSystem.push({
        vehicleName: '',
        vehicleType: [],
        yearName: [{ endYear: '', beginYear: '' }]
      })
    },
    //删除车系
    closeCarType(index) {
      this.isDel[index] = false
      this.isDel.splice(index, 1)
      console.log(this.addFormLabelAlign.vehicleSystem[index])
      this.addFormLabelAlign.vehicleSystem.splice(index, 1)
      this.carTypeMobleXing.splice(index, 1)
    },
    //提交
    btnSubmit(value) {
      if (value) {
        //新增提交
        console.log(this.addFormLabelAlign)
        //let row = this.$route.query.row
        let params = this.addFormLabelAlign
        util.ajax
          .post('/increaseCarInfo', params) // 以车型为基准 不是以 id
          .then(res => {
            console.log(res)
            this.addFormLabelAlign = {
              carbrand: '',
              vehicleSystem: [
                { vehicleName: '', vehicleType: [], yearName: [{ endYear: '', beginYear: '' }] }
              ],
              imageUrl: '',
              initial: ''
            }
            this.$router.push({ path: '/CarConfig' })
          })
          .catch(function(err) {
            console.log(err)
          })
      } else {
        //修改提交
        console.log(this.modifyFormLabelAlign)
        let params = this.modifyFormLabelAlign
        util.ajax
          .post('/increaseCarInfo', params) // 以车型为基准 不是以 id
          .then(res => {
            console.log(res)
            this.modifyFormLabelAlign = {
              carbrand: '',
              vehicleSystem: [
                { vehicleName: '', vehicleType: [], yearName: [{ endYear: '', beginYear: '' }] }
              ],
              imageUrl: '', //上传默认图片路径
              initial: '' //首字母
            }
            this.$router.push({ path: '/CarConfig' })
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    //取消
    btnCancle() {
      this.$router.push({ path: '/CarConfig' })
      //清空数据
      this.modifyFormLabelAlign = {
        carbrand: '',
        vehicleSystem: [
          { vehicleName: '', vehicleType: [], yearName: [{ endYear: '', beginYear: '' }] }
        ],
        imageUrl: '', //上传默认图片路径
        initial: '' //首字母
      }
      this.addFormLabelAlign = {
        carbrand: '',
        vehicleSystem: [
          { vehicleName: '', vehicleType: [], yearName: [{ endYear: '', beginYear: '' }] }
        ],
        imageUrl: '',
        initial: ''
      }
    }
  }
}
</script>

<style scoped>
.inner_chexing {
  width: 60px;
  float: left;
  height: 20px;
}
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
  height: 60px;
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
  width: 60px;
  height: 36px;
  color: #666;
  float: left;
  padding: 0 4px;
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
</style>
