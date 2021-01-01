import Mock from 'mockjs';

Mock.mock(/\/api\/deletePhoto/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
    }
  }
})