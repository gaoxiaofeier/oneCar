let a = new Date()
console.log(a.getFullYear())

let obj = { 'name': 'programmer', 'age': '22', 'height': '180' };
for (let i in obj) {
  console.log(i, obj[i])
}

var d = new Date('Wed Dec 04 2019 00:00:00 GMT+0800 (中国标准时间)');

youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
const resDate = d.getFullYear() + '-' + p((d.getMonth() + 1)) + '-' + p(d.getDate())
const resTime = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
function p(s) {
  return s < 10 ? '0' + s : s
}
console.log(resDate)
console.log(youWant)
var v = new Date();
console.log(v.getFullYear())
let a = '09:08.987'
console.log(a.split(':').join('').split('.').join(''))

let g = '08'
console.log(parseInt(g))



let url =
  'http://test.onecar.dp20.cn/api/v1.0/file/downFile?url=20200223/20200223405104b6b3ff4b7ba955e382d234c1d3.jpg'
console.log(url.split('url='))


import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const local = false;
let apiPath = local ? 'http://localhost:8080/api' : 'http://test.onecar.dp20.cn/api/v1.0/';

const Util = {
  apiPath: apiPath
}

Util.ajax = axios.create({
  baseURL: Util.apiPath
})
axios.interceptors.response.use(
  response => {
    console.log(response)
    //登陆失效
    if (response.data && response.data.code === '753') {
      this.doLogin();
    }
    return response;
  },
  error => {
    console.log(error)
  })
axios.interceptors.request.use(config => {
  // Do something before request is sent
  //config.log(config)
  // const username = this.getStorage('username') || ''
  // const password = this.getStorage('password') || ''
  // config.headers['_token'] = username + ',' + password

  console.log(config)
  var reg = new RegExp("(^|&)p=([^&]*)(&|$)")
  var queryString = config.url.split('?')[1] || ''
  var result = queryString.match(reg)
  result = result ? decodeURIComponent(result[2]) : null;
  if (result) {
    try {
      const json = JSON.parse(result)
      if (json && json.hasOwnProperty('token')
        && (json.token === undefined || json.token === null || json.token === '')) {
        //alert('token不正确')
        //doLogin();
      }
    } catch (error) {

    }
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})



export default Util

function curry(fn, ...args) {
  console.log(...args)
  return args.length < fn.length ? (...innerArgs) => curry(fn, ...args, ...innerArgs) : fn(...args)

}

function addFun(a, b, c, d, e) {
  return a + b + c + d + e
}
let add = curry(addFun)
//console.log(add(1, 2, 3, 4, 5))
console.log(add(1)(2)(3)(4)(5))
console.log(add(1, 2)(3, 4, 5))
console.log(add(1, 2, 3)(4, 5))

let a = [{ url: '' }]


a[0].url ? 9 : 8
if (a[0].url) {
  console.log(9)
} else {
  console.log(8)
}
let a = 6.988
console.log((80000 / 100).toFixed(2))