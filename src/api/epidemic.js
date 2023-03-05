import request from '@/utils/request'
const BASE_API = '/epidemic'

// 获取学生疫情信息
export function getEpidemicInfo(classId, data) {
  return request({
    url: `${BASE_API}/getStudentEpidemic/?classId=${classId}`,
    method: 'post',
    data
  })
}

// 初始化学生疫情信息
export function initEpidemicInfo(classId) {
  return request({
    url: `${BASE_API}/initStudentEpidemic`,
    method: 'post',
    data: {
      classId
    }
  })
}

// 更新学生疫情信息
export function updateEpidemicInfo(data) {
  return request({
    url: `${BASE_API}/updateStudentEpidemic`,
    method: 'post',
    data
  })
}
