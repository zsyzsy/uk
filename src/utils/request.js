import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { showLoading, hideLoading } from '@/utils/loading'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://e.etest.tf.cn:4443/ecloud/ms/',
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'https://e.etest.tf.cn:4443/ecloud/ukms/',
  timeout: 20000 // request timeout
})

// console.log(service)
// request interceptor
service.interceptors.request.use(
  config => {
     showLoading()
    // if (config.url === 'refreshVaricationCode') {
    //   if (process.env.NODE_ENV === 'development') {
    //     config.baseURL = '/ukms'
    //     // config.baseURL = 'https://e.etest.tf.cn:4443/ecloud/ukms/'
    //   }
    //   //  else {
    //   //   config.baseURL = 'https://e.etest.tf.cn:4443/ecloud/ukms/'
    //   // }
    // }
    // console.log(process.env.NODE_ENV, '-----')
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.data['tokenId'] = getToken()
    }
    return config
  },
  error => {
    hideLoading();
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    hideLoading()
    const res = response.data
    if (res.code === '03') {
      // to re-login
      MessageBox.confirm('太久没操作登录已经失效, 点击取消停留在当前页面, 或者重新登录', '登录失效', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error(res.message || res + '====='))
    } else if (res.code !== '00') {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return res
    } else {
      return res
    }
  },
  error => {
    hideLoading()
    console.log(error, '--error----') // for debug
    const reg1 = /timeout/gi
    let msg = error.message
    if (reg1.test(msg)) {d
      msg = '请求超时,请检查网络环境'
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
