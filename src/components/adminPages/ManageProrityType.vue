<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Priority Type</h2>
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
          <input type="text" class="form-control" placeholder="Search...." />
        </div>
        <div class="col-md-4">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Create Priority Type
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Create Priority Type</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form-group">
                  <label for="field1" class="form-label">Priority Type</label>
                  <input type="text" class="form-control" id="field1" v-model="selectedPriority.priorityName" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="savePriority">Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-3">
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Priority Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(priority, i) in priorities" :key="priority.id">
                <td>{{ i + 1 }}</td>
                <td>{{ priority.priorityName }}</td>
                <td>
                  <a data-bs-toggle="modal" data-bs-target="#exampleModal" @click="openModal(priority)">
                    <i class="bi bi-pencil-fill text-primary mx-2"></i>
                  </a>
                  <i class="bi bi-trash3-fill text-danger" @click="handleDelete(priority.id)"></i>
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
import { Modal } from 'bootstrap';

export default {
  name: 'PriorityType',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      priorities: [],
      selectedPriority: {
        priorityName: '',
      },
    };
  },
  created() {
    this.getAllPriority();
  },
  methods: {
    openModal(priority) {
      this.selectedPriority = priority ? { ...priority } : { priorityName: '' };
    },
    getAllPriority() {
      axios.get('/api/getAllPriority')
        .then(response => {
          this.priorities = response.data.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    savePriority() {
      const payload = {
        priorityName: this.selectedPriority.priorityName,
      };

      axios.post('/api/savePriority', payload)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Saved',
            text: 'The priority type was saved successfully',
          }).then(() => {
            this.getAllPriority();
            const modalElement = document.getElementById('exampleModal');
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance.hide();
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'There was a problem saving the priority type',
          });
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
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/api/deletePriority/${id}`)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'The priority type was deleted successfully',
              });
              this.getAllPriority();
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'There was a problem deleting the priority type',
              });
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
</style>
