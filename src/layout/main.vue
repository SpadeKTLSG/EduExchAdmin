<template>
  <div
    v-loading.fullscreen.lock="loading"
    :class="{ 'site-sidebar--fold': commonStore.sidebarFold }"
    :element-loading-text="'拼命加载中'"
    class="site-wrapper"
  >
    <template v-if="!loading">
      <MainNavbar/>
      <MainSidebar/>
      <div
        :style="{ 'min-height': commonStore.documentClientHeight + 'px' }"
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
import {useCommonStore} from "@/layout/common.js";

const commonStore = useCommonStore()
let loading = ref(true)

onBeforeMount(() => {
  // 不需要获取用户信息, 后端存TL做
  loading = false
})

onMounted(() => {
  resetDocumentClientHeight()
})

const resetDocumentClientHeight = () => {
  commonStore.documentClientHeight = document.documentElement.clientHeight
  window.onresize = () => {
    commonStore.documentClientHeight = document.documentElement.clientHeight
  }
}


</script>
