<template>
  <div>
    <nav class="site-navbar">

      <!--左侧-->
      <div
        :style="{ 'margin-right': sidebarFold ? 0 : '20px' }"
        class="site-navbar-header"
      >
        <span
          v-if="!sidebarFold"
          class="site-navbar-lg"
        >
          EduExch管理员端
        </span>
        <span
          v-else
          :style="fontCloseSize"
          class="site-navbar-mini"
        >
          EduExch
        </span>
      </div>

      <!--右侧-->
      <div class="site-navbar-content">
        <div class="navbar-content-left">
          <svg-icon
            class="left-item"
            icon-class="icon-zhedie"

          />
        </div>

        <div class="navbar-content-right">
          <el-dropdown
            :show-timeout="0"
            class="content-right-item"
            placement="bottom"
          >
            <span class="el-dropdown-link">管理员</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logoutHandle">
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

    </nav>
  </div>
</template>

<script setup>
import {ElMessageBox} from 'element-plus'
import {useCommonStore} from "@/layout/common.js";

const router = useRouter()
const fontCloseSize = reactive({fontSize: '16px'})
const commonStore = useCommonStore()
const sidebarFold = computed(() => commonStore.sidebarFold)


/**
 * 退出登录
 */
const logoutHandle = () => {
  ElMessageBox.confirm('确定不搞啦?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http({
      url: http.adornUrl('/logOut'),
      method: 'post',
      data: http.adornData()
    }).then(() => {
      clearLoginInfo()
      router.push({name: 'login'})
    })
  })
}

</script>

<style lang="scss" scoped>
.site-navbar {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  color: #333333;
  border-bottom: 1px solid #ebedf0;

  .site-navbar-header {
    display: flex;
    align-items: center;
    margin-left: 20px;
    color: #333;
    font-weight: 700;
    height: 50px;
    line-height: 50px;

    .site-navbar-lg {
      font-size: 16px;
      word-break: break-all;
      word-wrap: break-word;
    }

    .site-navbar-lg,
    .site-navbar-mini {
      margin: 0 5px;
    }
  }

  .site-navbar-content {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 18px;
    align-items: center;

    .navbar-content-left {
      flex: 1;

      .left-item {
        cursor: pointer;
      }
    }

    .navbar-content-right {
      display: flex;
    }
  }
}

//.menu-image-logo {
//  object-fit: contain;
//  height: 18px;
//  width: 59px;
//  margin-right: 10px;
//}
</style>
