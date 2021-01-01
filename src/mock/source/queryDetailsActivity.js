import Mock from 'mockjs';

Mock.mock(/\/api\/queryDetailsActivity/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      "dataList": [
        {
          "userCarid": 2,
          "lastlap": "100",
          "ifAct": 1,
          "rem": "你猜",
          "phone": "17521135925",
          "nickName": "张三",
          "trueName": null,
          "idCard": "360429",
          "height": "170",
          "weight": "120",
          "blood": "A",
          "gender": "3",
          "vip1": "1",
          "vip2": "1",
          "actLocation": "上海虹桥火车站",
          "date": "2019-11-25 08:00:00",
          "startTime": "08:00",
          "endTime": "16:30",
          "allCount": 100,
          "lastCount": 100
        }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})