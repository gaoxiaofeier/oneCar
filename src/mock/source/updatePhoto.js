import Mock from 'mockjs';

Mock.mock(/\/api\/updatePhoto/, 'post', function () {
  return {
    "ret": true,
    "data": {
      tableData: {
        "id": 'fei'
      }
    }
  }
})