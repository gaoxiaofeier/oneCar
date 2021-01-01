<template>
    <div class="upload-backend" style="margin: 10px;">
        <el-upload
            action="#"
            ref="upload"
            :before-upload="beforeUpload"
            :http-request="upload"
            :limit="3"
            list-type="picture-card"
            :class="{'hide': !isShowUploadButton}"
            :on-change="handleEditChange"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
    
</template>

<script>

import util from '@/libs/util';


export default {
    name: 'uploadBackEnd',
    data() {
      return {
        formDate: null,
        isShowUploadButton: true,
        dialogImageUrl: '',
        dialogVisible: false,
        config : {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        },
        returnImg: [],
      };
    },

    methods: {
      handleRemove(file, fileList) {
        console.log('delete file',  JSON.stringify(file));
        // 找到fileName 从 returnImg 中删除 
        // 模拟 假设删除最后一项
        this.returnImg.pop();
        this.isShowUploadButton = this.returnImg.length < 3; 

      },
      handleEditChange (file, fileList) {
       
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
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

      upload (file) {
        console.log(JSON.stringify(file));
        this.formDate = new FormData();
        this.formDate.append('file', file.file);
        this.formDate.append('uid', file.file.uid);
        util.ajax
            .post('file/upload', this.formDate, this.config)
            .then(res => {
                this.returnImg.push(...res.data.data);
                this.isShowUploadButton = this.returnImg.length < 3; 
                console.log('this.returnImg', JSON.stringify(this.returnImg));
            })
            .catch(function(err) {
                console.log(err)
            })
      },
    }
}



</script>

<style scoped>
.upload-backend >>> .el-upload--picture-card {
    width: 62px;
    height: 62px;
    line-height: 60px;
}

.upload-backend >>> .el-upload-list--picture-card .el-upload-list__item {
    width: 62px;
    height: 62px;
}

.upload-backend >>> .el-upload--picture-card i {
    font-size: 18px;
}

.upload-backend >>> .el-upload-list--picture-card .el-upload-list__item-actions span+span {
    margin-left: 6px;
}

.upload-backend .hide >>> .el-upload--picture-card {
  display: none;
}
</style>