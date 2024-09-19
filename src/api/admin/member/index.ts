import request from '@/request'
import { MemberPageItem } from './types'

export function getMemberPage(data: Recordable) {
  return request.post<R<PageData<MemberPageItem>>>('/admin/member/pageList', data)
}