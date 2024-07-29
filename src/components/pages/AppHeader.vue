<template>
  <header class="fixed-top header">
    <div class="navbar-menu-wrapper d-flex align-items-top m-2">
      <ul class="navbar-nav">
        <li class="nav-item fw-semibold d-none d-lg-block">
          <span class="text-white fw-bold">
            <img :src="logoSrc" alt="Logo" />
          </span>&nbsp;&nbsp;
          <i class="bi bi-blockquote-right fs-3" @click="$emit('toggle-sidebar')"></i>
        </li>
      </ul>

      <!-- <ul class="navbar-nav ms-auto">
        <li class="nav-item dropdown d-lg-block user-dropdown">
          <a class="nav-link" id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
            <a class="dropdown-item" @click="logout">
              <h5>Logout <i class="bi bi-sign-turn-slight-right"></i></h5>
            </a>
          </div>
        </li>
      </ul> -->
      <ul class="navbar-nav ms-auto">
        <li class="nav-item dropdown d-lg-block user-dropdown">
          <a class="nav-link dropdown-toggle text-white" id="UserDropdown" href="#" data-bs-toggle="dropdown"
            aria-expanded="false">
            <i class="bi bi-person-circle fs-2"></i>
          </a>
          <ul class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
            <li>
              <a class="dropdown-item text-center" @click="logout">
                <i class="bi bi-sign-turn-slight-right me-md-2"></i>Logout
              </a>
            </li>
          </ul>
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
  },
  methods: {
    logout() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.header {
  background-color: #c5b3e6;
}
</style>
