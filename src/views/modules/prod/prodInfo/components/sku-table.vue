<template>
  <div class="mod-prod-sku-table">
    <el-form-item>
      <el-table
          :data="modelValue"
          border
          style="width: 100%; margin-top: 20px"
      >
        <el-table-column
            v-for="(leftTitle, index) in tableLeftTitles"
            :key="index"
            :label="leftTitle"
        >
          <template #default="scope">
            {{ scope.row.properties.split(';')[index].split(':')[1] }}
          </template>
        </el-table-column>
        <el-table-column
            v-if="tableLeftTitles.length"
            label="sku图片"
            prop="pic"
            width="180"
        >
          <template #default="scope">
            <pic-upload v-model="scope.row.pic"/>
          </template>
        </el-table-column>
        <el-table-column
            v-if="tableLeftTitles.length"
            label="商品名称"
            prop="prodName"
            width="250"
        >
          <template #default="scope">
            <el-input
                v-model="scope.row.prodName"
                :disabled="!scope.row.status"
                type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="销售价"
            prop="price"
            width="160"
        >
          <template #default="scope">
            <el-input-number
                v-model="scope.row.price"
                :disabled="!scope.row.status"
                :max="1000000000"
                :min="0.01"
                :precision="2"
                controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="市场价"
            prop="oriPrice"
            width="160"
        >
          <template #default="scope">
            <el-input-number
                v-model="scope.row.oriPrice"
                :disabled="!scope.row.status"
                :max="1000000000"
                :min="0.01"
                :precision="2"
                controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="库存"
            prop="stocks"
            width="160"
        >
          <template #default="scope">
            <el-input-number
                v-model="scope.row.stocks"
                :disabled="!scope.row.status"
                :min="0"
                controls-position="right"
                type="number"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="商品重量(kg)"
            prop="weight"
            width="210"
        >
          <template #default="scope">
            <el-input-number
                v-model="scope.row.weight"
                :disabled="!scope.row.status"
                :min="0"
                :precision="2"
                controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="商品体积(m³)"
            prop="volume"
            width="210"
        >
          <template #default="scope">
            <el-input-number
                v-model="scope.row.volume"
                :disabled="!scope.row.status"
                :min="0"
                :precision="2"
                controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
        >
          <template #default="scope">
            <el-button
                v-if="scope.row.status"
                type="text"
                @click="changeSkuStatus(`${scope.$index}`)"
            >
              禁用
            </el-button>
            <el-button
                v-else
                type="text"
                @click="changeSkuStatus(`${scope.$index}`)"
            >
              启用
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script setup>
import {scoreProdStore} from '@/stores/prod.js'

const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array
  },
  prodName: {
    default: '',
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const dbSpecs = ref([]) // 数据库中的规格
let initing = false

const tableLeftTitles = computed(() => {
  const res = []
  for (let i = 0; i < skuTags.value.length; i++) {
    const skuTag = skuTags.value[i]
    res.push(skuTag.tagName)
  }
  return res
})
const prod = scoreProdStore()
const skuTags = computed({
  get () {
    return prod.skuTags
  }
})

watch(() => props.prodName,
    () => {
      skuAddProdName()
    })

onMounted(() => {
  http({
    url: http.adornUrl('/prod/spec/list'),
    method: 'get',
    params: http.adornParams()
  })
      .then(({ data }) => {
        dbSpecs.value = data
      })
})

const init = () => {
  initing = true
}
defineExpose({ init })

const changeSkuStatus = (tagIndex) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.modelValue[tagIndex].status = props.modelValue[tagIndex].status ? 0 : 1
}
const skuAddProdName = () => {
  if (initing) return
  const skuList = []
  for (let i = 0; i < props.modelValue.length; i++) {
    const sku = Object.assign({}, props.modelValue[i])
    if (!sku.properties) {
      return
    }
    sku.skuName = ''
    const properties = sku.properties.split(';')
    for (const propertiesKey in properties) {
      sku.skuName += properties[propertiesKey].split(':')[1] + ' '
    }
    sku.prodName = props.prodName + ' ' + sku.skuName
    skuList.push(sku)
  }
  emit('update:modelValue', skuList)
}

</script>

<style lang="scss" scoped>
.mod-prod-sku-table {
  :deep(.pic-uploader-component .el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }

    .pic {
      width: 120px;
      height: 120px;
      display: block;
    }
  }

  :deep(.pic-uploader-component .el-upload:hover) {
    border-color: #409EFF;
  }
}
</style>
