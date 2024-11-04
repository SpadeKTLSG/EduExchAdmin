<template>
  <div class="mod-user">
    <avue-crud
      ref="crudRef"
      :data="dataList"
      :option="tableOption"
      :page="page"
      @search-change="onSearch"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >

      <template #status="scope">
        <el-tag v-if="scope.row.status === 0">
          封禁中
        </el-tag>
        <el-tag v-else>
          还活着
        </el-tag>
      </template>

      <template #menu="scope">
        <el-button
          icon="el-icon-edit"
          type="primary"
          @click.stop="onAddOrUpdate(scope.row.userId)"
        >
          编辑
        </el-button>
      </template>
    </avue-crud>

    <!-- 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'

const dataList = ref([])
const dataListSelections = ref([])
const addOrUpdateVisible = ref(false)
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})

/**
 * !分页查询
 */
const getDataList = (pageParam, params, done) => {

  http({
    url: http.adornUrl('/admin/user/page'),
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
      page.total = data.total
      if (done) done()
    })
}

const addOrUpdateRef = ref(null)


/**
 * 新增 / 修改
 */
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}


const onSearch = (params, done) => {
  getDataList(page, params, done)
}

const selectionChange = (val) => {
  dataListSelections.value = val
}


const tableOption = {
  searchMenuSpan: 6,
  columnBtn: false,
  border: true,
  index: true,
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
    label: '昵称',
    prop: 'nickName',
    search: true
  }, {
    label: '状态',
    prop: 'status',
    search: true,
    type: 'select',
    slot: true,
    dicData: [
      {
        label: '禁用',
        value: 0
      }, {
        label: '正常',
        value: 1
      }
    ]
  }, {
    label: '注册时间',
    prop: 'userRegtime',
    imgWidth: 150
  }]
}

</script>
