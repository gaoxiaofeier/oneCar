<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: GaoFei
 * @Date: 2020-03-22 15:23:39
 * @LastEditors: GaoFei
 * @LastEditTime: 2021-01-28 16:09:06
-->
<template>
  <div class="upload-oss" style="margin: 10px;">
    <el-upload action="#" ref="upload" :before-upload="beforeUpload" :http-request="upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>

</template>

<script>
import { ossClient } from '@/libs/alioss'

export default {
  name: 'uploadOss',
  data() {
    return {
      formDate: '',
      dialogImageUrl: '',
      dialogVisible: false,
      config: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      },

      returnImg: []
    }
  },

  created() {},

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt500kb = file.size / 1024 < 100000
      if (!(isJPG || isPng)) {
        this.$message.error('上传头像图片只能是 JPG, PNG 格式!')
      }
      if (!isLt500kb) {
        this.$message.error('上传图片大小不能超过 100M!')
        return false
      }
      return (isPng || isJPG) && isLt500kb
    },

    upload(file) {
      console.log(1, file)
      var fileName = file.file.name
      fileName = file.file.name
      var file1 = file.file
      ossClient()
        .put(fileName, file1, {
          ContentType: 'image/jpeg'
        })
        .then(({ res, url, name }) => {
          if (res && res.status == 200) {
            console.log(`阿里云OSS上传图片成功回调`, res, url, name)
          }
        })
        .catch(err => {
          console.log(`阿里云OSS上传图片失败回调`, err)
        })
    }
  }
}
</script>

<style scoped>
.upload-oss >>> .el-upload--picture-card {
  width: 62px;
  height: 62px;
  line-height: 60px;
}

.upload-oss >>> .el-upload-list--picture-card .el-upload-list__item {
  width: 62px;
  height: 62px;
}

.upload-oss >>> .el-upload--picture-card i {
  font-size: 18px;
}

.upload-oss >>> .el-upload-list--picture-card .el-upload-list__item-actions span + span {
  margin-left: 6px;
}
</style>