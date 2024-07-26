<template>
  <layout-div>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8 border rounded shadow p-4" :style="{ backgroundColor: '#e8e8b3' }">
          <form action="">
            <h3 class="text-center m-5">User Registration Form</h3>
            <div class="row">
              <div class="col-md-6">

                <div class="input-field">
                  <label htmlFor="firstName">First Name</label>
                  <input v-model="project.firstName" type="text" class="form-control" id="firstName" name="firstName" />
                </div>

                <div class="input-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input v-model="project.lastName" type="text" class="form-control" id="lastName" name="lastName" />
                </div>
              </div>
              <div class="col-md-6">

                <div class="input-field">
                  <label htmlFor="companyName">Company Name</label>
                  <input v-model="project.companyName" type="text" class="form-control" id="companyName"
                    name="companyName" />
                </div>
                <div class="input-field">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input v-model="project.phoneNumber" type="text" class="form-control" id="phoneNumber"
                    name="phoneNumber" />
                </div>
              </div>
              <div class="col-md-6">

                <label htmlFor="emailId">EmailId</label>
                <div class="input-field">
                  <input v-model="project.emailId" type="text" class="form-control" id="emailId" name="emailId" />
                </div>

                <div class="input-field">
                  <label htmlFor="address">Address</label>
                  <input v-model="project.address" type="text" class="form-control" id="address" name="address" />
                </div>
              </div>


              <div class="col-md-6">

                <div class="input-field">
                  <label for="password">Password</label>
                  <div class="input-group">
                    <input v-model="project.password" class="form-control" id="password" name="password"
                       />
                       <!-- :type="showPassword ? 'text' : 'password'" -->
                    <!-- <button class="btn btn-secondary" type="button" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                    </button> -->
                  </div>
                </div>
                <div class="input-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div class="input-group">
                    <input v-model="project.confirmPassword" class="form-control" id="confirmPassword"
                      name="confirmPassword"  />
<!-- :type="user.showConfirmPassword ? 'text' : 'confirmPassword'" -->
                    <!-- <button class="btn btn-secondary" type="button" @click="togglePasswordVisibility">
                      <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="d-grid gap-2 col-6 mx-auto m-5">

                <div class="text-center">
                  <button type="submit" class="btn btn-primary" @click="userRegister()" :disabled="isSaving">
                    Register
                  </button>
                </div>
                <div class="text-center">
                  <router-link to="/">
                    <button class="btn btn-link">Sign In</button>
                  </router-link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </layout-div>
</template>
<script>
import LayoutDiv from '../LayoutDiv.vue';
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
  name: 'UserRegister',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      project: {
        firstName: '',
        lastName: '',
        companyName: '',
        phoneNumber: '',
        emailId: '',
        address: '',
        password: '',
        confirmPassword: '',
        userName: ''
      },
      // user: {
        showPassword: false,
        // showConfirmPassword: false,
      // },
      isSaving: false,
    };
  },
  methods: {
    userRegister() {
      this.project.userName = this.project.emailId;
      this.isSaving = true
      axios.post('/api/saveUserDetails', this.project)
        .then(response => {
          Swal.fire({
            icon: 'success',
            title: 'Register successfully!',
            showConfirmButton: true,
            timer: 1500
          })
          this.isSaving = false
          this.project.firstName = ""
          this.project.lastName = ""
          this.project.companyName = ""
          this.project.address = ""
          this.project.phoneNumber = ""
          this.project.password = ""
          this.project.confirmPassword
          return response
        })
        .catch(error => {
          this.isSaving = false
          Swal.fire({
            icon: 'error',
            title: 'An Error Occured!',
            showConfirmButton: true,
            timer: 1500
          }).then(() => {
            this.$router.push('/');
          })
          return error
        });
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    // passwordVisibility() {
    //   this.showConfirmPassword = !this.showConfirmPassword;
    // }
  },
}
</script>
