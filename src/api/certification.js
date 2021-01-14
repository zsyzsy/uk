import request from '@/utils/request'

export function certDownload(data) { // 下载证书
  return request({
    url: 'cert/download',
    method: 'post',
    data
  })
}
export function updateCert(data) { // 证书更新
  return request({
    url: 'cert/updateCert',
    method: 'post',
    data
  })
}
