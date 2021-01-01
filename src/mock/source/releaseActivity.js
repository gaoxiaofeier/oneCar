import Mock from 'mockjs';

Mock.mock(/\/api\/releaseActivity/, 'post', function () {
  return {
    "ret": true,
    status: '301000',
    "data": {
    }
  }
})