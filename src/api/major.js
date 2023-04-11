import request from '@/utils/request'
const BASE_API = '/major'

// 获取学院以及专业列表
export function getMajorList() {
  return request({
    url: BASE_API + '/list',
    method: 'get'
  })
}

// 查询所有专业
export function getMajorListAll() {
  return request({
    url: BASE_API + '/listAll',
    method: 'get'
  })
}

// 根据学院id查询专业
export function getMajorListByCollegeId(collegeId) {
  return request({
    url: BASE_API + '/listByCollegeId',
    method: 'get',
    params: {
      collegeId
    }
  })
}

// 修改专业信息
export function updateMajor(data) {
  return request({
    url: BASE_API + '/update',
    method: 'post',
    data
  })
}

// 添加专业
export function addMajor(data) {
  return request({
    url: BASE_API + '/add',
    method: 'post',
    data
  })
}

// 删除专业
export function deleteMajor(majorId) {
  return request({
    url: BASE_API + '/delete',
    method: 'delete',
    params: {
      majorId
    }
  })
}
