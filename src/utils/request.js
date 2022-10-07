import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/api',
  timeout: 5000
})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken()
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
}
)

service.interceptors.response.use(response => {
  const res = response.data
  // 放行文件流
  if (response.headers['content-type'] === 'application/vnd.openxmlformats') {
    return res
  }
  if (res.code !== 20000) {
    Message({
      message: res.msg || 'Error',
      type: 'error',
      duration: 5 * 1000
    })

    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    return Promise.reject(new Error(res.msg || 'Error'))
  } else {
    return res
  }
},
error => {
  console.log('err' + error) // for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service
