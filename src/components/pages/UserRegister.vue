<template>
  <layout-div>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8 border rounded shadow p-4" :style="{ backgroundColor: '#e8e8b3' }">
          <form @submit.prevent="userRegister">
            <h3 class="text-center m-5">User Registration Form</h3>
            <div class="row">
              <div class="col-md-6">
                <div class="input-field">
                  <label for="firstName">First Name</label>
                  <input v-model="project.firstName" type="text" class="form-control" id="firstName" name="firstName" />
                  <div v-if="showErrors && !v$.project.firstName.$pending && !v$.project.firstName.$model"
                    class="text-danger">
                    First Name is required.
                  </div>
                </div>

                <div class="input-field">
                  <label for="lastName">Last Name</label>
                  <input v-model="project.lastName" type="text" class="form-control" id="lastName" name="lastName" />
                  <div v-if="showErrors && !v$.project.lastName.$pending && !v$.project.lastName.$model"
                    class="text-danger">
                    Last Name is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="input-field">
                  <label for="companyName">Company Name</label>
                  <input v-model="project.companyName" type="text" class="form-control" id="companyName"
                    name="companyName" />
                  <div v-if="showErrors && !v$.project.companyName.$pending && !v$.project.companyName.$model"
                    class="text-danger">
                    Company Name is required.
                  </div>
                </div>
                <div class="input-field">
                  <label for="phoneNumber">Phone Number</label>
                  <input v-model="project.phoneNumber" type="text" class="form-control" id="phoneNumber"
                    name="phoneNumber" />
                  <div v-if="showErrors && !v$.project.phoneNumber.$pending && !v$.project.phoneNumber.$model"
                    class="text-danger">
                    Phone Number is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="input-field">
                  <label for="emailId">EmailId</label>
                  <input v-model="project.emailId" type="text" class="form-control" id="emailId" name="emailId" />
                  <div v-if="showErrors && !v$.project.emailId.$pending && !v$.project.emailId.$model"
                    class="text-danger">
                    EmailId is required.
                  </div>
                </div>

                <div class="input-field">
                  <label for="address">Address</label>
                  <input v-model="project.address" type="text" class="form-control" id="address" name="address" />
                  <div v-if="showErrors && !v$.project.address.$pending && !v$.project.address.$model"
                    class="text-danger">
                    Address is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="input-field">
                  <label for="password">Password</label>
                  <input v-model="project.password" class="form-control" id="password" name="password" type="password"/>
                  <div v-if="showErrors && !v$.project.password.$pending && !v$.project.password.$model"
                    class="text-danger">
                    Password is required.
                  </div>
                </div>
                <div class="input-field">
                  <label for="confirmPassword">Confirm Password</label>
                  <input v-model="project.confirmPassword" class="form-control" id="confirmPassword"
                    name="confirmPassword" type="password"/>
                  <div v-if="showErrors && !v$.project.confirmPassword.$pending && !v$.project.confirmPassword.$model"
                    class="text-danger">
                    Confirm Password is required.
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2 col-6 mx-auto m-5">
                <div class="text-center">
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
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
import Swal from 'sweetalert2';
import { reactive, ref } from 'vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useRouter } from 'vue-router';

export default {
  name: 'UserRegister',
  components: {
    LayoutDiv,
  },
  setup() {
    const project = reactive({
      firstName: '',
      lastName: '',
      companyName: '',
      phoneNumber: '',
      emailId: '',
      address: '',
      password: '',
      confirmPassword: ''
    });

    const showErrors = ref(false);
    const isSaving = ref(false);
    const router = useRouter(); // Use the router instance

    const rules = {
      project: {
        firstName: { required },
        lastName: { required },
        companyName: { required },
        phoneNumber: { required },
        emailId: { required },
        address: { required },
        password: { required },
        confirmPassword: { required }
      }
    };

    const v$ = useVuelidate(rules, { project });

    const userRegister = async () => {
      showErrors.value = true;
      v$.value.$touch();
      if (v$.value.$invalid) {
        console.log('Validation failed:', v$.value);
        return;
      }
      project.userName = project.emailId;
      isSaving.value = true;
      try {
        const response = await axios.post('/api/saveUserDetails', project); // Use project directly
        Swal.fire({
          icon: 'success',
          title: 'Register successfully!',
          showConfirmButton: true,
          timer: 1500
        });
        // Reset form
        Object.keys(project).forEach(key => {
          project[key] = '';
        });
        isSaving.value = false;
        router.push('/'); // Use router for redirection
        console.log('Registration response:', response);
      } catch (error) {
        isSaving.value = false;
        Swal.fire({
          icon: 'error',
          title: 'An Error Occurred!',
          showConfirmButton: true,
          timer: 1500
        }).then(() => {
          router.push('/'); // Use router for redirection
        });
        console.log('Registration error:', error);
      }
    };

    return {
      project,
      v$,
      showErrors,
      userRegister,
      isSaving
    };
  }
};
</script>
