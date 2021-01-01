import Mock from 'mockjs';

Mock.mock(/\/api\/queryUserInfo/, 'post', function () {
  return {
    "ret": true,
    status: '301000',
    "data": {
      tableData: {
        "id": 'fei'
      }
    }
  }
})