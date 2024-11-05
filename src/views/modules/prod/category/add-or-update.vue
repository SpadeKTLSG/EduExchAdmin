<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="!dataForm.currentId ? '新增' : '修改'"
  >

    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        v-if="dataForm.type !== 2"
        label="分类名称"
        prop="categoryName"
      >
        <el-input
          v-model="dataForm.categoryName"
          :min="0"
          controls-position="right"
          label="分类名称"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="排序号"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          :min="0"
          controls-position="right"
          label="排序号"
        />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            下线
          </el-radio>
          <el-radio :label="1">
            正常
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>


    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import {idList, treeDataTranslate} from '@/utils'
import {Debounce} from '@/utils/debounce'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataForm = reactive({
  categoryId: 0,
  currentId: 0,
  grade: 0,
  categoryName: '',
  seq: 1,
  status: 1,
  parentId: 0,
  pic: ''
})
const dataRule = reactive({
  categoryName: [
    {
      required: true,
      message: '分类名称不能为空',
      trigger: 'blur'
    },
    {
      pattern: /\s\S+|S+\s|\S/,
      message: '请输入正确的分类名称',
      trigger: 'blur'
    }
  ]
})

const categoryList = ref([])
const selectedCategory = ref([])
const isSubmit = ref(false)
const dataFormRef = ref(null)

const init = (id) => {
  dataForm.currentId = id || 0
  dataForm.categoryId = id || 0
  http({
    url: http.adornUrl('/prod/category/listCategory'),
    method: 'get',
    params: http.adornParams()
  })
    .then(({data}) => {
      categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
    })
    .then(() => {
      visible.value = true
      nextTick(() => {
        dataFormRef.value?.resetFields()
        selectedCategory.value = []
      })
    })
    .then(() => {
      if (dataForm.categoryId) {
        // 修改
        http({
          url: http.adornUrl(`/prod/category/info/${dataForm.categoryId}`),
          method: 'get',
          params: http.adornParams()
        })
          .then(({data}) => {
            dataForm.categoryId = data.categoryId
            dataForm.categoryName = data.categoryName
            dataForm.seq = data.seq
            dataForm.pic = data.pic
            dataForm.parentId = data.parentId
            dataForm.status = data.status
            selectedCategory.value = idList(categoryList.value, data.parentId, 'categoryId', 'children').reverse()
          })
      }
    })
}
defineExpose({init})


// 表单提交
const onSubmit = Debounce(() => {
  if (selectedCategory.value.length === 1) {
    dataForm.grade = 0
  }
  if (selectedCategory.value.length === 2) {
    dataForm.grade = 1
  }
  if (selectedCategory.value.length === 3) {
    dataForm.grade = 2
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (isSubmit.value) {
        return
      }
      isSubmit.value = true
      http({
        url: http.adornUrl('/prod/category'),
        method: dataForm.categoryId ? 'put' : 'post',
        data: http.adornData({
          categoryId: dataForm.categoryId || undefined,
          categoryName: dataForm.categoryName,
          status: dataForm.status,
          seq: dataForm.seq,
          grade: dataForm.grade,
          parentId: dataForm.parentId,
          pic: dataForm.pic
        })
      })
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              isSubmit.value = false
              visible.value = false
              emit('refreshDataList')
            }
          })
        })
    }
  })
})

</script>
