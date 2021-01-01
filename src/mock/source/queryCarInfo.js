import Mock from 'mockjs';

Mock.mock(/\/api\/queryCarInfo/, 'post', function () {
  return {
    "code": 301000,
    "message": "success",
    "data": {
      dataList: [
        {
          id: 1,
          carbrand: 'a宝马',
          initials: 'aB',
          vehicleSystemId: 'aX1',
          vehicleType: 'a120',
          year: 'a2019',
          beginYear: 'a2018',
          endYear: 'a2019',
          carpic: 'https://goss.veer.com/creative/vcg/veer/800water/veer-132704690.jpg',
        },
        {
          id: 1,
          carbrand: 'a宝马',
          initials: 'aB',
          year: 'a2019',
          vehicleSystemId: 'aX1',
          vehicleType: 'a125',
          beginYear: 'a2018',
          endYear: 'a12019',
          carpic: 'https://goss.veer.com/creative/vcg/veer/800water/veer-132704690.jpg',
        },
        {
          id: 2,
          carbrand: 'b奔驰',
          initials: 'bB',
          year: 'b2019',
          vehicleSystemId: 'bX1',
          vehicleType: 'b128',
          beginYear: 'b2018',
          endYear: '22019',
        },
        {
          id: 2,
          carbrand: 'b奔驰',
          initials: 'bB',
          year: 'b2019',
          vehicleSystemId: 'bX1',
          vehicleType: 'b2017',
          beginYear: 'b2018',
          endYear: 'b2019',
        }
      ],
      "currentPage": 1,
      "pageSize": 10,
      "totalPage": 1,
      "totalSize": 1
    }
  }
})