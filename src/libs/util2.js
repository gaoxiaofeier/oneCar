import axios from 'axios'
import store from '../store';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const local = false;
// let apiPath = local ? 'http://localhost:8080/api' : 'https://app.onecar.fun/api/';
let apiPath = local ? 'http://localhost:8080/api' : 'http://39.98.194.220:9092/api/v2.0';

//http://test.onecar.dp20.cn/api/v1.0/

const Util = {
  apiPath: apiPath
}

Util.ajax = axios.create({
  baseURL: Util.apiPath,
  //timeout: 3000                  // 请求超时时间
})

// request拦截器
Util.ajax.interceptors.request.use(config => {
  // Do something before request is sent
//   console.log(store.getters.token)
  if (store.getters.token) {
    config.headers['token'] =localStorage.getItem("token"); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
// Util.ajax.interceptors.response.use(
//   response => {
//     /**
//     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
//     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
//     */
//     const code = response.data.code;
//     // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
//     if (code === 50008 || code === 50014 || code === 50012) {
//       Message({
//         message: res.message,
//         type: 'error',
//         duration: 5 * 1000
//       });
//       // 登出
//       store.dispatch('FedLogOut').then(() => {
//         router.push({ path: '/Login' })
//       });
//     } else {
//       return response
//     }

//     error => {
//       console.log('err' + error);// for debug
//       Message({
//         message: error.message,
//         type: 'error',
//         duration: 5 * 1000
//       });
//       return Promise.reject(error);
//     }



//     return config;
//   }, error => {
//     // Do something with request error
//     console.log(error); // for debug
//     Promise.reject(error);
//   })
export default Util








// import axios from 'axios'

/* 
const Util = {
  apiPath: ''
}

Util.ajax = axios.create({
  baseURL: Util.apiPath
})

axios.interceptors.response.use((res) => {
  return res.data
})
*/
/**
 * true: 使用本地mock接口
 * false: 使用线上接口
 */





// const local = true;
// let apiPath = local ? 'http://localhost:8080/api' : 'http://vpn.zhaohu.co:8001/screen_data';


// const $ = {
//   apiPath: apiPath,
//   ajax: axios.create({
//     baseURL: apiPath,
//   }),
// };

// $.ajax.interceptors.response.use(function (res) {
//   console.log(res)
//   if (res.data.code == 10041) {
//     location.href = "http://vpn.zhaohu.co:8001/screen_data/login/index?redirect=" + location.href;
//     return {};
//   }
//   return res;
// });

// export default $

// export const Apis = {
//   // meta
//   mapBound: '/border_data/get_fix_border_list',
//   businessShow: '/screen_data/get_screen_business_show',
//   colorsArea: '/screen_data/get_color_range ',
//   villageCount: '/screen_data/get_village_num',
//   searchReault: '/screen_data/get_village_data',
//   getVillageRank: '/screen_data/get_village_ranking_list',
//   getVillageFile: 'screen_data/get_use_group_data',
//   getVillageType: 'screen_data/check_user_data'
// }

axios.interceptors.response.use(res => res.data);
