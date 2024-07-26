<template>
  <div>
    <AppHeader />
    <AppSidebar />
    <div class="main-content">
      <slot></slot>
      <router-view></router-view>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './pages/AppHeader.vue';
import AppSidebar from './pages/AppSidebar.vue';
import AppFooter from './pages/AppFooter.vue';

export default {
  name: 'MainLayout',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
  },
};
</script>

<style scoped>
.main-content {
  margin-left: 250px;
  /* Adjust this value based on the width of your sidebar */
  padding: 1rem;
}
</style>
