<template>
  <header class="fixed-top header">
    <div class="navbar-menu-wrapper d-flex align-items-top">
      <ul class="navbar-nav">
        <li class="nav-item fw-semibold d-none d-lg-block">
          <h1 class="welcome-text"><span class="text-white fw-bold">TS</span></h1>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <button class="btn text-white">
            <h5>Logout <i class="bi bi-sign-turn-slight-right"> </i></h5>
          </button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style scoped>
.header {
  background-color: #c5b3e6;
}
</style>