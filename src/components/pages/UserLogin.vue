<template>
    <layout-div>
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-4 border rounded shadow" :style="{ backgroundColor: '#e8e8b3' }">
                    <form @submit.prevent="userLogin">
                        <h2 class="text-center m-5">Login</h2>
                        <div class="d-grid gap-2 col-9 mx-auto m-5">
                            <div class="input-group">
                                <input v-model="project.userName" type="text" class="form-control shadow" id="userName"
                                    placeholder="Email Id" name="userName" @blur="handleBlur('userName')"
                                    @input="handleInput('userName')" />
                            </div>
                            <div v-if="touched.userName && !v$.project.userName.$pending && v$.project.userName.$error"
                                class="text-danger">
                                Email Id is required.
                            </div>
                        </div>
                        <div class="d-grid gap-2 col-9 mx-auto m-5">
                            <div class="input-group">
                                <input v-model="project.password" :type="passwordFieldType" class="form-control shadow"
                                    id="password" placeholder="Password" name="password" @blur="handleBlur('password')"
                                    @input="handleInput('password')" />
                                <span class="input-group-text">
                                    <i :class="['bi', passwordFieldType === 'password' ? 'bi-eye-slash' : 'bi-eye', 'toggle-password']"
                                        @click="togglePasswordVisibility"></i>
                                </span>
                            </div>
                            <div v-if="touched.password && !v$.project.password.$pending && v$.project.password.$error"
                                class="text-danger">
                                Password is required.
                            </div>
                        </div>

                        <div class="d-grid gap-2 col-6 mx-auto mb-5">
                            <div class="mt-3 text-center">
                                <button type="submit" class="btn btn-primary" @click="userLogin()"
                                    :disabled="v$.$invalid">
                                    Login
                                </button>
                            </div>
                            <div class="text-center">
                                <router-link to="/register">
                                    <button class="btn btn-link">Sign Up</button>
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
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { reactive } from 'vue';
import { mapActions } from 'vuex';
export default {
    name: 'UserLogin',
    components: {
        LayoutDiv,
    },
    setup() {
        const project = reactive({
            userName: '',
            password: '',
        });

        const touched = reactive({
            userName: false,
            password: false,
        });

        const rules = {
            project: {
                userName: { required },
                password: { required },
            },
        };

        const v$ = useVuelidate(rules, { project });

        const handleBlur = (field) => {
            touched[field] = true;
            v$.value.project[field].$touch();
        };

        const handleInput = (field) => {
            touched[field] = false;
            v$.value.project[field].$reset();
        };

        return {
            project,
            v$,
            touched,
            handleBlur,
            handleInput,
        };
    },
    data() {
        return {
            isSaving: false,
            passwordFieldType: 'password',
        };
    },
    methods: {
        togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        ...mapActions(['login']),
        userLogin() {
            this.v$.$touch(); // Trigger validation for all fields
            if (this.v$.$invalid) {
                return;
            }
            this.isSaving = true
            axios.post('/api/login', this.project)
                .then(response => {
                    // const token = response.data.data.accessToken;
                    // console.log(token);
                    // localStorage.setItem('authToken', token);

                    Swal.fire({
                        icon: 'success',
                        title: 'Login successfully!',
                        showConfirmButton: true,
                        timer: 1500,
                    }).then(() => {
                        const authData = {

                            token: response.data.data.accessToken,
                            user: JSON.stringify(response.data.data.loginDtoResponse.userName),
                            // name: JSON.stringify(response.data.data.loginDtoResponse.firstName),
                        };
                        this.login(authData);
                        console.log(response.data.data.loginDtoResponse.role);
                        console.log(response.data.data.loginDtoResponse.userName);
                        const userName = JSON.stringify(response.data.data.loginDtoResponse.userName)
                        localStorage.setItem('user', userName);
                        const userRole = response.data.data.loginDtoResponse.role;
                        localStorage.setItem('role', userRole);
                        // Redirect based on role
                        if (userRole === 'ADMIN') {
                            this.$router.push('/user/admin/list');
                        } else if (userRole === 'Employee') {
                            this.$router.push('/user/emp/list');
                        } else if (userRole === 'user') {
                            this.$router.push('/user/list');
                        } else {
                            this.$router.push('/');
                        }
                    })
                    this.isSaving = false
                    this.project.password = ""
                    this.project.userName = ""
                    return response
                })
                .catch(error => {
                    this.isSaving = false
                    Swal.fire({
                        icon: 'error',
                        title: 'An Error Occured!',
                        showConfirmButton: true,
                        timer: 1500
                    })
                    return error
                });
        },
    },
}
</script>
