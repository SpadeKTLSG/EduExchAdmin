import axios from 'axios'
import qs from 'qs'
import cookie from 'vue-cookies'
import merge from 'lodash/merge'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json, text/plain, */*',
    'Authorization': cookie.get('Authorization') // Include the token
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(
  config => {
    config.headers.Authorization = cookie.get('Authorization') // 请求头带上token
    // 只针对get方式进行序列化
    if (config.method === 'get' || config.method === 'GET') {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)


/**
 * 请求地址处理
 */
http.adornUrl = actionName => {
  return import.meta.env.VITE_APP_BASE_API + actionName
}


/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = false) => {
  const defaults = {
    t: Date.now()
  }
  return openDefultParams ? merge(defaults, params) : params
}


/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = false, contentType = 'json') => {
  const defaults = {
    t: Date.now()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}


const uploadFile = function (url, file) {
  const config = {
    // 添加请求头
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: cookie.get('Authorization') // 请求头带上token
    }
  }
  const param = new FormData()
  // 通过append向form对象添加数据
  param.append('file', file)
  return axios.post(url, param, config)
}

export default http
export {uploadFile}
