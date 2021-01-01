import Mock from 'mockjs';

Mock.mock(/\/api\/increasePhoto/, 'post', function () {
  return {
    "ret": true,
    "data": {
      tableData: {
        "id": 'fei'
      }
    }
  }
})