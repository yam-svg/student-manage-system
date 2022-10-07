import request from '@/utils/request'

const BASE_API = '/student'

export default {
  // 添加学生
  addStudent(data) {
    return request({
      url: `${BASE_API}/addStudent`,
      method: 'post',
      data
    })
  },
  // 头像上传
  updateStudent(data) {
    return request({
      url: `${BASE_API}/updateStudent`,
      method: 'post',
      data
    })
  },
  // 获取学生列表
  getStudentList(params, data) {
    return request({
      url: `${BASE_API}/getStudentList/${params.status}/${params.page}/${params.pageSize}`,
      method: 'get',
      params: data
    })
  },
  // 获取学生信息
  getStudentInfo(id) {
    return request({
      url: `${BASE_API}/getStudentInfo/${id}`,
      method: 'get'
    })
  },
  // 软删除学生
  deleteStudent(id) {
    return request({
      url: `${BASE_API}/deleteStudent/${id}`,
      method: 'delete'
    })
  },
  // 彻底删除学生
  deleteStudentForever(id) {
    return request({
      url: `${BASE_API}/deleteStudentForever/${id}`,
      method: 'delete'
    })
  },
  // 批量彻底删除学生
  deleteStudentForeverBatch(data) {
    return request({
      url: `${BASE_API}/deleteStudentForeverBatch`,
      method: 'delete',
      data
    })
  },
  // 恢复学生
  recoverStudent(id) {
    return request({
      url: `${BASE_API}/recoverStudent/${id}`,
      method: 'put'
    })
  },
  // 批量删除学生
  batchDeleteStudent(data) {
    return request({
      url: `${BASE_API}/batchDeleteStudent`,
      method: 'delete',
      data
    })
  },
  // 批量恢复学生
  batchRecoverStudent(data) {
    return request({
      url: `${BASE_API}/batchRecoverStudent`,
      method: 'put',
      data
    })
  },
  // 导出Excel
  exportExcel(data) {
    return request({
      url: `${BASE_API}/exportExcel`,
      method: 'post',
      data,
      responseType: 'blob'
    })
  }
}

