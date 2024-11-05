<template>

  <div class="mod-order-order">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter="getDataList(page)"
    >
      <el-form-item label="订单编号:">
        <el-input
          v-model="dataForm.orderNumber"
          clearable
          placeholder="订单编号"
        />
      </el-form-item>

      <el-form-item label="下单时间:">
        <el-date-picker
          v-model="dateRange"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="订单状态:">
        <el-select
          v-model="dataForm.status"
          clearable
          placeholder="请选择订单状态"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>


      <el-form-item>

        <el-button
          icon="el-icon-search"
          type="primary"
          @click="getDataList()"
        >
          查询
        </el-button>

        <el-button @click="clearDatas()">
          清空
        </el-button>
      </el-form-item>
    </el-form>


    <div class="main">
      <div class="content">
        <div class="tit">
          <el-row style="width:100%">
            <el-col :span="10">
              <span class="item product">商品</span>
            </el-col>
            <el-col :span="3">
              <span class="item">成交单价/购买数量</span>
            </el-col>
            <el-col :span="3">
              <span class="item">实付金额</span>
            </el-col>
            <el-col :span="3">
              <span class="item">支付方式</span>
            </el-col>
            <el-col :span="3">
              <span class="item">订单状态</span>
            </el-col>
            <el-col :span="2">
              <span class="item">操作</span>
            </el-col>
          </el-row>
        </div>

        <div
          v-for="order in dataList"
          :key="order.orderId"
          class="prod"
        >
          <div class="prod-tit">
            <span>订单编号：{{ order.orderNumber }}</span>
            <span>下单时间：{{ order.createTime }}</span>
          </div>
          <div class="prod-cont">
            <el-row style="width:100%">
              <el-col :span="12">
                <div class="prod-item">
                  <div
                    v-for="orderItem in order.orderItems"
                    :key="orderItem.orderItemId"
                    class="items name"
                  >
                    <div class="prod-image">
                      <img
                        :src="resourcesUrl + orderItem.pic"
                        alt=""
                        style="height:100px;width: 100px;"
                      >
                    </div>
                    <div class="prod-name">
                      <span>{{ orderItem.prodName }}</span>
                      <span class="prod-info">{{ orderItem.skuName }}</span>
                    </div>
                    <div class="prod-price">
                      <span>￥{{ orderItem.price }}</span>
                      <span>×{{ orderItem.prodCount }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%;"
              >
                <div class="item">
                  <div>
                    <span class="totalprice">￥{{ order.actualTotal }}</span>
                    <span v-if="order.freightAmount">（含运费：￥{{ order.freightAmount }}）</span>
                    <span>共{{ order.productNums }}件</span>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%;"
              >
                <div class="item">
                  <div>
                    <span v-if="order.payType === 1">微信支付</span>
                    <span v-else-if="order.payType === 2">支付宝</span>
                    <span v-else>手动代付</span>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%;"
              >
                <div class="item">
                  <span
                    v-if="order.status === 1"

                  >待付款</span>
                  <span
                    v-else-if="order.status === 2"

                  >待发货</span>
                  <span
                    v-else-if="order.status === 3"

                  >待收货</span>
                  <span
                    v-else-if="order.status === 4"

                  >待评价</span>
                  <span
                    v-else-if="order.status === 5"

                  >成功</span>
                  <span
                    v-else
                  >失败</span>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%;"
              >
                <div class="item">
                  <div class="operate">
                    <el-button
                      type="text"
                      @click="onAddOrUpdate(order.orderNumber)"
                    >
                      查看
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="remark">
            <div class="buyer-remark">
              <span>备注:{{ order.remarks }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="!dataList.length" class="empty-tips"> 暂无数据</div>

    <el-pagination
      :current-page="page.pageIndex"
      :page-size="page.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './order-info.vue'

//TODO 未完成
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const dataForm = ref({})
const dateRange = ref([])
const dataList = ref([])
const addOrUpdateRef = ref(null)
const addOrUpdateVisible = ref(false)
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})

const options = [{
  value: 1,
  label: '待付款'
},
  {
    value: 2,
    label: '待发货'
  },
  {
    value: 3,
    label: '待收货'
  },
  {
    value: 4,
    label: '待评价'
  },
  {
    value: 5,
    label: '成功'
  },
  {
    value: 6,
    label: '失败'
  }]


onMounted(() => {
  getDataList(page)
})


/**
 * 获取数据列表
 */
const getDataList = (pageParam, params, done) => {
  pageParam = (pageParam === undefined ? page : pageParam)
  http({
    url: http.adornUrl('/order/order/page'),
    method: 'get',
    params: http.adornParams(
      Object.assign(
        {
          current: pageParam == null ? page.currentPage : pageParam.currentPage,
          size: pageParam == null ? page.pageSize : pageParam.pageSize,
          orderNumber: dataForm.value.orderNumber,
          status: dataForm.value.status,
          startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
          endTime: dateRange.value === null ? null : dateRange.value[1] // 结束时间
        },
        params
      ), false
    )
  })
    .then(({data}) => {
      dataList.value = data.records
      page.total = data.total
      if (done) done()
    })
}


/**
 * 清除数据
 */
const clearDatas = () => {
  dataForm.value = {}
  dateRange.value = []
}

/**
 * 每页数
 * @param val
 */
const sizeChangeHandle = (val) => {
  page.pageSize = val
  page.currentPage = 1
  getDataList(page)
}

/**
 * 当前页
 * @param val
 */
const currentChangeHandle = (val) => {
  page.currentPage = val
  getDataList(page)
}


/**
 * 新增 / 修改
 * @param val
 */
const onAddOrUpdate = (val) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(val)
  })
}

</script>
