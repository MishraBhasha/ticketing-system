<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Raise New Ticket</h2>
    <div class="card rounded">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-4 mb-3">
              <!-- <div class="mb-3"> -->
                <label for="companyName" class="form-label">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  v-model="form.companyName"
                  @input="clearError('companyName')"
                  class="form-control shadow"
                  :class="{ 'is-invalid': errors.companyName }"
                />
                <div v-if="errors.companyName" class="text-danger">{{ errors.companyName }}</div>
              </div>
            <div class="col-md-4 mb-3">

              <!-- <div class="mb-3"> -->
                <label for="address" class="form-label">Address</label>
                <input
                  type="text"
                  id="address"
                  v-model="form.address"
                  @input="clearError('address')"
                  class="form-control shadow"
                  :class="{ 'is-invalid': errors.address }"
                />
                <div v-if="errors.address" class="text-danger">{{ errors.address }}</div>
              </div>
            <div class="col-md-4 mb-3">

              <!-- <div class="mb-3"> -->
                <label for="personName" class="form-label">Person Name</label>
                <input
                  type="text"
                  id="personName"
                  v-model="form.personName"
                  @input="clearError('personName')"
                  class="form-control shadow"
                  :class="{ 'is-invalid': errors.personName }"
                />
                <div v-if="errors.personName" class="text-danger">{{ errors.personName }}</div>
              </div>
            <!-- </div> -->
            <div class="col-md-4 mb-3">
              <!-- <div class="mb-3"> -->
                <label for="phoneNumber" class="form-label">Mobile Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  v-model="form.phoneNumber"
                  @input="clearError('phoneNumber')"
                  class="form-control shadow"
                  :class="{ 'is-invalid': errors.phoneNumber }"
                />
                <div v-if="errors.phoneNumber" class="text-danger">{{ errors.phoneNumber }}</div>
              </div>
            <div class="col-md-4 mb-3">

              <!-- <div class="mb-3"> -->
                <label for="emailId" class="form-label">Email Id</label>
                <input
                  type="email"
                  id="emailId"
                  v-model="form.emailId"
                  @input="clearError('emailId')"
                  class="form-control shadow"
                  :class="{ 'is-invalid': errors.emailId }"
                />
                <div v-if="errors.emailId" class="text-danger">{{ errors.emailId }}</div>
              </div>
            <div class="col-md-4 mb-3">

              <!-- <div class="mb-3"> -->
                <label for="expectedDeliveryDate" class="form-label">Expected Delivery Date</label>
                <input
                  type="date"
                  id="expectedDeliveryDate"
                  v-model="form.expectedDeliveryDate"
                  @input="clearError('expectedDeliveryDate')"
                  class="form-control shadow"
                  :class="{ 'is-invalid': errors.expectedDeliveryDate }"
                />
                <div v-if="errors.expectedDeliveryDate" class="text-danger">{{ errors.expectedDeliveryDate }}</div>
              </div>
            <!-- </div> -->
            <div class="col-md-4 mb-3">
              <!-- <div class="mb-3"> -->
                <label for="ticketType" class="form-label">Ticket Type</label>
                <select
                  id="ticketType"
                  v-model="form.ticketId"
                  @change="clearError('ticketId')"
                  class="form-select shadow"
                  :class="{ 'is-invalid': errors.ticketId }"
                >
                  <option value="" disabled>Select Ticket Type</option>
                  <option value="1">Bug</option>
                </select>
                <div v-if="errors.ticketId" class="text-danger">{{ errors.ticketId }}</div>
              </div>
            <div class="col-md-4 mb-3">

              <!-- <div class="mb-3"> -->
                <label for="priority" class="form-label">Priority</label>
                <select
                  id="priorityId"
                  v-model="form.priorityId"
                  @change="clearError('priorityId')"
                  class="form-select shadow"
                  :class="{ 'is-invalid': errors.priorityId }"
                >
                  <option value="" disabled>Select Priority</option>
                  <option value="1">Low</option>
                  <option value="2">Medium</option>
                  <option value="3">High</option>
                </select>
                <div v-if="errors.priorityId" class="text-danger">{{ errors.priorityId }}</div>
              </div>
            <div class="col-md-4 mb-3">

              <!-- <div class="mb-3"> -->
                <label for="fileUpload" class="form-label">Upload File</label>
                <input type="file" id="fileUpload" @change="handleFileUpload" class="form-control shadow" />
              </div>
            <!-- </div> -->
            <div class="col-md-12">
              <div class="mb-3">
                <label for="commentBox" class="form-label">Comment Box</label>
                <textarea
                  id="commentBox"
                  v-model="form.commentBox"
                  class="form-control shadow"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button class="btn btn-danger me-md-2" type="button" @click="resetForm">Cancel</button>
              <button class="btn btn-success" type="submit" :disabled="isSaving">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </layout-div>
