<template>
  <layout-div>
    <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Ticket Manager</h2>
    <div class="card">
      <div class="card-body">
        <div class="row justify-content-end">
          <div class="col-md-4 mb-3">
            <input type="text" class="form-control" placeholder="search..." v-model="searchQuery"
              @input="filterTickets">
          </div>
          <div class="col-md-4 mb-3">
            <select class="form-select" v-model="selectedCompany" @change="handleCompanyChange($event)">
              <option value="">All Companies</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div v-for="tab in tabs" :key="tab.name" class="col-lg-2 mb-3">
            <div class="card shadow box" :class="{ active: activeTab === tab.name }" @click="setActiveTab(tab.name)"
              :style="{ cursor: 'pointer' }">
              <div class="card-body d-flex align-items-center p-2">
                <i :class="tab.icon + ' fs-2 me-2'"></i>
                <div>
                  <h6 class="card-title" :class="{ active: activeTab === tab.name }">
                    {{ tab.label }}
                  </h6>

                  <p class="card-text">
                    {{ allStatistic[tab.label.toUpperCase()] ?? 0 }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Ticket Name</th>
              <th>Req-Date</th>
              <th>Comment</th>
              <th>Priority</th>
              <th>Expected_Delivery-Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedData.length === 0">
              <td colspan="8" class="text-center fs-5">No data available.</td>
            </tr>
            <tr v-for="(ticket, i) in paginatedData" :key="ticket.id">
              <td>{{ i + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <td>{{ ticket.ticketName }}</td>
              <td>{{ formatDate(ticket.createdOn) }}</td>
              <td>{{ ticket.commentBox }}</td>
              <td :class="getPriorityClass(ticket.priorityName)">
                {{ ticket.priorityName }}
              </td>
              <td>{{ formatDate(ticket.expectedDeliveryDate) }}</td>
              <td>
                <span class="rounded-pill text-white p-1" :class="{
                  'bg-warning':
                    ticket.status.toLowerCase() === 'assigned' ||
                    ticket.status.toLowerCase() === 'deny',
                  'bg-info': ticket.status.toLowerCase() === 'inprogress' || ticket.status.toLowerCase() === 're-assigned',
                  'bg-primary': ticket.status.toLowerCase() === 'created' || ticket.status.toLowerCase() === 're-opened',
                  'bg-secondary':
                    ticket.status.toLowerCase() === 'in-verify',
                  'bg-success': ticket.status.toLowerCase() === 'closed',
                  'bg-danger': ticket.status.toLowerCase() === 'cancelled',
                  'bg-dark': ticket.status.toLowerCase() === 'rejected'
                }">{{ ticket.status }}
                </span>
              </td>
              <td>
                <a v-if="ticket.status === 'INPROGRESS' || ticket.status === 'COMPILED'" data-bs-toggle="modal"
                  data-bs-target="#exampleModal" @click="openModal(ticket)">
                  <i class="bi bi-pencil-fill text-primary mx-2"></i>
                </a>
                <a v-if="ticket.status === 'ASSIGNED' || ticket.status === 'RE-ASSIGNED'" class="mx-2 text-success"
                  title="Accept work" data-bs-toggle="modal" data-bs-target="#exampleModal1" @click="confirm(ticket)">
                  <i class="bi bi-telephone-outbound"></i>
                </a>
                <i class="bi bi-trash3-fill text-danger" @click="confirmDelete(ticket.id)"></i>

                <a v-if="ticket.status === 'INPROGRESS'" class="mx-2 text-success" title="Transfer work"
                  data-bs-toggle="modal" data-bs-target="#transfer" @click="confirm(ticket)">
                  <i class="bi bi-arrow-left-right"></i>
                </a>

              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div class="d-flex justify-content-end mt-4" v-if="paginatedData.length > 0">
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
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Ticket Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateTicket">
              <div class="row">
                <!-- Form Fields -->
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="ticketName" class="form-label">Ticket Name</label>
                    <input type="text" class="form-control" id="ticketName" v-model="selectedTicket.ticketName" disabled
                      readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="companyName" class="form-label">Company Name</label>
                    <input type="text" class="form-control" id="companyName" v-model="selectedTicket.companyName"
                      disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" id="address" v-model="selectedTicket.address" disabled
                      readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="userName" class="form-label">Username</label>
                    <input type="text" class="form-control" id="userName" v-model="selectedTicket.userName" disabled
                      readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="personName" class="form-label">Person Name</label>
                    <input type="text" class="form-control" id="personName" v-model="selectedTicket.personName" disabled
                      readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="phoneNumber" class="form-label">Phone Number</label>
                    <input type="text" class="form-control" id="phoneNumber" v-model="selectedTicket.phoneNumber"
                      disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="emailId" class="form-label">Email ID</label>
                    <input type="email" class="form-control" id="emailId" v-model="selectedTicket.emailId" disabled
                      readonly />
                  </div>
                </div>
                <div class="col-md-12 mb-2">
                  <div class="form-group">
                    <label for="commentBox" class="form-label">Comment Box</label>
                    <textarea class="form-control" id="commentBox" v-model="selectedTicket.commentBox" disabled
                      readonly></textarea>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="priorityName" class="form-label">Priority</label>
                    <input type="text" class="form-control" id="priorityName" v-model="selectedTicket.priorityName"
                      disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="expectedDeliveryDate" class="form-label">Expected Delivery Date</label>
                    <input type="date" class="form-control" id="expectedDeliveryDate"
                      v-model="selectedTicket.expectedDeliveryDate" disabled readonly />
                    <br>
                    <button type="button" class="btn btn-success" @click="confirmResolveIssue">Issues Resolve</button>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="status" class="form-label">Status</label>
                    <input type="text" class="form-control" id="status" v-model="selectedTicket.status" disabled
                      readonly />
                  </div>
                </div>
                <div class="col-md-12 mb-2">
                  <div class="form-group">
                    <label for="employeeComment" class="form-label">Employee Comment</label>
                    <textarea class="form-control" id="employeeComment" v-model="comment"></textarea>
                  </div>
                </div>
              </div>
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Save</button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal for Acceptance of Work -->
    <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel1">
              Acceptance of Work
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are you sure?
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-secondary" @click="sureToDeny">
              No
            </button>
            <button type="submit" class="btn btn-primary" @click="sureToSubmit">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Modal -->
    <div class="modal fade" id="transfer" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Transfer of work
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Are You Sure?
            <!-- Employee List Dropdown -->
            <div class="form-group">
              <label for="employeeId">Employee List</label>
              <select v-model="selectedEmployeeId" class="form-control" id="employeeId">
                <option value="" disabled>Select an employee</option>
                <option v-for="data in listOfEmployee" :key="data.id" :value="data.id">
                  {{ data.firstName }} {{ data.lastName }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              No
            </button>
            <button type="submit" class="btn btn-primary" @click="sureToTransfer">
              Yes
            </button>
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
import { Modal } from 'bootstrap'

export default {
  name: 'TicketList',
  components: {
    LayoutDiv,
  },
  data() {
    return {
      selectedEmployeeId: '',
      tickets: [],
      activeTab: 'ALL',
      currentPage: 1,
      itemsPerPage: 5,
      searchQuery: '',
      comment: '',
      companyId: '',
      tabs: [
        { name: 'ALL', label: 'ALL', icon: 'bi bi-list-check' },
        { name: 'ASSIGNED', label: 'ASSIGNED', icon: 'bi bi-person-check' },
        { name: 'RE-ASSIGNED', label: 'RE-ASSIGNED', icon: 'bi bi-calendar2-x' },
        { name: 'INPROGRESS', label: 'INPROGRESS', icon: 'bi bi-person-check' },
        { name: 'IN-VERIFY', label: 'IN-VERIFY', icon: 'bi bi-bar-chart' },
        { name: 'CLOSED', label: 'CLOSED', icon: 'bi bi-journal-check' },
        { name: 'DENY', label: 'DENY', icon: 'bi bi-calendar2-x' },
        { name: 'REJECTED', label: 'REJECTED', icon: 'bi bi-x-circle' },
        { name: 'CANCELLED', label: 'CANCELLED', icon: 'bi bi-x-circle-fill' },
      ],
      companies: [],
      selectedCompany: '',
      selectedTicket: {},
      allStatistic: {},
    };
  },
  created() {
    this.fetchTicketList();
    this.companyWiseRequest();
    this.getDashboardStatistics();
    // this.fetchCompanyList();
    this.fetchEmployeeList();
  },
  computed: {
    filteredTickets() {
      const query = this.searchQuery.toLowerCase();
      return this.tickets.filter(ticket => {
        const matchesTab = this.activeTab === 'ALL' || ticket.status.toUpperCase() === this.activeTab;
        const matchesQuery = (
          (ticket.companyName?.toLowerCase().includes(query) || '') ||
          (ticket.address?.toLowerCase().includes(query) || '') ||
          (ticket.personName?.toLowerCase().includes(query) || '') ||
          (ticket.phoneNumber?.toLowerCase().includes(query) || '') ||
          (ticket.emailId?.toLowerCase().includes(query) || '') ||
          (ticket.ticketName?.toLowerCase().includes(query) || '') ||
          (ticket.status?.toLowerCase().includes(query) || '') ||
          (ticket.priorityName?.toLowerCase().includes(query) || '')
        );
        return matchesTab && matchesQuery;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredTickets.length / this.itemsPerPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTickets.slice(start, end);
    },
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
      this.fetchTicketList();
    },
    fetchTicketList() {
      axios.get('/api/getRequestFormData', {
        params: {
          companyId: this.selectedCompany,
        },
      })
        .then(response => {
          this.tickets = response.data.data;
          console.log(this.tickets);
        })
        .catch(error => console.error(error));
    },
    getDashboardStatistics() {
      axios.get('/api/getDashboardStatistics', {
        params: {
          companyId: this.selectedCompany,
        },
      })
        .then(response => {
          const statistic = response.data.data;
          this.allStatistic = { ...statistic, ALL: response.data.val };
          console.log(this.allStatistic);
        })
        .catch(error => console.error(error));
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openModal(ticket) {
      // this.selectedTicket = { ...ticket };
      this.selectedTicket = ticket
      console.log(this.selectedTicket);
    },
    confirm(ticket) {
      this.selectedTicket = ticket;
    },
    async sureToTransfer() {
      const emp_id = localStorage.getItem('userId');
      const selectedEmployeeId = this.selectedEmployeeId;
      Swal.fire({
        title: 'Please wait...',
        html: 'Submitting the form',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const obj = {
        assignedBy: emp_id,
        requestFormCode: this.selectedTicket.requestFormCode,
        assignedTo: selectedEmployeeId,
        status: 'RE-ASSIGNED',
        companyId: this.selectedCompany,
      };

      try {
        // Save request form tracking record
        const saveRequestFormTrackingRecord = axios.post(
          '/api/saveRequestFormTrackingRecord',
          obj
        );

        // Update request form status
        const updateReqFormStatus = axios.put(
          `/api/updateStatus?status=RE-ASSIGNED&id=${this.selectedTicket.requestFormCode}`
        );

        // Wait for both requests to finish
        await Promise.all([saveRequestFormTrackingRecord, updateReqFormStatus]);

        Swal.fire({
          icon: 'success',
          title: 'Transferred',
          text: 'Your Transfer was successful.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchTicketList();


            this.closeModal('transfer');
            Swal.close();
          }
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Transfer save Failed. Please try again later.',
          confirmButtonText: 'OK',
        });
      }
    },

    async sureToDeny() {
      const emp_id = localStorage.getItem('userId');
      Swal.fire({
        title: 'Please wait...',
        html: 'Submitting the form',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const obj = {
        assignedBy: emp_id,
        requestFormCode: this.selectedTicket.requestFormCode,
        assignedTo: 0,
        status: 'DENY',
        companyId: this.selectedCompany,
      };

      try {
        // Assuming you are using axios, replace this with your service call
        const saveRequestFormTrackingRecord = axios.post('/api/saveRequestFormTrackingRecord', obj);
        const updateReqFormStatus = axios.put(`/api/updateStatus?status=DENY&id=${obj.requestFormCode}`);

        await Promise.all([saveRequestFormTrackingRecord, updateReqFormStatus]);

        Swal.fire({
          icon: 'success',
          title: 'Form Submitted',
          text: 'Your Denial has been submitted successfully.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchTicketList();
            this.closeModal('exampleModal1');
            Swal.close();
          }
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'DENY save Failed. Please try again later.',
          confirmButtonText: 'OK',
        });
      }
    },

    async sureToSubmit() {
      const emp_id = localStorage.getItem('userId');
      Swal.fire({
        title: 'Please wait...',
        html: 'Submitting the form',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const obj = {
        assignedBy: emp_id,
        requestFormCode: this.selectedTicket.requestFormCode,
        assignedTo: 0,
        status: 'ACCEPT',
        companyId: this.selectedCompany,
      };

      try {
        // Assuming you are using axios, replace this with your service call
        const saveRequestFormTrackingRecord = axios.post('/api/saveRequestFormTrackingRecord', obj);
        const updateReqFormStatus = axios.put(`/api/updateStatus?status=INPROGRESS&id=${obj.requestFormCode}`);

        await Promise.all([saveRequestFormTrackingRecord, updateReqFormStatus]);

        Swal.fire({
          icon: 'success',
          title: 'Form Submitted',
          text: 'Your Acceptance has been submitted successfully.',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchTicketList();
            this.closeModal('exampleModal1');
            Swal.close();
            // this.closeModal('exampleModal1');  // Closes modal with ID 'exampleModal'

          }
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Acceptance save Failed. Please try again later.',
          confirmButtonText: 'OK',
        });
      }
    },
    updateTicket() {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const payload = {
        adminId: this.selectedTicket.adminId || 0,
        comment: this.selectedTicket.comment || 'resolved',
        employeeId: userId,
        requestFormCode: this.selectedTicket.requestFormCode,
        role: userRole,
      };

      console.log(payload);

      axios.post('/api/saveComment', payload)
        .then(response => {
          console.log(response);
          this.fetchTicketList();
          Swal.fire({
            icon: 'success',
            title: 'Resolved',
            text: 'The ticket was resolved successfully',
          }).then((result) => {
            if (result.isConfirmed) {
              this.closeModal('exampleModal');
              // this.fetchTicketList();
              Swal.close();
            }
          });
        })
        .catch(error => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was a problem resolving the ticket',
          });
        });
    },
    fetchCompanyList() {
      axios.get('/api/getCompanylist')
        .then(response => {
          if (response.data && response.data.data) {
            this.companies = response.data.data;
            console.log('Fetched companies:', this.companies);
          } else {
            console.warn('Unexpected response format:', response);
          }
        })
        .catch(error => {
          console.error('Error fetching companies:', error);
        });
    },
    fetchEmployeeList() {
      axios.get('/api/getEmployeelist')
        .then(response => {
          this.listOfEmployee = response.data.data;
          console.log(this.listOfEmployee);
        })
        .catch(error => console.error('Error fetching employees:', error));
    },

    confirmResolveIssue(id) {
      // Log the ID and selectedCompany for debugging
      console.log('Resolving issue with ID:', id);
      console.log('Selected Company ID:', this.selectedCompany);

      // Check if companyId is valid
      if (!this.selectedCompany) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Data',
          text: 'Company ID is missing. Please select a company before resolving the issue.',
        });
        console.error('Error: Company ID is missing.');
        return; // Exit the function early
      }

      // Define the request URL and payload
      const requestUrl = '/api/updateTicketDetails';
      // const requestFormCode =this.selectedTicket.requestFormCode;
      const formData = new FormData();
      formData.append('requestFormCode', this.selectedTicket.requestFormCode); // Static requestFormCode
      formData.append('companyId', this.selectedCompany);


      console.log('Payload for resolving issue:', formData); // Log payload for debugging

      // Make the PUT request to update the ticket
      axios.put(requestUrl, formData)
        .then(response => {
          console.log('Resolved ticket response:', response.data); // Log full response data

          // Check if the response data contains the expected result
          if (response.data && response.data.data) {
            Swal.fire({
              icon: 'success',
              title: 'Resolved',
              text: 'The ticket was resolved successfully',
            }).then(() => {
              // Fetch the updated ticket list
              this.fetchTicketList();
              this.closeModal('exampleModal');
              Swal.close();
            });
          } else {
            console.error('Unexpected response format:', response.data);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Unexpected response format. Check console for details.',
            });
          }
        })
        .catch(error => {
          // Log detailed error information
          console.error('Error resolving ticket:', error.response ? error.response.data : error.message);

          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was a problem resolving the ticket. Check console for details.',
          });
        });
    },
    closeModal(modalId) {
      const modalElement = document.getElementById(modalId);
      const modalInstance = Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      } else {
        const modal = new Modal(modalElement);
        modal.hide();
      }

      // Ensure the backdrop is removed
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // Remove the 'modal-open' class from the body to avoid blurring effect
      document.body.classList.remove('modal-open');
      document.body.style.overflow = ''; // Reset the overflow to allow scrolling
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
          axios.delete(`/api/fetchRequestFormRecordsByUserName/${id}`)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Ticket deleted successfully!',
                showConfirmButton: false,
                timer: 1500,
              });
              this.fetchTicketList();
            })
            .catch(error => {
              Swal.fire({
                icon: 'error',
                title: 'An Error Occurred!',
                showConfirmButton: false,
                timer: 1500,
              });
              console.error('Error deleting ticket:', error);
            });
        }
      });
    },
    getPriorityClass(priorityName) {
      switch (priorityName) {
        case 'low':
          return 'priority-low';
        case 'medium':
          return 'priority-medium';
        case 'high':
          return 'priority-high';
        default:
          return '';
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`; // Format date as DD-MM-YYYY
    },
    handleCompanyChange(valueOrEvent) {
      const value = valueOrEvent.target ? valueOrEvent.target.value : valueOrEvent;
      this.selectedCompany = value;
      console.log(this.selectedCompany)
      this.getDashboardStatistics();
      this.fetchTicketList();
      // Perform any additional logic here, such as making API calls
    },
    companyWiseRequest() {
      axios.get('api/getCompanylist')
        .then(response => {
          this.companies = response.data.data;
          console.log(this.companies)
          // return response
          if (this.companies.length > 0) {
            this.selectedCompany = this.companies[0].id;
            this.$nextTick(() => {
              this.handleCompanyChange(this.selectedCompany);
            });
          }
        })
        .catch(error => {
          return error
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

.priority-low {
  font-weight: bold;
  color: rgb(189, 189, 8);
}

.priority-medium {
  font-weight: bold;
  color: rgb(14, 167, 78);
}

.priority-high {
  font-weight: bold;
  color: red;
}

.card.active {
  color: #ffffff;
  background-color: #385c92;

  h6.active {
    color: #ffffff;
  }
}

.box {
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

h6 {
  color: #385c92;
}
</style>