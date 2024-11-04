<template>

  <div class="mod-category">
    <el-form
      :inline="true"
      :model="dataForm"
    >
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="onAddOrUpdate()"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      row-key="categoryId"
      style="width: 100%;"
    >
      <el-table-column
        header-align="center"
        label="分类名称"
        prop="categoryName"
        tree-key="categoryId"
        width="150"
      />
      <el-table-column
        align="center"
        header-align="center"
        label="图片"
        prop="pic"
      >
        <template #default="scope">
          <img
            :src="checkFileUrl(scope.row.pic)"
            alt=""
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="状态"
        prop="status"
      >
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === 0"

          >
            下线
          </el-tag>
          <el-tag v-else>
            正常
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="排序号"
        prop="seq"
      />
      <el-table-column
        align="center"
        header-align="center"
        label="操作"
      >
        <template #default="scope">
          <el-button
            type="primary"
            @click="onAddOrUpdate(scope.row.categoryId)"
          >
            修改
          </el-button>
          <el-button

            @click="onDelete(scope.row.categoryId)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @close="addOrUpdateVisible=false"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import {checkFileUrl, treeDataTranslate} from '@/utils'
import {ElMessage, ElMessageBox} from 'element-plus'
import AddOrUpdate from './add-or-update.vue'


onMounted(() => {
  getDataList()
})

const dataForm = ref({})
const dataList = ref([])
const dataListLoading = ref(false)


/**
 * 获取数据列表
 */
const getDataList = () => {
  dataListLoading.value = true
  http({
    url: http.adornUrl('/prod/category/table'),
    method: 'get',
    params: http.adornParams()
  })
    .then(({data}) => {
      dataList.value = treeDataTranslate(data, 'categoryId', 'parentId')
      dataListLoading.value = false
    })
}

const addOrUpdateVisible = ref(false)
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

/**
 * 删除
 */
const onDelete = (id) => {
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      http({
        url: http.adornUrl(`/prod/category/${id}`),
        method: 'delete'
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
    })
}

</script>
