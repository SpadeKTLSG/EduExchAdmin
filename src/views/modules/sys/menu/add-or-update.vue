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
import {idList, treeDataTranslate} from '@/utils'
import {ElMessage} from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataForm = reactive({
  id: 0,
  type: 1,
  typeList: ['目录', '菜单', '按钮'],
  name: '',
  parentId: 0,
  url: '',
  perms: '',
  orderNum: 0,
  icon: '',
  iconList: []
})

const menuList = ref([])
const selectedMenu = ref([])
const menuListTreeProps = {
  value: 'menuId',
  label: 'name',
  checkStrictly: true
}

const validateUrl = (rule, value, callback) => {
  if (dataForm.type === 1 && !/\S/.test(value)) {
    callback(new Error('菜单URL不能为空'))
  } else {
    callback()
  }
}


const dataRule = ref({
  name: [
    {
      required: true,
      message: '菜单名称不能为空',
      trigger: 'blur'
    },
    {
      pattern: /\s\S+|S+\s|\S/,
      message: '请输入正确的菜单名称',
      trigger: 'blur'
    }
  ],
  url: [
    {
      validator: validateUrl,
      trigger: 'blur'
    }
  ]
})


const dataFormRef = ref(null)
const init = (id) => {
  dataForm.id = id || 0
  http({
    url: http.adornUrl('/sys/menu/list'),
    method: 'get',
    params: http.adornParams()
  })
    .then(({data}) => {
      menuList.value = treeDataTranslate(data, 'menuId')
    })
    .then(() => {
      visible.value = true
      nextTick(() => {
        dataFormRef.value?.resetFields()
      })
    })
    .then(() => {
      if (dataForm.id) {
        // 修改
        http({
          url: http.adornUrl(`/sys/menu/info/${dataForm.id}`),
          method: 'get',
          params: http.adornParams()
        }).then(({data}) => {
          dataForm.id = data.menuId
          dataForm.type = data.type
          dataForm.name = data.name
          dataForm.parentId = data.parentId
          dataForm.url = data.url
          dataForm.perms = data.perms
          dataForm.orderNum = data.orderNum
          dataForm.icon = data.icon
          selectedMenu.value = idList(menuList.value, data.parentId, 'menuId', 'children').reverse()
        })
      } else {
        selectedMenu.value = []
      }
    })
}
defineExpose({init})

const handleSelectMenuChange = (val) => {
  dataForm.parentId = val[val.length - 1]
}


/**
 * 表单提交
 */
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      http({
        url: http.adornUrl('/sys/menu'),
        method: dataForm.id ? 'put' : 'post',
        data: http.adornData({
          menuId: dataForm.id || undefined,
          type: dataForm.type,
          name: dataForm.name,
          parentId: dataForm.parentId,
          url: dataForm.url,
          perms: dataForm.perms,
          orderNum: dataForm.orderNum,
          icon: dataForm.icon
        })
      })
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              emit('refreshDataList')
            }
          })
        })
    }
  })
})
</script>
