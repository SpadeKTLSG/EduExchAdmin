<template>
  <div class="mod-prod">
    <avue-crud
      ref="crudRef"
      :data="dataList"
      :option="tableOption"
      :page="page"
      :table-loading="dataListLoading"
      @search-change="onSearch"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template #menu-left>
        <el-button
          v-if="isAuth('shop:pickAddr:delete')"
          :disabled="dataListSelections.length <= 0"
          type="danger"
          @click="onDelete()"
        >
          批量删除
        </el-button>
      </template>

      <template #menu="scope">
        <el-button
          v-if="isAuth('prod:prod:delete')"
          icon="el-icon-delete"
          type="danger"
          @click="onDelete(scope.row.prodId)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script setup>
import {isAuth} from '@/utils'
import {ElMessage, ElMessageBox} from 'element-plus'


// ? 物资管理 - 商品管理页面
const router = useRouter() // 路由
const dataList = ref([]) // 数据列表
const dataListLoading = ref(false) // 列表loading判断
const page = reactive({ // 分页参数
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})


/**
 * 获取数据列表
 */
const getDataList = (pageParam, params, done) => {
  dataListLoading.value = true
  http({
    url: http.adornUrl('/prod/prod/page'),
    method: 'get',
    params: http.adornParams(
      Object.assign(
        {
          current: pageParam == null ? page.currentPage : pageParam.currentPage,
          size: pageParam == null ? page.pageSize : pageParam.pageSize
        },
        params
      )
    )
  })
    .then(({data}) => {
      dataList.value = data.records
      for (const key in dataList.value) {
        // eslint-disable-next-line no-prototype-builtins
        if (dataList.value.hasOwnProperty(key)) {
          const element = dataList.value[key]
          element.imgs = element.imgs.split(',')[0]
        }
      }
      page.total = data.total
      dataListLoading.value = false
      if (done) done()
    })
}


/**
 * 删除和批量删除
 * @param id
 */
const onDelete = (id) => {
  const prodIds = getSeleProdIds()
  if (id) {
    prodIds.push(id)
  }
  ElMessageBox.confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http({
        url: http.adornUrl('/prod/prod'),
        method: 'delete',
        data: http.adornData(prodIds, false)
      })
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              getDataList(page)
            }
          })
        })
    })
    .catch(() => {
    })
}


/**
 * 条件查询
 * @param params
 * @param done
 */
const onSearch = (params, done) => {
  getDataList(page, params, done)
}

const dataListSelections = ref([])
/**
 * 多选变化
 * @param val
 */
const selectionChange = (val) => {
  dataListSelections.value = val
}

/**
 * 获取选中的商品Id列表
 */
const getSeleProdIds = () => {
  return dataListSelections.value?.map(item => {
    return item.prodId
  })
}

/**
 * 列表配置 - 自定义列配置
 */
const tableOption = {
  searchMenuSpan: 6,
  columnBtn: false,
  border: true,
  selection: true,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '产品名字',
    prop: 'prodName',
    search: true
  }, {
    label: '商品现价',
    prop: 'price'
  }, {
    label: '商品库存',
    prop: 'totalStocks'
  }, {
    label: '产品图片',
    prop: 'pic',
    type: 'upload',
    width: 150,
    listType: 'picture-img'

  }, {
    width: 150,
    label: '状态',
    prop: 'status',
    search: true,
    slot: true,
    type: 'select',
    dicData: [
      {
        label: '未上架',
        value: 0
      }, {
        label: '上架',
        value: 1
      }
    ]
  }]
}


</script>
