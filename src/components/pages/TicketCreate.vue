<template>
    <layout-div>
        <h2 class="text-center mt-5 mb-3">Create New Ticket</h2>
        <div class="card shadow">
            <!-- <div class="card-header">
                <router-link class="btn btn-outline-info float-right" to="/">
                    View All Tickets
                </router-link>
            </div> -->

            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="companyName" class="form-label">Company Name</label>
                                <input type="text" id="companyName" v-model="form.companyName" class="form-control shadow"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label for="address" class="form-label">Address</label>
                                <input type="text" id="address" v-model="form.address" class="form-control shadow" required>
                            </div>
                            <div class="mb-3">
                                <label for="personName" class="form-label">Person Name</label>
                                <input type="text" id="personName" v-model="form.personName" class="form-control shadow"
                                    required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="mobileNumber" class="form-label">Mobile Number</label>
                                <input type="tel" id="mobileNumber" v-model="form.mobileNumber" class="form-control shadow"
                                    required>
                            </div>

                            <div class="mb-3">
                                <label for="emailId" class="form-label">Email Id</label>
                                <input type="email" id="emailId" v-model="form.emailId" class="form-control shadow" required>
                            </div>
                        
                            <div class="mb-3">
                                <label for="expectedDeliveryDate" class="form-label">Expected Delivery Date</label>
                                <input type="date" id="expectedDeliveryDate" v-model="form.expectedDeliveryDate"
                                    class="form-control shadow" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="ticketType" class="form-label">Ticket Type</label>
                                <select id="ticketType" v-model="form.ticketType" class="form-select shadow" required>
                                    <option value="" disabled>Select Ticket Type</option>
                                    <option value="bug">Bug</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="priority" class="form-label">Priority</label>
                                <select id="priority" v-model="form.priority" class="form-select shadow" required>
                                    <option value="" disabled>Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="fileUpload" class="form-label">Upload File</label>
                                <input type="file" id="fileUpload" @change="handleFileUpload" class="form-control shadow" />
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="mb-3">
                                <label for="commentBox" class="form-label">Comment Box</label>
                                <textarea id="commentBox" v-model="form.commentBox" class="form-control shadow"
                                    rows="3"></textarea>
                            </div>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button class="btn btn-danger me-md-2" type="button" @click="resetForm">Cancel</button>
                            <button class="btn btn-success" type="button" :disabled="isSaving" @click="handleSubmit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </layout-div>
</template>

<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2'
export default {
    name: 'TicketCreate',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            form: {
                companyName: '',
                address: '',
                personName: '',
                mobileNumber: '',
                emailId: '',
                expectedDeliveryDate: '',
                ticketType: '',
                priority: '',
                file: null,
                commentBox: ''
            },
            isSaving: false
        };
    },
    methods: {
        handleFileUpload(event) {
            this.form.file = event.target.files[0];
        },
        handleSubmit() {
            this.isSaving = true

            const requestFormDTO = {
                companyName: this.form.companyName,
                address: this.form.address,
                userName: this.form.userName,
                commentBox: this.form.commentBox,
                personName: this.form.personName,
                emailId: this.form.emailId,
                phoneNumber: this.form.mobileNumber,
                expectedDeliveryDate: this.form.expectedDeliveryDate,
                ticketId: this.form.ticketType,
                priorityId: this.form.priority
            };

            const formData = new FormData();
            formData.append('requestFormDTO', JSON.stringify(requestFormDTO));          

            axios.post('/api/requestFormSave', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                // axios.post('/api/requestFormSave', this.form)
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Ticket raised successfully!',
                        showConfirmButton: true,
                        timer: 1500,
                    }).then(() => {
                        this.$router.push('/list');
                    })
                    this.isSaving = false
                    this.resetForm();
                    return response
                })
                .catch(error => {
                    this.isSaving = false
                    Swal.fire({
                        icon: 'error',
                        title: 'An Error Occured!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    return error
                });
        },
        resetForm() {
            this.form = {
                companyName: '',
                address: '',
                personName: '',
                mobileNumber: '',
                emailId: '',
                expectedDeliveryDate: '',
                ticketType: '',
                priority: '',
                file: null,
                commentBox: ''
            };
        }
    }
};
</script>
