import Mock from 'mockjs';

Mock.mock(/\/api\/deleteTrack/, 'post', function () {
  return {
    "ret": true,
    status: '301000',
    "data": {
      tableData: {
        "id": '删除用户订单'
      }
    }
  }
})