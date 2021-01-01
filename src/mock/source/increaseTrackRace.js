import Mock from 'mockjs';

Mock.mock(/\/api\/increaseTrackRace/, 'post', function () {
  return {
    "ret": true,
    "data": {
      tableData: {
        "id": '新增数据'
      }
    }
  }
})