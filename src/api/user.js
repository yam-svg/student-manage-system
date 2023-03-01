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

// 保存登录日志
export function saveLoginLog(data) {
  return request({
    url: `${BASE_API}/saveLoginLog`,
    method: 'post',
    data
  })
}

// 获取登录日志
export function getLoginLog(data) {
  return request({
    url: `${BASE_API}/getLoginLog`,
    method: 'get',
    params: data
  })
}

// 获取近七天登录数据
export function getSevenDaysLoginLog() {
  return request({
    url: `${BASE_API}/getLoginData`,
    method: 'get'
  })
}

// 获取ip信息
export function getIpInfo() {
  return request({
    url: `${BASE_API}/getIpInfo`,
    method: 'get'
  })
}

// 留言
export function leaveMessage(data) {
  return request({
    url: `${BASE_API}/message`,
    method: 'post',
    data
  })
}
