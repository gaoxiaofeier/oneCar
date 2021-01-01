import Mock from 'mockjs';

Mock.mock(/\/api\/queryPhoto/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      "dataList": [
        {
          "id": 1,
          "content": "影集描述...",
          "activityName": "赛车活动1",
          "userId": null,
          "pic": [
            {
              name: 'veer-132704690.jpg',
              url: 'https://goss.veer.com/creative/vcg/veer/800water/veer-132704690.jpg',
            },
            {
              name: '95eef01f3a292df53055267fb4315c6035a873c2.jpg',
              url: 'http://a.hiphotos.baidu.com/baike/w=400/sign=47761e1ea5345982c58ae4923cf5310b/95eef01f3a292df53055267fb4315c6035a873c2.jpg',
            }
          ],
          "type": 0,
          "editTime": "2019-12-28 10:18:53",
          "reTime": "2019-12-28 10:18:53",
          "byWho": "0",
          "rem": '无',
          "phone": "17521135925",
          "isDeleted": 0,
          "activityId": 8
        }, {
          "id": 2,
          "content": "影集描述...",
          "activityName": "赛车活动2",
          "userId": null,
          "pic": [
            {
              name: 'veer-132704690.jpg',
              url: 'https://goss.veer.com/creative/vcg/veer/800water/veer-132704690.jpg',
            },
            {
              name: '95eef01f3a292df53055267fb4315c6035a873c2.jpg',
              url: 'http://a.hiphotos.baidu.com/baike/w=400/sign=47761e1ea5345982c58ae4923cf5310b/95eef01f3a292df53055267fb4315c6035a873c2.jpg',
            }
          ],
          "type": 1,
          "editTime": "2019-12-28 10:18:53",
          "reTime": "2019-12-28 10:18:53",
          "byWho": "1",
          "rem": '无',
          "phone": "17521135925",
          "isDeleted": 0,
          "activityId": 8
        }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})
// import Mock from 'mockjs';

// Mock.mock(/\/api\/queryPhoto/, 'post', function () {
//   return {
//     "ret": true,
//     "data": {
//       total: 101,
//       tableData: [
//         {
//           userId: 100,
//           activityName: '王小虎',
//           content: '挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的挺好的我爱你',
//           picNumber: '52', //表无
//           person: '宝马', //表无
//           editTime: '2019-12-30 15:41:23',
//           reTime: '2020-1-10 15:41:23',
//           type: '1', //1为已发布，0 为未发布
//           rem: '挺好的',
//           phone: '18621542578',
//           illustrationPic: [
//             {
//               name: 'veer-132704690.jpg',
//               url: 'https://goss.veer.com/creative/vcg/veer/800water/veer-132704690.jpg',
//             },
//             {
//               name: '95eef01f3a292df53055267fb4315c6035a873c2.jpg',
//               url: 'http://a.hiphotos.baidu.com/baike/w=400/sign=47761e1ea5345982c58ae4923cf5310b/95eef01f3a292df53055267fb4315c6035a873c2.jpg',
//             }

//           ],
//         },
//         {
//           userId: 200,
//           activityName: '=lili',
//           content: '3',
//           picNumber: '52', //表无
//           person: '宝马', //表无
//           editTime: '2019-12-30 15:41:23',
//           reTime: '2020-1-10 15:41:23',
//           type: '0',//1为已发布，0 为未发布
//           rem: '挺好的',
//           phone: '18621582578'
//         },

//       ]
//     }
//   }
// })