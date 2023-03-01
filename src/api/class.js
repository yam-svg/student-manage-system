import request from '@/utils/request'
const BASE_API = '/class'

export default {
  // 获取班级列表
  getClassList() {
    return request({
      url: `${BASE_API}/getClassList`,
      method: 'get'
    })
  },
  // 添加班级
  addClass(data) {
    return request({
      url: `${BASE_API}/addClass`,
      method: 'post',
      data
    })
  },
  // 修改班级
  updateClass(data) {
    return request({
      url: `${BASE_API}/updateClass`,
      method: 'put',
      data
    })
  },
  // 删除班级
  deleteClass(id) {
    return request({
      url: `${BASE_API}/deleteClass/${id}`,
      method: 'delete'
    })
  },
  // 更新班级中老师的名字
  updateTeacherName() {
    return request({
      url: `${BASE_API}/updateTeacherName`,
      method: 'get'
    })
  }
}

