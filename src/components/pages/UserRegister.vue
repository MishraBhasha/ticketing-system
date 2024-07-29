<template>
  <layout-div>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-9 border rounded shadow p-4" :style="{ backgroundColor: '#e8e8b3' }">
          <form action="">
            <h3 class="text-center m-5">User Registration Form</h3>
            <div class="row m-2">

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
                <div class="input-field">
                  <label htmlFor="emailId">EmailId</label>
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
                    <input v-model="project.password" :type="passwordFieldType" class="form-control" id="password"
                      placeholder="Password" name="password" />
                    <span class="input-group-text">
                      <i :class="['bi', passwordFieldType === 'password' ? 'bi-eye-slash' : 'bi-eye', 'toggle-password']"
                        @click="togglePasswordVisibility('password')"></i>
                    </span>
                  </div>

                </div>

                <div class="input-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div class="input-group">
                    <input v-model="project.confirmPassword" :type="confirmPasswordFieldType" class="form-control"
                      id="confirmPassword" placeholder="confirmPassword" name="confirmPassword" />
                    <span class="input-group-text">
                      <i :class="['bi', confirmPasswordFieldType === 'password' ? 'bi-eye-slash' : 'bi-eye', 'toggle-password']"
                        @click="togglePasswordVisibility('confirmPassword')"></i>
                    </span>
                  </div>
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
      isSaving: false,
      passwordFieldType: 'password',
      confirmPasswordFieldType: 'password',
    };
  },
  methods: {
    togglePasswordVisibility(field) {
      if (field === 'password') {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
      } else if (field === 'confirmPassword') {
        this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
      }
    },
    // togglePasswordVisibility() {
    //   this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    // },
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
  },
}
</script>
