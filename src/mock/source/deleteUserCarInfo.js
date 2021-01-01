import Mock from 'mockjs';

Mock.mock(/\/api\/deleteUserCarInfo/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {

    }
  }
})