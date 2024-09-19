declare type Recordable = Record<string, any>

declare type R<D = any> = {
  code: number
  message: string
  data: D
}

declare type PageData<I> = {
  pageNum: number
  pageSize: number
  list: I[]
  total: number
}

declare type ID = number | string

declare type Nullable<T> = T | undefined

declare type NullableID = Nullable<ID>

declare module '@wangeditor/editor-for-vue'
