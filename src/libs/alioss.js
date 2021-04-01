/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: GaoFei
 * @Date: 2020-03-21 01:54:54
 * @LastEditors: GaoFei
 * @LastEditTime: 2021-01-28 15:18:24
 */

// import OSS from 'ali-oss';
// export default (conf) => {
//   return new OSS(conf);
// }

const OSS = require('ali-oss')

export function ossClient(data) {
  // 后端提供数据
  return new OSS({
    region: 'oss-cn-beijing.aliyuncs.com/oneCar/file/upload', // *****.aliyuncs.com
    accessKeyId: 'LTAI4FtmQVcDt3FywbTix6wK',
    accessKeySecret: 'DpCnC1oiIdQS1ORwvRYtJ3mfYHEAqq',
    bucket: 'app-onecar'
  })
}


