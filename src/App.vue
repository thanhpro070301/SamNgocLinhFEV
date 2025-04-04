<template>
  <div class="app">
    <template v-if="!isAdminRoute">
      <TheHeader />
      <main class="main-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </main>
      <TheFooter />
    </template>
    <template v-else>
      <div class="admin-layout">
        <router-view></router-view>
      </div>
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
@use "@/assets/styles/variables" as *;

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.admin-layout {
  min-height: 100vh;
}
</style> 