</template>

<script>
import LayoutDiv from '../LayoutDiv.vue';
import axios from 'axios';
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
        phoneNumber: '',
        emailId: '',
        expectedDeliveryDate: '',
        ticketId: '',
        priorityId: '',
        commentBox: '',
        userName: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
        
      },
      // userDetails:localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')):'',
      errors: {},
      isSaving: false,
      submitted: false // Added flag

    };
  },
  created() {
    this.loadFormData();
  },
  methods: {
    loadFormData() {
      const userDetails = sessionStorage.getItem('userDetails') ? JSON.parse(sessionStorage.getItem('userDetails')) : {};
      // const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
console.log(userDetails)
      this.form = {
        companyName: userDetails.data.companyName || '',
        address: userDetails.data.address || '',
        personName: userDetails.data.firstName || '',
        phoneNumber: userDetails.data.phoneNumber || '',
        emailId: userDetails.data.emailId || '',
        // expectedDeliveryDate: userDetails.expectedDeliveryDate || ''
        // ticketId: userDetails.ticketId || '',
         priorityId: userDetails.data.priorityId || '',
        // commentBox: userDetails.commentBox || '',
        // userName: userName || ''
      };
    },
    handleSubmit() {
      alert( this.da)
      this.submitted = true; // Set flag to true when form is submitted
      this.errors = {}; // Clear previous errors

      // Simple validation
      if (!this.form.companyName) {
        this.errors.companyName = 'Company Name is required';
      }
      if (!this.form.address) {
        this.errors.address = 'Address is required';
      }
      if (!this.form.personName) {
        this.errors.personName = 'Person Name is required';
      }
      if (!this.form.phoneNumber) {
        this.errors.phoneNumber = 'Mobile Number is required';
      } else if (!/^\d{10}$/.test(this.form.phoneNumber)) {
        this.errors.phoneNumber = 'Mobile Number must be exactly 10 digits';
      }
       if (!this.form.emailId) {
        this.errors.emailId = 'Email Id is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.emailId)) {
        this.errors.emailId = 'Email Id must be a valid email address';
      }
      if (!this.form.expectedDeliveryDate) {
        this.errors.expectedDeliveryDate = 'Expected Delivery Date is required';
      }
      if (!this.form.ticketId) {
        this.errors.ticketId = 'Ticket Type is required';
      }
      if (!this.form.priorityId) {
        this.errors.priorityId = 'Priority is required';
      }

      // Proceed if there are no errors
      if (Object.keys(this.errors).length === 0) {
        this.isSaving = true;

        // const formData = new FormData();
        // formData.append('requestFormDTO', JSON.stringify(this.form));
        // if (this.form.file) {
        //   formData.append('file', this.form.file);
        // }
        const { file, ...formWithoutFile } = this.form; // Exclude file from form data

      const formData = new FormData();
      formData.append('requestFormDTO', JSON.stringify(formWithoutFile)); // Append the form data excluding the file
      if (file) {
        formData.append('file', file); // Append the file separately
      }

        axios.post('/api/requestFormSave', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Ticket raised successfully!',
            showConfirmButton: true,
            timer: 1500,
          }).then(() => {
            this.$router.push('/user/list');
          });
          this.isSaving = false;
          this.resetForm();
        })
        .catch(() => {
          this.isSaving = false;
          Swal.fire({
            icon: 'error',
            title: 'An Error Occurred!',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    },
    clearError(field) {
      this.errors[field] = '';
    },
    resetForm() {
      this.form = {
        companyName: '',
        address: '',
        personName: '',
        phoneNumber: '',
        emailId: '',
        expectedDeliveryDate: '',
        ticketId: '',
        priorityId: '',
        file: null,
        commentBox: ''
      };
      this.errors = {};
      this.submitted = false; // Reset flag
    },
    handleFileUpload(event) {
      this.form.file = event.target.files[0];
    }
  }
};
</script>
