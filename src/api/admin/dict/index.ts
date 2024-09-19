import request from '@/request';
import { DictTypePageItem, DictValueListItem, DictValuePageItem } from "./types"

export function getDictTypePage(data: Recordable) {
  return request.post<R<PageData<DictTypePageItem>>>('/admin/dict/type/pageList', data)
}

export function updateDictType(data: Recordable) {
  return request.post<R>('/admin/dict/type/update', data)
}

export function addDictType(data: Recordable) {
  return request.post<R>('/admin/dict/type/add', data)
}

export function getDictType(id: ID) {
  return request.post<R<{type: string, code: string}>>('/admin/dict/type/' + id)
}

export function delDictType(id: ID) {
  return request.post<R>('/admin/dict/type/del/' + id)
}

export function getDictValuePage(data: Recordable) {
  return request.post<R<PageData<DictValuePageItem>>>('/admin/dict/value/pageList', data)
}

export function getDictValueList(code: string) {
  return request.post<R<DictValueListItem[]>>('/admin/dict/value/list/' + code)
}

export function updateDictValue(data: Recordable) {
  return request.post<R>('/admin/dict/value/update', data)
}

export function addDictValue(data: Recordable) {
  return request.post<R>('/admin/dict/value/add', data)
}

export function getDictValue(id: ID) {
  return request.post<R<{value: string}>>('/admin/dict/value/' + id)
}

export function delDictValue(id: ID) {
  return request.post<R>('/admin/dict/value/del/' + id)
}

