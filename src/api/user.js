import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

export function refreshVaricationCode(data) {
  return request({
    url: 'refreshVaricationCode',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'loginOut',
    method: 'post',
    data: {}
  })
}

export function getVCode(data) {
  return request({
    url: 'common/sendMsgToPhone',
    method: 'post',
    data: data
  })
}

export function verifyCode(data) {
  return request({
    url: 'pwd/validation/code',
    method: 'post',
    data: data
  })
}

export function setPassword(data) {
  return request({
    url: 'pwd/change',
    method: 'post',
    data: data
  })
}

export function changePassWord(data) {
  return request({
    url: 'pwd/change',
    method: 'post',
    data: data
  })
}
