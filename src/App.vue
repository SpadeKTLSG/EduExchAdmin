<template>
  <el-config-provider
    namespace="el"
  >
    <router-view/>
  </el-config-provider>
</template>

<style lang="scss">
.card-prod-info-btn {
  font-size: 14px;

  .prod-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0 8px;
  }

  .del-btn {
    line-height: 20px;
    text-align: right;
    padding-right: 8px;
    user-select: none;

    span {
      color: #155bd4;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }

      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

</style>
