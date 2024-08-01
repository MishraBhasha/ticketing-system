<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Employee List</h2>
      <div class="card">
        
        <div class="card-body">
          <ul class="nav nav-underline">
            <li class="nav-item" v-for="tab in tabs" :key="tab.name">
              <a class="nav-link" :class="{ active: activeTab === tab.name }" @click="setActiveTab(tab.name)" href="#">
                {{ tab.label }}
              </a>
            </li>
          </ul>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Company Name</th>
                <th>Phone Number</th>
                <th>Email Id</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(employee, index) in employees" :key="employee.id">
                <td>{{ index + 1 }}</td>
                <td>{{ employee.firstName }}</td>
                <td>{{ employee.lastName }}</td>
                <td>{{ employee.companyName }}</td>
                <td>{{ employee.phoneNumber }}</td>
                <td>{{ employee.emailId }}</td>
                <td>{{ employee.address }}</td>
                <td>
                  <router-link :to="`/employee/edit/${employee.id}`" class="btn btn-outline-info mx-1">Edit</router-link>
                  <i class="bi bi-trash3-fill text-danger" @click="handleDelete(employee.id)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2';

export default {
  name: 'EmployeeList',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      employees: [],
      activeTab: 'ALL',
      tabs: [
        { name: 'ALL', label: 'ALL' },
        // Add other tabs if needed
      ],
    };
  },
  created() {
    this.fetchEmployeeList();
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
      // Filter employees based on activeTab if needed
    },
    fetchEmployeeList() {
      axios.get('/api/getEmployeelist')
        .then(response => {
          this.employees = response.data.data;
          console.log(this.employees);
        })
        .catch(error => {
          console.error('Error fetching employees:', error);
        });
    },
    handleDelete(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/api/deleteEmployee/${id}`)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Employee deleted successfully!',
                showConfirmButton: false,
                timer: 1500
              });
              this.fetchEmployeeList();
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'An Error Occurred!',
                showConfirmButton: false,
                timer: 1500
              });
              console.error('Error deleting employee:', error);
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.nav-link.active {
  font-weight: bolder;
  color: #060389;
}

th {
  color: rgb(255, 255, 255);
  background-color: #060389;
}

.text-danger {
  cursor: pointer;
}

.table-bordered {
  border: 1px solid #dee2e6;
}
</style>
