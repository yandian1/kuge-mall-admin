<template>
  <a-space direction="vertical">
    <a-card title="基本信息">
      <a-descriptions>
        <a-descriptions-item label="订单号">
          {{ orderDetail.sn }}
        </a-descriptions-item>
        <a-descriptions-item label="店铺">
          {{ orderDetail.shopName }}
        </a-descriptions-item>
        <a-descriptions-item label="金额">
          ￥{{ orderDetail.price }}
        </a-descriptions-item>
        <a-descriptions-item label="订单状态">
          {{ orderDetail.statusDesc }}
        </a-descriptions-item>
        <a-descriptions-item label="支付状态">
          {{ orderDetail.payStatusDesc }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="收货地址">
      <a-descriptions>
        <a-descriptions-item label="收货人姓名">
          {{ orderDetail.receiverName }}
        </a-descriptions-item>
        <a-descriptions-item label="收货人手机">
          {{ orderDetail.receiverPhone }}
        </a-descriptions-item>
        <a-descriptions-item label="收货人地址">
          {{ orderDetail.receiverAddress }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="订单商品">
      <a-list
        item-layout="horizontal"
        :data-source="orderDetail.orderGoodsList"
      >
        <template #renderItem="{ item: orderGoods }">
          <a-list-item>
            <template #actions>
              <a-button
                type="link"
                v-if="orderGoods.status === OrderStatus.unSend.code"
                @click="deliverGoodsProps = { visible: true, id: orderGoods.id }"
              >
                发货
              </a-button>
            </template>
            <a-descriptions>
              <a-descriptions-item label="商品名称">
                {{ orderGoods.name }}
              </a-descriptions-item>
              <a-descriptions-item label="商品属性">
                {{ orderGoods.attrs }}
              </a-descriptions-item>
              <a-descriptions-item label="商品数量">
                {{ orderGoods.num }}
              </a-descriptions-item>
              <a-descriptions-item label="商品价格">
                ￥{{ orderGoods.price}}
              </a-descriptions-item>
              <a-descriptions-item label="订单状态">
                {{ orderGoods.statusDesc }}
              </a-descriptions-item>
              <a-descriptions-item label="支付状态">
                {{ orderGoods.payStatusDesc }}
              </a-descriptions-item>
              <a-descriptions-item label="快递公司" v-if="orderGoods.deliveryCompany">
                {{ orderGoods.deliveryCompany }}
              </a-descriptions-item>
              <a-descriptions-item label="快递单号" v-if="orderGoods.deliverySn">
                {{ orderGoods.deliverySn }}
              </a-descriptions-item>
              <a-descriptions-item label="商品图片">
                <a-image :src="orderGoods.img" style="width: 80px" />
              </a-descriptions-item>
            </a-descriptions>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-space>

  <deliver-goods
    v-model:visible="deliverGoodsProps.visible"
    :id="deliverGoodsProps.id"
    @success="getOrder"
  />
</template>

<script setup lang="ts" name="OrderDetail">
import { ref } from "vue"
import { useRoute } from "vue-router"
import * as orderApi from '@/api/admin/order'
import * as OrderTypes from '@/api/admin/order/types'
import { OrderStatus } from "@/constant"
import deliverGoods from './../components/deliverGoods.vue'

const route = useRoute()
const id = parseFloat(route.query.id as string)
const orderDetail = ref({} as OrderTypes.OrderDetail)
const deliverGoodsProps = ref({
  visible: false,
  id: '',
})

const getOrder = () => {
  orderApi
    .getOrder(id)
    .then((res) => {
      orderDetail.value = res.data.data
    })
    .catch(() => {
    })
}

const init = () => {
  getOrder()
}

init()
</script>
