import Mock from 'mockjs';

Mock.mock(/\/api\/increaseCarInfo/, 'post', function () {
  return {
    "ret": true,
    "data": {
      tableData: {
        id: 1,
        carbrand: '宝马',
        carpic: 'b',
        vehicleSystem: '车系1',  //车系
        vehicleName: '车型1',
        endYear: "1991",
        "beginYear": "1990"
      }
    }
  }
})