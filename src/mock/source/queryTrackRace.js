import Mock from 'mockjs';

Mock.mock(/\/api\/queryTrackRace/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      "dataList": [
        {
          "id": 1,
          "trackId": 1000000,
          "nickName": "王鹏",
          "lapTime": "20:16:16",
          "createTime": "2019-11-18 06:53:46",
          "addTime": "2019-11-18 06:53:46",
          "carBrand": "宝马",
          "carName": "x1",
          "carType": "126",
          "year": "1999",
          "ed": '90',
          "rem": '新增',
          "inputTime": "2019-11-18 06:53:46",
          "isDeleted": 0,
          "trackName": "上海赛车场"
        }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})