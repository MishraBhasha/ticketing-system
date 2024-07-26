<template>
    <layout-div>
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-4 border rounded shadow" :style="{ backgroundColor: '#e8e8b3' }">
                    <form>
                        <h2 class="text-center m-5">Login</h2>
                        <div class="d-grid gap-2 col-9 mx-auto m-5">
                            <div class="input-field">
                                <input v-model="project.userName" type="text" class="form-control shadow" id="userName"
                                    placeholder="Email Id" name="userName" />
                            </div>
                        </div>
                        <div class="d-grid gap-2 col-9 mx-auto m-5">
                            <div class="input-field">
                                <input v-model="project.password" type="text" class="form-control shadow" id="password"
                                    placeholder="Password" name="password" />
                            </div>
                        </div>

                        <div class="d-grid gap-2 col-6 mx-auto mb-5">
                            <div class="mt-3 text-center">
                                <button type="submit" class="btn btn-primary" @click="userLogin()" :disabled="isSaving">
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

export default {
    name: 'UserLogin',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            project: {
                password: '',
                userName: ''
            },
            isSaving: false,
        };
    },
    methods: {
        userLogin() {
            this.isSaving = true
            axios.post('/api/login', this.project)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login successfully!',
                        showConfirmButton: true,
                        timer: 1500,
                    }).then(() => {
                        this.$router.push('user/list');
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