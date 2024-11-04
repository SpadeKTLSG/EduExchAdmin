<template>
  <div class="mod-shop-notice">
    <avue-crud
      ref="crudRef"
      :data="dataList"
      :option="tableOption"
      :page="page"
      :table-loading="dataListLoading"
      @search-change="onSearch"
      @on-load="getDataList"
      @refresh-change="refreshChange"
    >

      <template #isTop="scope">
        <el-tag v-if="scope.row.isTop === 0">
          否
        </el-tag>
        <el-tag v-else>
          是
        </el-tag>
      </template>

      <template #menu-left>
        <el-button
          v-if="isAuth('shop:notice:save')"
          icon="el-icon-plus"
          type="primary"
          @click="onAddOrUpdate()"
        >
          新增
        </el-button>
      </template>

      <template #menu="scope">
        <el-button
          v-if="isAuth('shop:notice:update')"
          icon="el-icon-edit"
          type="primary"
          @click="onAddOrUpdate(scope.row.id)"
        >
          修改
        </el-button>
        <el-button
          v-if="isAuth('shop:notice:delete')"
          icon="el-icon-delete"
          type="danger"
          @click.stop="onDelete(scope.row.id)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @close="addOrUpdateVisible=false"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import {isAuth} from '@/utils/index.js'
import {ElMessage, ElMessageBox} from 'element-plus'
import AddOrUpdate from './add-or-update.vue'


// 数据列表 + 分页
const dataList = ref([])
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const dataListLoading = ref(false) // 数据列表加载状态
const addOrUpdateVisible = ref(false) // 新增 / 修改弹窗
const addOrUpdateRef = ref(null) // 新增 / 修改弹窗引用

/**
 * 获取数据列表
 * @param pageParam
 * @param params
 * @param done
 */
const getDataList = (pageParam, params, done) => {
  dataListLoading.value = true

  http({
    url: http.adornUrl('/shop/notice/page'),
    method: 'get',
    params: http.adornParams(
      Object.assign({
        current: pageParam == null ? page.currentPage : pageParam.currentPage,
        size: pageParam == null ? page.pageSize : pageParam.pageSize
      }, params))
  })
    .then(({data}) => {
      dataList.value = data.records
      page.total = data.total
      dataListLoading.value = false
      if (done) done()
    })
}


/**
 * 新增 / 修改 -> 弹窗
 * @param id
 */
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}

/**
 * 删除
 * @param id
 */
const onDelete = (id) => {
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http({
        url: http.adornUrl('/shop/notice/' + id),
        method: 'delete',
        data: http.adornData({})
      })
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              getDataList()
            }
          })
        })
    }).catch(() => {
  })
}

/**
 * 刷新回调
 */
const refreshChange = () => {
  getDataList(page)
}

const onSearch = (params, done) => {
  getDataList(page, params, done)
}

const tableOption = {
  searchMenuSpan: 6,
  columnBtn: false,
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '公告内容',
      prop: 'title',
      search: true
    },
    {
      label: '状态',
      prop: 'status',
      search: true,
      slot: true,
      type: 'select',
      dicData: [
        {
          label: '撤销',
          value: 0
        }, {
          label: '公布',
          value: 1
        }
      ]
    },
    {
      label: '是否置顶',
      prop: 'isTop',
      search: true,
      slot: true,
      type: 'select',
      dicData: [
        {
          label: '否',
          value: 0
        }, {
          label: '是',
          value: 1
        }
      ]
    }
  ]
}


</script>

