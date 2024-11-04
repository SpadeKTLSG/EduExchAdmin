<template>
  <div
    v-loading.fullscreen.lock="loading"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    :element-loading-text="'拼命加载中'"
    class="site-wrapper"
  >
    <template v-if="!loading">
      <MainNavbar/>
      <MainSidebar/>
      <div
        :style="{ 'min-height': documentClientHeight + 'px' }"
        class="site-content__wrapper"
      >
        <main-content/>
      </div>
    </template>
  </div>
</template>

<script setup>
import MainNavbar from './main-navbar.vue'
import MainSidebar from './main-sidebar.vue'
import MainContent from './main-content.vue'
import {useUserStore} from "@/layout/user.js";
import {useCommonStore} from "@/layout/common.js";

onBeforeMount(() => {
  getUserInfo()
})

const commonStore = useCommonStore()
const documentClientHeight = computed(() => commonStore.documentClientHeight)
const userStore = useUserStore()
const sidebarFold = computed(() => commonStore.sidebarFold)

onMounted(() => {
  resetDocumentClientHeight()
})

const resetDocumentClientHeight = () => {
  commonStore.documentClientHeight = document.documentElement.clientHeight
  window.onresize = () => {
    commonStore.documentClientHeight = document.documentElement.clientHeight
  }
}

const loading = ref(true)

/**
 * 获取用户信息 -> TL
 */
const getUserInfo = () => {
  http({
    url: http.adornUrl('/sys/user/info'),
    method: 'get',
    params: http.adornParams()
  }).then(({data}) => {
    loading.value = false
    userStore.userId = data.userId
    userStore.name = data.username
    userStore.mobile = data.mobile
    userStore.shopId = data.shopId
    userStore.userId = data.userId
  }).catch(() => {
  })
}

</script>
