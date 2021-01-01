import Mock from 'mockjs';

Mock.mock(/\/api\/increaseOrUpActivity/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {}
  }
})