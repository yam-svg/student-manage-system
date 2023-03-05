import request from '@/utils/request'
const BASE_API = '/course'

// 查询考试批次
export function getExamBatch() {
  return request({
    url: `${BASE_API}/getExamBatch`,
    method: 'get'
  })
}

// 查询考试科目及成绩
export function getScoreData(data) {
  return request({
    url: `${BASE_API}/getExamSubject`,
    method: 'post',
    data
  })
}

// 新增考试批次
export function addExamBatch(data) {
  return request({
    url: `${BASE_API}/addExamBatch`,
    method: 'post',
    data
  })
}

// 批量录入成绩
export function saveScoreData(data) {
  return request({
    url: `${BASE_API}/addScore`,
    method: 'post',
    data
  })
}

// 修改考试
export function updateExam(data) {
  return request({
    url: `${BASE_API}/updateExam`,
    method: 'post',
    data
  })
}

// 删除考试
export function deleteExam(data) {
  return request({
    url: `${BASE_API}/deleteExam`,
    method: 'post',
    data
  })
}

// 查询考试成绩 by student_id
export function getStudentScore(id) {
  return request({
    url: `${BASE_API}/getStudentScore/${id}`,
    method: 'get'
  })
}
