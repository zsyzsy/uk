import request from '@/utils/request'

export function verifyCode(data) {
  return request({
    url: 'uk/code',
    method: 'post',
    data: data
  })
}

export function reportLoss(data) {
  return request({
    url: 'uk/ukLoss',
    method: 'post',
    data: data
  })
}

export function unReportLoss(data) {
  return request({
    url: 'uk/ukHang',
    method: 'post',
    data: data
  })
}
// 发送法人认证短信
export function sendUKMsgToPhone(data) {
  return request({
    url: 'common/sendUKMsgToPhone',
    method: 'post',
    data: data
  })
}

// 法人人脸--发送短信 

export function sendCheckMsg(data) {
  return request({
    url: 'legalAuth/sendCheckMsg',
    method: 'post',
    data: data
  })
}

