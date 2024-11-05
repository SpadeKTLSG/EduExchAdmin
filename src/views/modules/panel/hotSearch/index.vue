<template>
  <div class="mod-hotSearcch">
    <avue-crud
      ref="crudRef"
      :data="dataList"
      :option="tableOption"
      :page="page"
      :table-loading="dataListLoading"
      @search-change="onSearch"
      @on-load="getDataList"
      @refresh-change="refreshChange"
      @selection-change="selectionChange"
    >
      <template #menu-left>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="onAddOrUpdate()"
        >
          新增
        </el-button>
        <el-button
          :disabled="dataListSelections.length <= 0"

          @click.stop="onDeconste"
        >
          批量删除
        </el-button>
      </template>

      <template #status="scope">
        <el-tag
          v-if="scope.row.status === 0"

        >
          未启用
        </el-tag>
        <el-tag v-else>
          启用
        </el-tag>
      </template>

      <template #menu="scope">
        <el-button
          icon="el-icon-edit"
          type="primary"
          @click="onAddOrUpdate(scope.row.hotSearchId)"
        >
          修改
        </el-button>
        <el-button
          icon="el-icon-deconste"

          @click.stop="onDeconste(scope.row,scope.index)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import {ElMessage, ElMessageBox} from 'element-plus'
import AddOrUpdate from './add-or-update.vue'


//TODO 未完成
const dataList = ref([])
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const dataListLoading = ref(false)
/**
 * 获取数据列表
 */
const getDataList = (pageParam, params, done) => {
  dataListLoading.value = true
  http({
    url: http.adornUrl('/admin/hotSearch/page'),
    method: 'get',
    params: http.adornParams(Object.assign({
      current: pageParam ? pageParam.currentPage : 1,
      size: pageParam ? pageParam.pageSize : 20
    }, params))
  })
    .then(({data}) => {
      page.total = data.total
      page.pageSize = data.size
      page.currentPage = data.current
      dataList.value = data.records
      dataListLoading.value = false
      if (done) done()
    })
}
const dataListSelections = ref([])
/**
 * 多选回调
 * @param list
 */
const selectionChange = (list) => {
  dataListSelections.value = list
}

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
/**
 * 新增 / 修改
 * @param id
 */
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}

/**
 * 点击查询
 */
const onSearch = (params, done) => {
  getDataList(page, params, done)
}

/**
 * 删除
 */
const onDeconste = (row) => {
  const ids = row.hotSearchId ? [row.hotSearchId] : dataListSelections.value?.map(item => {
    return item.hotSearchId
  })
  ElMessageBox.confirm(`确定进行[${row.hotSearchId ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http({
        url: http.adornUrl('/admin/hotSearch'),
        method: 'delete',
        data: http.adornData(ids, false)
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
const refreshChange = () => {
  getDataList(page)
}

/**
 * 菜单配置
 */
const tableOption = {
  searchMenuSpan: 6,
  columnBtn: false,
  border: true,
  index: false,
  selection: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '热搜标题',
      prop: 'title',
      search: true
    },
    {
      label: '热搜内容',
      prop: 'content',
      search: true
    },
    {
      label: '录入时间',
      prop: 'recDate',
      sortable: true
    },
    {
      label: '顺序',
      prop: 'seq',
      sortable: true
    },
    {
      label: '启用状态',
      prop: 'status',
      type: 'select',
      slot: true,
      search: true,
      dicData: [
        {
          label: '未启用',
          value: 0
        }, {
          label: '启用',
          value: 1
        }
      ]
    }
  ]
}


</script>
