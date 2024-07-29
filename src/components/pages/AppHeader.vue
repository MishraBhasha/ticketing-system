<template>
  <header class="fixed-top header">
    <div class="navbar-menu-wrapper d-flex align-items-top m-2">
      <ul class="navbar-nav">
        <li class="nav-item fw-semibold d-none d-lg-block">
          <!-- <h1 class="welcome-text"> -->
            <span class="text-white fw-bold">
              <img :src="logoSrc" alt="Logo" />
            </span>&nbsp;&nbsp;
          <!-- </h1> -->
          <i class="bi bi-blockquote-right fs-3" @click="$emit('toggle-sidebar')"></i>
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
import logo from '@/assets/G-Logo.png'; // Import the logo

export default {
  name: 'AppHeader',
  data() {
    return {
      logoSrc: logo
    };
  }
};
</script>

<style scoped>
.header {
  background-color: #c5b3e6;
}
</style>
