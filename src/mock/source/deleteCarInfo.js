import Mock from 'mockjs';

Mock.mock(/\/api\/deleteCarInfo/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {}
  }
})