import Mock from 'mockjs';

Mock.mock(/\/api\/quhui/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      "dataList": [
        {
          "id": 1,
          "phone": "17521135925",
          "nickName": "张三",
          "actId": null,
          "actName": "2019年冬季赛车比赛",
          "actLocation": "上海虹桥火车站",
          "date": "2019-11-25 08:00:00",
          "buyTime": "2019-11-13 15:48:15",
          "buyType": '支付宝',
          "money": "100",
          "ifAct": 1,
          "rem": "你猜",
          "userId": "1",
          "recommend": "无",
          "carBrand": '宝马',
          "carType": "x1",
          "year": '1998',
          "ed": '100'
        }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})