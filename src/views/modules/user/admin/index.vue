<template>
  <div class="mod-user">
    <avue-crud
      ref="crudRef"
      :data="dataList"
      :option="tableOption"
      :page="page"
      @search-change="onSearch"
      @on-load="getDataList"
    >
    </avue-crud>

    <!-- 弹窗 新增 / 修改 -->
    <!--该功能未实现    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />-->

  </div>
</template>

<script setup>

const dataList = ref([])

const page = reactive({
  currentPage: 1
})

/**
 * 获取数据列表
 */
const getDataList = (pageParam, params, done) => {
  http({
    url: http.adornUrl('/admin/employee/page'),
    method: 'get',
    params: http.adornParams( //组合查询条件和分页参数 (根据后端, 仅一个)
      Object.assign(
        {
          current: pageParam == null ? page.currentPage : pageParam.currentPage
        },
        params
      )
    )
  }).then((response) => {
    dataList.value = response.data.data.records
    if (done) done() //完成回调
  })
}
//note: 这里因为先开发的后端, 所以只有一个分页参数, 如果有多个, 需要合并.
//同时, 由于没有实现条件查询, 因此搜索实际上完全不能用...2333


/**
 * 搜索时候拉数据
 */
const onSearch = (params, done) => {
  getDataList(page, params, done)
}

/**
 * 表格配置
 */
const tableOption = {
  searchMenuSpan: 6,
  columnBtn: false,
  border: true,
  selection: true,
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
    label: '账号',
    prop: 'account',
    search: false
  }, {
    label: '姓名',
    prop: 'name',
    search: false
  }]
}


</script>
