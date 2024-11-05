<template>

  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="!dataForm.orderNumber ? '新增' : '查看'"
    width="80%"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <div class="main">
        <div class="content">

          <!--流程图-->
          <div class="order-number">
            <div class="num-cont">
              <el-form-item label="订单编号:">
                <span class="text">{{ dataForm.orderNumber }}</span>
              </el-form-item>
              <el-form-item>
                <el-steps
                  :active="stepsStatus"
                  :process-status="dataForm.status === 6 ? 'error':'wait'"
                  align-center
                >
                  <el-step
                    :description="dataForm.orderTime"
                    title="提交订单"
                  />
                  <el-step
                    :description="dataForm.payTime"
                    title="买家已付款"
                  />
                  <el-step
                    v-if="dataForm.orderType !== 1"
                    :description="dataForm.dvyTime"
                    title="卖家已发货"
                  />
                  <el-step
                    v-if="dataForm.orderType !== 1"
                    :description="dataForm.finallyTime"
                    title="买家已收货"
                  />
                </el-steps>
              </el-form-item>
            </div>
          </div>

          <div class="order-state">
            <div class="state-cont">

              <!--订单状态-->
              <div class="state-title">
                <el-form-item label="订单状态:">
                  <template #default>
                    <el-tag
                      v-if="dataForm.status === 1"
                      type="warning"
                    >
                      待付款
                    </el-tag>
                    <el-tag
                      v-if="dataForm.status === 2 && dataForm.orderType !== 1"
                      type="warning"
                    >
                      待发货
                    </el-tag>
                    <el-tag
                      v-if="dataForm.status === 3 && dataForm.orderType !== 1"
                      type="warning"
                    >
                      待收货
                    </el-tag>
                    <el-tag
                      v-if="dataForm.status === 4 && dataForm.orderType !== 1"
                      type="warning"
                    >
                      待评价
                    </el-tag>
                    <el-tag
                      v-if="dataForm.status === 5"
                      type="success"
                    >
                      成功
                    </el-tag>
                    <el-tag
                      v-if="dataForm.status === 6"

                    >
                      失败
                    </el-tag>
                  </template>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-button
                      v-if="dataForm.status === 2 && dataForm.orderType !== 1"
                      plain
                      type="primary"
                      @click="changeOrder(dataForm.orderNumber)"
                    >
                      发货
                    </el-button>
                  </el-row>
                </el-form-item>
              </div>


              <div class="order-info">
                <div class="order-details">
                  <div class="detail-title">
                    <img
                      alt=""
                      src="~@/static/img/car.png"
                    >
                    <span class="prompt">买家付款后才可以发货</span>
                  </div>
                  <div class="detail-cont">
                    <div class="detail01">
                      <img
                        alt=""
                        src="~@/static/img/address.png"
                      >
                      <div class="text-width">
                        <el-form-item label="收货人:">
                          <span>{{ dataForm.userAddrOrder.receiver }}</span>
                        </el-form-item>
                        <el-form-item label="手机:">
                          <span>{{ dataForm.userAddrOrder.mobile }}</span>
                        </el-form-item>
                        <el-form-item label="收货地址">
                          <span>{{ dataForm.userAddrOrder.province }}{{ dataForm.userAddrOrder.city }}{{ dataForm.userAddrOrder.area }}{{ dataForm.userAddrOrder.addr }}</span>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="detail01">
                      <img
                        alt=""
                        src="~@/static/img/invoice.png"
                      >
                      <span>不开发票</span>
                    </div>
                  </div>
                </div>
                <div class="buyers">
                  <div class="detail-title">
                    <img
                      alt=""
                      src="~@/static/img/buyer.png"
                      style="margin-right:15px"
                    >
                    <el-form-item
                      label="买家:"
                      label-width="44px"
                      style="margin-top:22px"
                    >
                      <span>{{ dataForm.nickName }}</span>
                    </el-form-item>
                  </div>
                  <div class="buyers-info">
                    <div class="detail02">
                      <img
                        alt=""
                        src="~@/static/img/message.png"
                      >
                      <div class="text-width">
                        <span>买家备注:</span>
                        <br>
                        <span>{{ dataForm.remarks }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="item-list">
                <el-table
                  :data="dataForm.orderItems"
                  border
                >
                  <el-table-column
                    label="商品"
                    prop=""
                  >
                    <template #default="scope">
                      <div class="prod-con">
                        <img
                          :src="resourcesUrl + scope.row.pic"
                          class="prod-img"
                        >
                        <span>{{ scope.row.prodName }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="单价"
                    prop="price"
                    width="180"
                  >
                    <template #default="scope">
                      <span>{{ scope.row.price }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="数量"
                    prop="count"
                    width="180"
                  >
                    <template #default="scope">
                      <span>{{ scope.row.prodCount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="总价"
                    prop="totalPrice"
                    width="180"
                  >
                    <template #default="scope">
                      <span>{{ scope.row.productTotalAmount }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="item-info">
                <el-form-item label="商品总价:">
                  <span class="text">￥{{ dataForm.total }}</span>
                </el-form-item>
                <el-form-item
                  v-if="dataForm.freightAmount"
                  label="配送费用:"
                >
                  <span class="text">￥{{ dataForm.freightAmount }}</span>
                </el-form-item>
                <el-form-item label="应付金额:">
                  <span class="text">￥{{ dataForm.actualTotal }}</span>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="order-log">
            <div class="log-title">
              <span>订单日志</span>
            </div>
            <div class="log-cont">
              <el-form-item
                v-if="dataForm.orderTime"
                label-width="10px"
              >
                <span>{{ dataForm.orderTime }} {{ dataForm.nickName }} 创建订单（成功）</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.updateTime"
                label-width="10px"
              >
                <span>{{ dataForm.updateTime }} {{ dataForm.nickName }} 订单更新（成功）</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.payTime"
                label-width="10px"
              >
                <span>{{ dataForm.payTime }} {{ dataForm.nickName }} 订单付款（成功）</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.dvyTime"
                label-width="10px"
              >
                <span>{{ dataForm.dvyTime }} {{ dataForm.nickName }} 订单发货（成功）</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.finallyTime"
                label-width="10px"
              >
                <span>{{ dataForm.finallyTime }} {{ dataForm.nickName }} 完成订单（成功）</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.cancelTime"
                label-width="10px"
              >
                <span>{{ dataForm.cancelTime }} {{ dataForm.nickName }} 取消订单（成功）</span>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>

  </el-dialog>
</template>


<script setup>

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const visible = ref(false)
const devyVisible = ref(false)
const dataFormRef = ref(null)
const devyAddRef = ref(null)

const dataForm = ref({
  orderId: 0,
  orderNumber: '',
  remarks: '',
  total: 0,
  actualTotal: 0,
  dvyType: '',
  status: 1,
  addrOrderId: 0,
  nickName: '',
  orderItems: [],
  orderTime: '',
  updateTime: '',
  payTime: '',
  dvyTime: '',
  finallyTime: '',
  cancelTime: '',
  userAddrOrder: {}
})

const stepsStatus = computed(() => {
  if (dataForm.value.finallyTime) {
    return 4
  }
  if (dataForm.value.dvyTime) {
    return 3
  }
  if (dataForm.value.payTime) {
    return 2
  }
  if (dataForm.value.orderTime) {
    return 1
  }
  return ''
})


watch(
  () => visible.value,
  () => {
    if (!visible.value) {
      devyVisible.value = false
    }
  }
)


const init = (orderNumber) => {
  dataForm.value.orderNumber = orderNumber || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
  if (dataForm.value.orderNumber) {
    // 修改
    http({
      url: http.adornUrl(`/order/order/orderInfo/${dataForm.value.orderNumber}`),
      method: 'get',
      params: http.adornParams()
    })
      .then(({data}) => {
        dataForm.value = data
      })
  }
}
defineExpose({init})


const getDataList = () => {
  http({
    url: http.adornUrl(`/order/order/orderInfo/${dataForm.value.orderNumber}`),
    method: 'get',
    params: http.adornParams()
  })
    .then(({data}) => {
      dataForm.value = data
    })
}

/**
 * 发货
 * @param orderNumber
 */
const changeOrder = (orderNumber) => {
  devyVisible.value = true
  nextTick(() => {
    devyAddRef.value?.init(orderNumber, dataForm.value.dvyId, dataFormRef.value?.dvyFlowId)
  })
}
</script>
