import request from '@/utils/request'

const BASE_API = '/admin'

export function login(data) {
  return request({
    url: `${BASE_API}/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${BASE_API}/adminInfo`,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: `${BASE_API}/logout`,
    method: 'get'
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: `${BASE_API}/updatePassword`,
    method: 'post',
    data
  })
}

// 获取邮箱验证码
export function getEmailCode(data) {
  return request({
    url: `${BASE_API}/getEmailCode`,
    method: 'post',
    data
  })
}

// 找回密码
export function retrievePassword(data) {
  return request({
    url: `${BASE_API}/retrievePassword`,
    method: 'post',
    data
  })
}

// 换绑邮箱 - 验证码确认
export function confirmEmailCode(data) {
  return request({
    url: `${BASE_API}/confirmEmailCode`,
    method: 'post',
    data
  })
}

// 换绑邮箱 - 修改邮箱
export function updateEmail(data) {
  return request({
    url: `${BASE_API}/updateEmail`,
    method: 'post',
    data
  })
}
