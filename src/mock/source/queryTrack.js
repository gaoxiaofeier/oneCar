import Mock from 'mockjs';

Mock.mock(/\/api\/queryTrack/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      "dataList": [
        {
          id: 1,
          province: '江苏',
          city: '苏州',
          trackName: '上海赛车场',
          rem: 'xxxx',
          trackpic: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3632677651,3179755979&fm=26&gp=0.jpg',
        },
        {
          id: 2,
          province: '上海',
          city: '上海',
          trackName: '赛道名111',
          rem: '222',
          // 需要时对象的形式 如果是多张图pain  需要  [{}, {}] 的形式
          trackpic: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578078980435&di=63752ed993a3299548a6d4e6153ddf49&imgtype=0&src=http%3A%2F%2Fimg.jinse.com%2F712431_image3.png',
        }
      ]
    }
  }
})
