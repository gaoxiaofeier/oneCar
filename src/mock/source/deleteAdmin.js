import Mock from 'mockjs';

Mock.mock(/\/api\/deleteAdmin/, 'post', function () {
  return {
    "ret": true,
    code: '301000',
    "data": {

    }
  }
})