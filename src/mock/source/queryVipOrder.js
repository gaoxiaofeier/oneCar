import Mock from 'mockjs';

Mock.mock(/\/api\/queryVipOrder/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      "dataList": [
        {
          "id": 2,
          "orderId": "1061168420191205",
          "userId": "1",
          "buyTime": "2019-12-04 15:18:48",
          "vipEndTime": "2012-12-04 15:06:49",
          "buyType": "wechat",
          "money": "1",
          "rem": null,
          "user": {
            "userId": null,
            "phone": "17521135925",
            "nickName": "张三",
            "wechat": null,
            "headPic": null,
            "location": null,
            "vip1": null,
            "vip1Endtime": null,
            "vip2": null,
            "vipType": null,
            "vip2Endtime": null,
            "regTime": null,
            "lastLogin": null,
            "actTime": 0,
            "rem": null,
            "reward": null,
            "height": null,
            "weight": null,
            "blood": null,
            "trueName": null,
            "idCard": null,
            "gender": null
          }
        }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})