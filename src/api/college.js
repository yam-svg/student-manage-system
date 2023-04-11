import request from '@/utils/request'
const BASE_API = '/college'

// 查询所有学院
export function getCollegeList() {
  return request({
    url: BASE_API + '/list',
    method: 'get'
  })
}

// 添加学院
export function addCollege(data) {
  return request({
    url: BASE_API + '/add',
    method: 'post',
    data
  })
}

// 修改学院信息
export function updateCollege(data) {
  return request({
    url: BASE_API + '/update',
    method: 'put',
    data
  })
}

// 删除学院
export function deleteCollege(id) {
  return request({
    url: BASE_API + '/delete/' + id,
    method: 'delete'
  })
}
