import request from '@/utils/request'
const BASE_API = '/teacher'

export default {
  // 获取教师列表
  getTeacherList(data) {
    return request({
      url: `${BASE_API}/getTeacherList`,
      method: 'get',
      params: data
    })
  },
  // 添加教师
  addTeacher(data) {
    return request({
      url: `${BASE_API}/addTeacher`,
      method: 'post',
      data
    })
  },
  // 修改教师
  updateTeacher(data) {
    return request({
      url: `${BASE_API}/editTeacher`,
      method: 'post',
      data
    })
  },
  // 删除教师
  deleteTeacher(id) {
    return request({
      url: `${BASE_API}/deleteTeacher/${id}`,
      method: 'delete'
    })
  }
}

