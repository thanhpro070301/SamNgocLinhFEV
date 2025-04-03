<template>
  <aside class="sidebar w-full md:w-80">
    <ConsultationForm />
    <ServicesList />
    <HotlineInfo />
    <NewsList />
  </aside>
</template>

<script setup>
import ConsultationForm from './ConsultationForm.vue'
import ServicesList from './ServicesList.vue'
import HotlineInfo from './HotlineInfo.vue'
import NewsList from './NewsList.vue'
</script> 