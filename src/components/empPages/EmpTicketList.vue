<template>
     <layout-div>
    <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Ticket Manager</h2>
    <div class="card">
      <div class="card-body">
        <div class="row justify-content-end">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="search..." v-model="searchQuery" @input="filterTickets">
          </div>
          <div class="col-md-4 mt-2">
            <select class="form-select" v-model="selectedCompany" @change="fetchTicketList">
              <option value="">All Companies</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>
        </div>
        <ul class="nav nav-underline">
          <li class="nav-item" v-for="tab in tabs" :key="tab.name">
            <a class="nav-link m-2" :class="{ active: activeTab === tab.name }" @click="setActiveTab(tab.name)" href="#">
              {{ tab.label }}
              <span class="badge bg-primary text-white rounded-pill">{{ allStatistic[tab.label.toUpperCase()] ?? 0 }}</span>
            </a>
          </li>
        </ul>
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
                  'bg-warning': ticket.status.toLowerCase() === 'assigned',
                  'bg-primary': ticket.status.toLowerCase() === 'submitted',
                  'bg-secondary': ticket.status.toLowerCase() === 'generated',
                  'bg-success': ticket.status.toLowerCase() === 'approved',
                  'bg-dark': ticket.status.toLowerCase() === 'rejected',
                  'bg-danger': ticket.status.toLowerCase() === 'cancelled'
                }">{{ ticket.status }}</span>
              </td>
              <td>
                <a data-bs-toggle="modal" data-bs-target="#exampleModal" @click="openModal(ticket)">
                  <i class="bi bi-pencil-fill text-primary mx-2"></i>
                </a>
                <i class="bi bi-trash3-fill text-danger" @click="confirmDelete(ticket.id)"></i>
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
                    <input type="text" class="form-control" id="ticketName" v-model="selectedTicket.ticketName" disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="companyName" class="form-label">Company Name</label>
                    <input type="text" class="form-control" id="companyName" v-model="selectedTicket.companyName" disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" class="form-control" id="address" v-model="selectedTicket.address" disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="userName" class="form-label">Username</label>
                    <input type="text" class="form-control" id="userName" v-model="selectedTicket.userName" disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="personName" class="form-label">Person Name</label>
                    <input type="text" class="form-control" id="personName" v-model="selectedTicket.personName" disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="phoneNumber" class="form-label">Phone Number</label>
                    <input type="text" class="form-control" id="phoneNumber" v-model="selectedTicket.phoneNumber" disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="emailId" class="form-label">Email ID</label>
                    <input type="email" class="form-control" id="emailId" v-model="selectedTicket.emailId" disabled readonly />
                  </div>
                </div>
                <div class="col-md-12 mb-2">
                  <div class="form-group">
                    <label for="commentBox" class="form-label">Comment Box</label>
                    <textarea class="form-control" id="commentBox" v-model="selectedTicket.commentBox" disabled readonly></textarea>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="priorityName" class="form-label">Priority</label>
                    <input type="text" class="form-control" id="priorityName" v-model="selectedTicket.priorityName" disabled readonly />
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="expectedDeliveryDate" class="form-label">Expected Delivery Date</label>
                    <input type="date" class="form-control" id="expectedDeliveryDate" v-model="selectedTicket.expectedDeliveryDate" disabled readonly />
                    <br>
                    <button type="button" class="btn btn-success" @click="confirmResolveIssue">Issues Resolve</button>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="form-group">
                    <label for="status" class="form-label">Status</label>
                    <input type="text" class="form-control" id="status" v-model="selectedTicket.status" disabled readonly />
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
              activeTab: 'ALL',
              currentPage: 1,
              itemsPerPage: 5,
              searchQuery: '',
              comment: '',
              companyId: '',
              tabs: [
                  { name: 'ALL', label: 'ALL' },
                  { name: 'ASSIGNED', label: 'ASSIGNED' },
                  { name: 'GENERATED', label: 'GENERATED' },
                  { name: 'APPROVED', label: 'APPROVED' },
                  { name: 'REJECTED', label: 'REJECTED' },
                  { name: 'CANCELLED', label: 'CANCELLED' },
              ],
              companies: [],
              selectedCompany: '',
              selectedTicket: {},
              allStatistic: {},
          };
      },
      created() {
          this.fetchTicketList();
          this.fetchCompanyList();
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
              axios.get('/api/getDashboardStatistics')
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
              this.selectedTicket = { ...ticket };
              console.log( this.selectedTicket);
              // Show the modal using Bootstrap's modal methods
              const modalElement = document.getElementById('exampleModal');
              if (modalElement) {
                  const modalInstance = new Modal(modalElement);
                  modalInstance.show();
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
                      }).then(() => {
                          // Hide the modal and remove the backdrop using Bootstrap's methods
                          const modalElement = document.getElementById('exampleModal');
                          if (modalElement) {
                              const modalInstance = Modal.getInstance(modalElement);
                              if (modalInstance) {
                                  modalInstance.hide();
                              }
                          }
                          const backdrop = document.querySelector('.modal-backdrop');
                          if (backdrop) {
                              backdrop.parentNode.removeChild(backdrop);
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
    // const payload = {
    //     requestFormCode:requestFormCode,
    //     companyId: this.selectedCompany,
      
    // };

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

                    // Hide the modal and clean up
                    const modalElement = document.getElementById('exampleModal');
                    if (modalElement) {
                        const modalInstance = Modal.getInstance(modalElement);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                    }

                    // Remove the modal backdrop if it exists
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.parentNode.removeChild(backdrop);
                    }
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
          }
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
</style>