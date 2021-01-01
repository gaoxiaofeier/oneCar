import Mock from 'mockjs';

Mock.mock(/\/api\/queryUser/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      dataList: [
        {
          id: '1',
          phone: '2016-05-02',
          trueName: '王虎', //真实姓名
          nickName: '小虎', //微信名称
          wechat: '虎',
          vip1: '1', //年费会员 1是0否
          vip2: '0', //畅跑会员
          regTime: '2019-10-20', //注册时间
          lastLogin: '2020-1-10', //最后一次登录时间
          rem: 'werwer', //备注
          gender: '男',
          cars: '34' //赛车数量
        },
        // {
        //   id: '2',
        //   phone: '155302114856',
        //   trueName: '王东', //真实姓名
        //   nickName: 'Vicky', //微信名称
        //   wechat: '东',
        //   gender: '男',
        //   vip1: '1', //年费会员 1是0否
        //   vip2: '畅跑会员', //畅跑会员
        //   regTime: '2019-10-20', //注册时间
        //   lastLogin: '2020-1-16', //最后一次登录时间
        //   rem: '无', //备注
        //   cars: '23' //赛车数量
        // }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})