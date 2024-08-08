<template>
  <layout-div>
    <div class="container">
      <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Ticket Type</h2>
      <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
          <input type="text" class="form-control" placeholder="Search...." />
        </div>
        <div class="col-md-4">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Create Ticket Type
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Create Ticket Type</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveTicket">
                <div class="row">
                  <div class="form-group">
                    <label for="field1" class="form-label">Ticket Type</label>
                    <input type="text" class="form-control" id="field1" v-model="ticketName" />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary">Save</button>
                </div>
              </form>
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
                <th>Ticket Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ticket, i) in paginatedTickets" :key="ticket.id">
                <td>{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                <td>{{ ticket.ticketName }}</td>
                <td>
                  <a data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i class="bi bi-pencil-fill text-primary mx-2"></i>
                  </a>
                  <i class="bi bi-trash3-fill text-danger" @click="handleDelete(ticket.id)"></i>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination Controls -->
          <div class="d-flex justify-content-end mt-4" v-if="paginatedTickets.length > 0">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item" :class="{ active: page === currentPage }" v-for="page in totalPages" :key="page">
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </div>
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
  name: 'TicketList',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      tickets: [],
      ticketName: '',
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    paginatedTickets() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tickets.slice(start, end);
    },
  },
  created() {
    this.getAllTicketType();
  },
  methods: {
    getAllTicketType() {
      axios.get('api/getAllTicketType')
        .then(response => {
          this.tickets = response.data.data;
          this.totalItems = response.data.data.length;
        })
        .catch(error => {
          console.error(error);
        });
    },
    saveTicket() {
      const payload = { ticketName: this.ticketName };
      axios.post('/api/saveTicketType', payload)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Saved',
            text: 'The ticket type was saved successfully',
          }).then(() => {
            this.getAllTicketType();
            const modalElement = document.getElementById('exampleModal');
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance.hide();
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'There was a problem saving the ticket type',
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
      axios.delete(`/api/deleteTicketType/${id}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'The ticket type was deleted successfully',
          });
          this.getAllTicketType();
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'There was a problem deleting the ticket type',
          });
        });
    }
  });
  
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
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
