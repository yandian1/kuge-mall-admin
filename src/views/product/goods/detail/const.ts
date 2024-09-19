import { InjectionKey } from 'vue'
import * as SpuTypes from '@/api/admin/spu/types'


export type Column = {
  title: string
  dataIndex: string
  key: string
}

export type BaseInfoProps = {
  shopId: NullableID
  brandId: NullableID
  categoryIds: Nullable<ID[]>
  name: string
  price: Nullable<number>
  linePrice: Nullable<number>
  firstImg: string
  imgList: string[]
  intro: string
}

export type AttrInfoProps = {
  skus: SpuTypes.Sku[]
  attrs: SpuTypes.Attr[]
}

export type DetailInfoProps = {
  detail: string
}

export type ServiceInfoProps = {
  serviceIds: Nullable<ID[]>
  freightId: Nullable<ID>
}

export const prevStepKey: InjectionKey<() => void> = Symbol('prevStepKey')

export const nextStepKey: InjectionKey<() => void> = Symbol('nextStepKey')

export const submitKey: InjectionKey<() => Promise<void>> = Symbol('submitKey')

export const baseSkuColumns = [
  {
    title: '商品价格',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '商品划线价',
    dataIndex: 'linePrice',
    key: 'linePrice',
  },
  {
    title: '商品库存',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: '商品重量',
    dataIndex: 'weight',
    key: 'weight',
  },
]
