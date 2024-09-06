<template>
  <header class="fixed-top header">
    <div class="navbar-menu-wrapper d-flex align-items-top m-2">
      <ul class="navbar-nav">
        <li class="nav-item fw-semibold d-none d-lg-block">
          <div class="d-flex align-items-center">
            <i v-if="isSidebarCollapsed" class="bi bi-justify-left fs-3 me-3 text-white"
              @click="$emit('toggle-sidebar')"></i>
            <i v-else class="bi bi-justify-right fs-3 me-3 text-white" @click="$emit('toggle-sidebar')"></i>
            <img :src="logoSrc" alt="Logo" height="50" width="180" class="logo" />
          </div>
        </li>
      </ul>

      <ul class="navbar ms-auto m-1">
        <li v-if="userRole === 'SUPERADMIN'" class="nav-item dropdown d-lg-block user-dropdown me-4" @mouseover="isNotificationDropdownOpen = true"
          @mouseleave="isNotificationDropdownOpen = false">
          <!-- <div @click="toggleNotificationDropdown" class="nav-link text-white dropdown-toggle no-caret" -->
          <div class="nav-link text-white" ref="notificationTrigger">
            <i class="bi bi-bell"></i>
            <span v-if="notificationCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ notificationCount }}
            </span>
          </div>
          <div v-if="isNotificationDropdownOpen" class="dropdown-menu dropdown-menu-end" ref="notificationMenu">
            <ul class="list-unstyled">
              <li v-for="item in notifications" :key="item.id" class="dropdown-item">
                  <div class="fw-bold" :style="{ color: '#060389' }">
                    {{ item.contents }}
                  </div>
                  <div>{{ formatDate(item.notificationDate) }}</div>
              </li>
            </ul>
          </div>
        </li>

        <!-- <li class="nav-item"> -->
        <li class="nav-item dropdown d-lg-block user-dropdown" @mouseover="isDropdownOpen = true"
          @mouseleave="isDropdownOpen = false">
          <!-- <div @click="toggleDropdown" class="nav-link text-white dropdown-toggle" ref="dropdownTrigger"> -->
          <div class="nav-link text-white" ref="dropdownTrigger">
            <i class="bi bi-person-circle fs-3 me-3"></i>
          </div>

          <div v-if="isDropdownOpen" class="dropdown-menu dropdown-menu-end p-2" ref="dropdownMenu">
            <div class="text-center fw-bold" :style="{ color: '#060389' }">
              Hi, {{ user }}
              </div>
            <button class="btn btn-primary dropdown-item" @click="logout" type="button">
              <i class="bi bi-sign-turn-slight-right me-md-2"></i> Logout
            </button>
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import logo from '@/assets/Tlogo.png';
import axios from 'axios';

export default {
  name: 'AppHeader',
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logoSrc: logo,
      isDropdownOpen: false,
      isNotificationDropdownOpen: false,
      notifications: [],
      notificationCount: 0,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userRole() {
      return this.$store.getters.getRole;
    },
    // formattedEmail() {
    // //   const email = this.user.replace(/"/g, '');
    //   return this.user.split('@')[0]; // Extract the part before '@'
    // }
  },
  created() {
    if(this.userRole === "SUPERADMIN") {
      this.getAllNotification();
    }
  },
  mounted() {
    console.log('UUUU:', this.user);
    // console.log('User:', this.user.replace(/"/g, ''));
    console.log('Role User:', this.userRole);
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    toggleNotificationDropdown() {
      this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    closeDropdown() {
      this.isDropdownOpen = false;
      this.isNotificationDropdownOpen = false;
    },
    handleClickOutside(event) {
      const dropdownTrigger = this.$refs.dropdownTrigger;
      const dropdownMenu = this.$refs.dropdownMenu;

      // Check if the click was outside both the trigger and the menu
      if (dropdownTrigger && !dropdownTrigger.contains(event.target) &&
        dropdownMenu && !dropdownMenu.contains(event.target)) {
        this.closeDropdown();
      }
    },
    getAllNotification() {
      axios.get('/api/getAllNotifications')
        .then(response => {
          this.notifications = response.data;
          this.notificationCount = this.notifications.length;
          console.log(this.notificationCount)
          console.log(this.notifications)
        })
        .catch(error => {
          console.error('Error fetching companies:', error);
        });
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`; // Format date as DD-MM-YYYY
    },
  }

};
</script>

<style scoped>
.header {
  /* background-color: #c5b3e6; */
  /* background-color: #b590fa; */
  /* background-color: #8B2D6C;  */
  background: linear-gradient(90deg, #e19dd2, #7e64a8);
}

.dropdown-menu {
  display: block;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  z-index: 1000;
}

.dropdown-menu-end {
  right: 0;
}
</style>
