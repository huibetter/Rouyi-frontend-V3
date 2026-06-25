import request from '@/utils/request'

// 查询书籍控制列表
export function listControl(query) {
  return request({
    url: '/system/control/list',
    method: 'get',
    params: query
  })
}

// 查询书籍控制详细
export function getControl(id) {
  return request({
    url: '/system/control/' + id,
    method: 'get'
  })
}

// 新增书籍控制
export function addControl(data) {
  return request({
    url: '/system/control',
    method: 'post',
    data: data
  })
}

// 修改书籍控制
export function updateControl(data) {
  return request({
    url: '/system/control',
    method: 'put',
    data: data
  })
}

// 删除书籍控制
export function delControl(id) {
  return request({
    url: '/system/control/' + id,
    method: 'delete'
  })
}
