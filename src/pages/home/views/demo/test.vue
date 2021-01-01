<template>
  <el-main>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="上传配图：" class="lable_zhu">
        <el-upload action list-type="picture-card" :http-request="upLoad">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import util from '@/libs/util'
import OSS from 'ali-oss'
// import UploadFileApi from '@/api/system/UploadFileApi'
import { ossClient } from '@/libs/alioss'

export default {
  name: 'test',
  data() {
    return {
      ruleForm: {},
      rules: {},
      data_extra: {
        type: Object,
        required: true
      },
      accept: {
        type: Array,
        required: true
      },
      uploadUrl: '',
      fileList: [],
      files: 10,
      uploadHeaders: {
        authorization: ''
      },
      disabled: false,
      dialogImageUrl: '',
      dialogVisible: false,
      dataObj: {} //存签名信息
    }
  },
  created: function() {},

  mounted: function() {},

  methods: {
    /**
     * @description [fnUploadRequest 覆盖默认的上传行为，实现自定义上传]
     * @author
     * @param    {object}   option [上传选项]
     * @return   {null}   [没有返回]
     */
    async fnUploadRequest(option) {
      try {
        let vm = this
        vm.disabled = true
        // 获取OSS配置信息
        // let uploadFileApi = new UploadFileApi()
        // let ret = await uploadFileApi.fileOssParams()
        // if (!(ret.data && ret.data.code === '0' && ret.data.data)) {
        //   throw new Error('获取OSS参数失败')
        // }
        // let ossData = JSON.parse(ret.data.data)
        // let relativePath = ossData.relativePath
        // let client = new OSS.Wrapper({
        //   policy: ossData.policy,
        //   accessKeyId: ossData.accessid,
        //   accessKeySecret: ossData.accesssecret,
        //   bucket: ossData.bucket,
        //   signature: ossData.signature
        // })
        let OSS = require('ali-oss')
        let client = new OSS({
          region: 'oss-cn-beijing', // *****.aliyuncs.com
          accessKeyId: 'LTAI4FtmQVcDt3FywbTix6wK',
          accessKeySecret: 'DpCnC1oiIdQS1ORwvRYtJ3mfYHEAqq',
          bucket: 'app-onecar'
        })

        let file = option.file
        const point = file.name.lastIndexOf('.')
        let suffix = file.name.substr(point)
        let fileName = file.name.substr(0, point)
        let date = new Date().toLocaleString() //.format('YYYYMMDDHHmm')
        let fileNames = `${fileName}_${date}${suffix}`
        // 分片上传文件
        ret = await client.multipartUpload(
          'C:/Users/Administrator/Desktop/图片/ ' + fileNames,
          file,
          {
            progress: async function(p) {
              let e = {}
              e.percent = p * 100
              option.onProgress(e)
            }
          }
        )
        console.log(ret)
        if (ret.res.statusCode === 200) {
          // option.onSuccess(ret)
          return ret
        } else {
          vm.disabled = false
          option.onError('上传失败')
        }
      } catch (error) {
        console.error(error)
        this.disabled = false
        option.onError('上传失败')
        this.$error(error.message)
      }
    },
    /**
     * [upLoad 自定义上传图片]
     * @param  {[type]} file [上传值]
     * @return {[type]}      [description]
     */
    async upLoad(file) {
      const self = this
      let files = file.file,
        point = files.name.lastIndexOf('.'),
        suffix = files.name.substr(point),
        fileName = files.name.substr(0, point),
        date = Date.parse(new Date()),
        fileNames = '/app-onecar/oneCar/' + `${fileName}_${date}${suffix}`

      //fileNames上传文件的名称
      //file.file上传文件的内容
      ossClient(this.dataObj)
        .multipartUpload(fileNames, file.file)
        .then(result => {
          //下面是如果对返回结果再进行处理，根据项目需要
          // console.log(result)
          self.$message({
            message: '上传成功',
            type: 'success'
          })
        })
        .catch(err => {
          self.$message.error('上传失败')
        })
    }
  }
}
</script>

<style scoped>
</style>
