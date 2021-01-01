import Mock from 'mockjs';

Mock.mock(/\/api\/deletetrackrace/, 'post', function () {
  return {
    "code": '301000',
    "message": "success",
    "data": {

    }
  }
})