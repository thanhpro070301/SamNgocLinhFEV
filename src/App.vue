<template>
  <div class="app">
    <template v-if="!isAdminRoute">
      <TheHeader />
      <main class="main-content">
        <router-view></router-view>
      </main>
      <TheFooter />
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<style lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}
</style> 