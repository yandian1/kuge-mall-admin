import request from '@/request'

export function uploadImg(data: Recordable) {
  return request.post<R<{url: string}>>('/thirdpart/upload/img', data)
}