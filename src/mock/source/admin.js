import Mock from 'mockjs';

Mock.mock(/\/api\/admin/, 'post', function () {
  return {
    "code": '301000',
    "message": "success",
    "data": {
      dataList: [{
        userName: '1225478',
        role: '管理员',
        power: 1,
        passWord: 1,
        permission: [' 管理员', '用户管理', '赛车配置', '赛道录入',]
      }],
      totalSize: 1
    }
  }
})

