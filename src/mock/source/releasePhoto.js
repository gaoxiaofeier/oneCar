import Mock from 'mockjs';

Mock.mock(/\/api\/releasePhoto/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
    }
  }
})