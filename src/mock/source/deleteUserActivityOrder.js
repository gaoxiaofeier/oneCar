import Mock from 'mockjs';

Mock.mock(/\/api\/deleteUserActivityOrder/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {

    }
  }
})