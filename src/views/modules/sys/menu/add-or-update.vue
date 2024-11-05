<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="!dataForm.id ? '新增' : '修改'"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter="onSubmit()"
    >


      <el-form-item
        label="类型"
        prop="type"
      >
        <el-radio-group v-model="dataForm.type">
          <el-radio
            v-for="(type, index) in dataForm.typeList"
            :key="index"
            :label="index"
          >
            {{ type }}
          </el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item
        :label="dataForm.typeList[dataForm.type] + '名称'"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          :placeholder="dataForm.typeList[dataForm.type] + '名称'"
        />
      </el-form-item>


      <el-form-item label="上级菜单">
        <el-cascader
          v-model="selectedMenu"
          :clearable="true"
          :options="menuList"
          :props="menuListTreeProps"
          change-on-select
          expand-trigger="hover"
          @change="handleSelectMenuChange"
        />
      </el-form-item>


      <el-form-item
        v-if="dataForm.type === 1"
        label="菜单路由"
        prop="url"
      >
        <el-input
          v-model="dataForm.url"
          placeholder="菜单路由"
        />
      </el-form-item>


      <el-form-item
        v-if="dataForm.type !== 2"
        label="排序号"
        prop="orderNum"
      >
        <el-input-number
          v-model="dataForm.orderNum"
          :min="0"
          controls-position="right"
          label="排序号"
        />
      </el-form-item>

    </el-form>


    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          确定
        </el-button>
      </span>
    </template>

  </el-dialog>
</template>


<script setup>
import {treeDataTranslate} from '@/utils'
import {ElMessage} from 'element-plus'


const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const menuList = ref([])
const selectedMenu = ref([])
const dataRule = ref({
  name: [
    {
      required: true,
      message: '菜单名称不能为空',
      trigger: 'blur'
    },
  ]
})

/**
 * 树形结构配置
 */
const menuListTreeProps = {
  value: 'menuId',
  label: 'name',
  checkStrictly: true
}

/**
 * 表单数据
 */
const dataForm = reactive({
  id: 0,
  type: 1,
  typeList: ['目录', '菜单', '按钮'],
  name: '',
  parentId: 0,
  url: '',
  orderNum: 0
})
const dataFormRef = ref(null)


/**
 * 选择菜单表单的变化响应: 获取表单树
 * @param val
 */
const handleSelectMenuChange = (val) => {
  dataForm.parentId = val[val.length - 1]   //bug here
}

/**
 * 初始化
 * @param id
 */
const init = (id) => {
  dataForm.id = id || 0 //获取对象id
  // 获取树形结构
  http({
    url: http.adornUrl('/admin/eemfront/table/nobutton'),
    method: 'get',
    params: http.adornParams()
  })
    .then(({data}) => {
      menuList.value = treeDataTranslate(data, 'menuId')
    })
    .then(() => {
      visible.value = true // 显示弹窗
      nextTick(() => {
        dataFormRef.value?.resetFields() // 重置表单
      })
    })
    .then(() => {
      if (dataForm.id) { // 修改
        http({ // 获取当前对象数据
          url: http.adornUrl(`/admin/eemfront/table/info/${dataForm.id}`),
          method: 'get',
          params: http.adornParams()
        }).then((response) => {
          const data = response.data.data
          dataForm.id = data.menuId
          dataForm.type = data.type
          dataForm.name = data.name
          dataForm.parentId = data.parentId
          dataForm.url = data.url
          dataForm.orderNum = data.orderNum
          selectedMenu.value = idList(menuList.value, dataForm.parentId, "menuId").reverse() //bug here
        })
      } else {
        selectedMenu.value = [] // 新增
      }
    })
}
defineExpose({init})


/**
 * 表单提交 (未实现, 直接后端去改就行)
 */
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/admin/eemfront/table/one'),
        method: dataForm.id ? 'put' : 'post',
        data: http.adornData({
          menuId: undefined,
          type: dataForm.type,
          name: dataForm.name,
          parentId: dataForm.parentId,
          url: dataForm.url,
          orderNum: dataForm.orderNum,
        })
      })
        .then(() => {
          ElMessage({
            message: '该功能暂未实现',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              emit('refreshDataList')
            }
          })
        }).catch(() => {
        ElMessage({
          message: '操作失败',
          type: 'error',
          duration: 1500
        })
      })
    }
  })
})


</script>
