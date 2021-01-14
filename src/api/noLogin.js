// ukService/downloadCert
import request from '@/utils/request2'

export function downloadCert(data) { // 下载证书
  return request({
    url: 'ukService/downloadCert',
    method: 'post',
    data
  })
}
