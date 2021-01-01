import Mock from 'mockjs';

Mock.mock(/\/api\/queryActivity/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      "dataList": [
        {
          "actId": 9,
          "actName": "赛车",
          "actLocation": "北京国际机场",
          "mainPic": null,
          "content": null,
          "date": "2019-11-25",
          "startTime": "08:00",
          "endTime": "16:30",
          "otherPic": null,
          "price": "100",
          "vipPrice": "80",
          "reward": null,
          "allCount": 100,
          "lastCount": 100,
          "status": 0,
          "actStatus": null,
          "rem": "没有什么备注的",
          "isDeleted": 0,
          "mainPicList": [
            {
              name: '95eef01f3a292df53055267fb4315c6035a873c2.jpg',
              url: 'http://a.hiphotos.baidu.com/baike/w=400/sign=47761e1ea5345982c58ae4923cf5310b/95eef01f3a292df53055267fb4315c6035a873c2.jpg',
            }
          ],
          "otherPicList": [
            {
              name: 'veer-132704690.jpg',
              url: 'https://goss.veer.com/creative/vcg/veer/800water/veer-132704690.jpg',
            },
            {
              name: '95eef01f3a292df53055267fb4315c6035a873c2.jpg',
              url: 'http://a.hiphotos.baidu.com/baike/w=400/sign=47761e1ea5345982c58ae4923cf5310b/95eef01f3a292df53055267fb4315c6035a873c2.jpg',
            }
          ]
        }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})


// mainPic: {
//   name: '95eef01f3a292df53055267fb4315c6035a873c2.jpg',
//     url: 'http://a.hiphotos.baidu.com/baike/w=400/sign=47761e1ea5345982c58ae4923cf5310b/95eef01f3a292df53055267fb4315c6035a873c2.jpg',
// },
// illustrationPic: [
//   {
//     name: 'veer-132704690.jpg',
//     url: 'https://goss.veer.com/creative/vcg/veer/800water/veer-132704690.jpg',
//   },
//   {
//     name: '95eef01f3a292df53055267fb4315c6035a873c2.jpg',
//     url: 'http://a.hiphotos.baidu.com/baike/w=400/sign=47761e1ea5345982c58ae4923cf5310b/95eef01f3a292df53055267fb4315c6035a873c2.jpg',
//   }