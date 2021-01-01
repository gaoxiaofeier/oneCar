import Mock from 'mockjs';

Mock.mock(/\/api\/deleteActivity/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {

    }
  }
})