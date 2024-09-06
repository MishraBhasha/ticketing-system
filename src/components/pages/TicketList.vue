<template>
    <layout-div>
        <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Raises Ticket List</h2>
        <div class="card">
            <div class="card-header">
                <router-link to="/user/create" class="btn btn-outline-primary">
                    Raise New Ticket
                </router-link>
            </div>
            <div class="card-body">
                <div class="row justify-content-end">
                    <div class="col-md-4 mb-3">
                        <input type="text" class="form-control" placeholder="search..." v-model="searchQuery"
                            @input="filterTickets">
                    </div>
                </div>
                <!-- <ul class="nav nav-underline">
                    <li class="nav-item" v-for="tab in tabs" :key="tab.name">
                        <a class="nav-link m-2" :class="{ active: activeTab === tab.name }"
                            @click="setActiveTab(tab.name)" href="#">
                            {{ tab.label }}
                            <span class="badge bg-primary text-white rounded-pill">{{
                                allStatistic[tab.label.toUpperCase()] ?? 0 }}</span>
                        </a>
                    </li>
                </ul> -->
                <div class="row">
                    <div v-for="tab in tabs" :key="tab.name" class="col-lg-2 mb-3">
                        <div class="card shadow box" :class="{ active: activeTab === tab.name }" 
                            @click="setActiveTab(tab.name)"
                            :style="{ cursor: 'pointer' }">
                            <div class="card-body d-flex align-items-center p-2">
                                <i :class="tab.icon + ' fs-2 me-2'"></i>
                                <div>
                                    <h6 class="card-title"
                                        :class="{ active: activeTab === tab.name }">
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
                            <th>Expected Delivery Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="8" class="text-center fs-5">No data available.</td>
                        </tr>
                        <tr v-for="(ticket, i) in paginatedData" :key="ticket.id">
                            <td>{{ i + 1 }}</td>
                            <td>{{ ticket.ticketName }}</td>
                            <td>{{ formatDate(ticket.createdOn) }}</td>
                            <td>{{ ticket.commentBox }}</td>
                            <td :class="getPriorityClass(ticket.priorityName)">
                                {{ ticket.priorityName }}
                            </td>
                            <td>{{ formatDate(ticket.expectedDeliveryDate) }}</td>
                            <td>
                                <span class="badge rounded-pill text-white" :class="{
                                    'bg-warning': ticket.status.toLowerCase() === 'assigned',
                                    'bg-primary': ticket.status.toLowerCase() === 'created',
                                    'bg-secondary': ticket.status.toLowerCase() === 'generated',
                                    'bg-success': ticket.status.toLowerCase() === 'approved',
                                    'bg-dark': ticket.status.toLowerCase() === 'rejected',
                                    'bg-danger': ticket.status.toLowerCase() === 'cancelled'
                                }">{{ ticket.status }}
                                </span>
                            </td>
                            <td>
                                <a data-bs-toggle="modal" data-bs-target="#exampleModal" @click="openModal(ticket)">
                                    <i class="bi bi-pencil-fill text-primary mx-2"></i>
                                </a>
                                <i class="bi bi-trash3-fill text-danger" @click="handleDelete(ticket.id)"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!--Pagination-->
                <div class="d-flex justify-content-end mt-4" v-if="paginatedData.length > 0">
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)"
                                aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li class="page-item" :class="{ active: page === currentPage }" v-for="page in totalPages"
                            :key="page">
                            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)"
                                aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--Modal-->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Ticket Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="update">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Company Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.companyName" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Address</label>
                                        <input type="text" class="form-control" id="field2"
                                            v-model="selectedTicket.address" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Person Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.personName" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Phone Number</label>
                                        <input type="tel" id="phone" class="form-control"
                                            v-model="selectedTicket.phoneNumber" />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Email Id</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.emailId" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Delivery Date</label>
                                        <input type="date" class="form-control" id="field2"
                                            v-model="selectedTicket.expectedDeliveryDate" />
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Status</label>
                                        <input type="text" class="form-control" v-model="selectedTicket.status" />
                                    </div>
                                </div>
                                <!-- <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">User Submission Date</label>
                                        <input type="text" :value="formattedUserSubmissionDate" class="form-control"  />
                                    </div>
                                </div> -->
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Ticket Type</label>
                                        <input type="text" v-model="selectedTicket.ticketName" class="form-control" />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Priority Type</label>
                                        <input type="text" v-model="selectedTicket.priorityName" class="form-control"
                                            disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Comment</label>
                                        <textarea rows="1" cols="20" id="commentBox" v-model="selectedTicket.commentBox"
                                            class="form-control" placeholder="Enter your comment here..."></textarea>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="fileView" class="form-label">User File</label>
                                        <div class="file-item">
                                            <button class="btn btn-success btn-sm"
                                                @click.prevent="downloadFile(selectedTicket.fileId)" target="_blank">
                                                <i class="fas fa-file-pdf mx-1"></i>Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3" v-if="activeTab === 'GENERATED'">
                                    <div class="form-group">
                                        <label for="fileView" class="form-label">Resolved File</label>
                                        <div class="file-item">
                                            <button class="btn btn-success btn-sm" target="_blank"
                                                @click.prevent="downloadResolvedFile(selectedTicket.resolvedFileId)">
                                                <i class="fas fa-file-pdf mx-1"></i>Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8 mt-3" v-if="selectedTicket.status === 'CLOSED'">
         <div class="form-group">
        <div class="form-check">
            <input
                type="checkbox"
                class="form-check-input"
                id="enableReopen"
                @change="toggleReopen"
             
            />
             <label class="form-check-label" for="enableReopen">
                Enable Ticket Re-Open
            </label>
            <!-- Show the button only if reopenEnabled is true -->
             <button v-if="reopenEnabled" @click="reopenTicket" class="btn btn-warning mt-2">
            Reopen Ticket
            </button>

          </div>
        </div>
      </div>
  
                               <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button v-if="selectedTicket && selectedTicket.status === 'CREATED'" type="submit" class="btn btn-primary">Save</button>
</div>
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
      reopenEnabled: false,
      selectedTicket: {}, // Initialize as an empty object to avoid null reference errors
      tickets: [],
      searchQuery: '',
      activeTab: 'ALL',
      allStatistic: {},
      currentPage: 1,
      itemsPerPage: 5,
      selectedFile: null,
      userName: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
      tabs: [
        { name: 'ALL', label: 'ALL', icon: 'bi bi-list-check' },
        { name: 'CREATED', label: 'CREATED', icon: 'bi bi-ui-checks' },
        { name: 'ASSIGNED', label: 'ASSIGNED', icon: 'bi bi-person-check' },
        { name: 'INPROGRESS', label: 'INPROGRESS', icon: 'bi bi-person-check' },
        { name: 'IN-VERIFY', label: 'IN-VERIFY', icon: 'bi bi-bar-chart' },
        { name: 'CLOSED', label: 'CLOSED', icon: 'bi bi-journal-check' },
        { name: 'REJECTED', label: 'REJECTED', icon: 'bi bi-x-circle' },
        { name: 'RE-OPENED', label: 'RE-OPENED', icon: 'bi bi-x-circle-fill' },
      ],
    };
  },
  created() {
    this.fetchTicketList();
    this.getDashboardStatistics();
    this.fetchUserData();
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
    fetchUserData() {
      axios.get('api/userName', {
        params: {
          userName: this.userName
        }
      })
      .then(response => {
        this.user = response.data;
        sessionStorage.setItem('userDetails', JSON.stringify(this.user));
      })
      .catch(error => {
        console.error('There was an error fetching the user data:', error);
      });
    },
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
    fetchTicketList() {
      axios.get('api/fetchRequestFormRecordsByUserName')
        .then(response => {
          this.tickets = response.data.data;
          console.log(this.tickets);
        })
        .catch(error => {
          console.error('There was an error fetching the ticket list:', error);
        });
    },
    getDashboardStatistics() {
      axios.get('api/getDashboardStatistics')
        .then(response => {
          const statistic = response.data.data;
          const obj = {
            ...statistic,
            ALL: response.data.val,
          };
          this.allStatistic = obj;
          console.log(this.allStatistic);
        })
        .catch(error => {
          console.error('There was an error fetching the dashboard statistics:', error);
        });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openModal(ticket) {
      this.selectedTicket = ticket;
      console.log(this.selectedTicket.status);
    },
    // update() {
    // console.log(this.selectedTicket);

    // const formData = new FormData();
    // formData.append('requestFormDTO', JSON.stringify({
    //   address: this.selectedTicket.address,
    //   userName: this.selectedTicket.userName,
    //   personName: this.selectedTicket.personName,
    //   expectedDeliveryDate: this.selectedTicket.expectedDeliveryDate,
    //   phoneNumber: this.selectedTicket.phoneNumber,
    //   emailId: this.selectedTicket.emailId,
    //   commentBox: this.selectedTicket.commentBox,
    //   ticketId: this.selectedTicket.ticketId,
    //   priorityId: this.selectedTicket.priorityId,
    //   requestFormCode: this.selectedTicket.requestFormCode
    // }));

    // // Append additional fields if needed
    // if (this.selectedFile) {
    //   formData.append('file', this.selectedFile);
    // }
    // if (this.reopenEnabled) {
    //   formData.append('status', 'RE-OPENED');
    // }

    // // Perform the PUT request
    // axios.put('/api/updateRequestFormData', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data' // Ensure correct content type for FormData
    //   }
    // })
    //   .then(() => {
    //     this.fetchTicketList();
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Updated',
    //       text: 'The ticket was updated successfully',
    //     }).then(() => {
    //       const modalElement = document.getElementById('exampleModal');
    //       if (modalElement) {
    //         const modalInstance = Modal.getInstance(modalElement);
    //         if (modalInstance) {
    //           modalInstance.hide();
    //         }
    //         const backdrop = document.querySelector('.modal-backdrop');
    //         if (backdrop) {
    //           backdrop.parentNode.removeChild(backdrop);
    //         }
    //       }
    //     });
    //   })
    //   .catch(error => {
    //     console.error('There was an error updating the ticket:', error);
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'There was a problem updating the ticket',
    //     });
    //   });
    // },

    update() {
    console.log(this.selectedTicket);

    const formData = new FormData();
    
    // Append JSON data as a string
    formData.append('requestFormDTO', JSON.stringify({
      companyName: this.selectedTicket.companyName, // Ensure companyName is included
      address: this.selectedTicket.address,
      userName: this.selectedTicket.userName,
      personName: this.selectedTicket.personName,
      expectedDeliveryDate: this.selectedTicket.expectedDeliveryDate,
      phoneNumber: this.selectedTicket.phoneNumber,
      emailId: this.selectedTicket.emailId,
      commentBox: this.selectedTicket.commentBox,
      ticketId: this.selectedTicket.ticketId,
      priorityId: this.selectedTicket.priorityId,
      requestFormCode: this.selectedTicket.requestFormCode
    }));

    // Append additional fields if needed
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    if (this.reopenEnabled) {
      formData.append('status', 'RE-OPENED');
    }

    // Perform the PUT request
    axios.put('/api/updateRequestFormData', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Ensure correct content type for FormData
      }
    })
      .then(() => {
        this.fetchTicketList();
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'The ticket was updated successfully',
        }).then(() => {
          const modalElement = document.getElementById('exampleModal');
          if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.parentNode.removeChild(backdrop);
            }
          }
        });
      })
      .catch(error => {
        console.error('There was an error updating the ticket:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a problem updating the ticket',
        });
      });
  },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
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
      }).then(result => {
        if (result.isConfirmed) {
          axios.delete(`/api/fetchRequestFormRecordsByUserName/${id}`)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Ticket deleted successfully!',
                showConfirmButton: false,
                timer: 1500
              });
              this.fetchTicketList();
            })
            .catch(error => {
              console.error('There was an error deleting the ticket:', error);
              Swal.fire({
                icon: 'error',
                title: 'An Error Occured!',
                showConfirmButton: false,
                timer: 1500
              });
            });
        }
      });
    },
    downloadFile(fileId) {
      axios.get(`/api/downloadFile?fileId=${fileId}`, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          const newTab = window.open(url, '_blank');
          if (newTab) {
            newTab.focus();
          } else {
            console.error('Failed to open new tab');
          }
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('There was an error downloading the file:', error);
        });
    },
    downloadResolvedFile(fileId) {
      axios.get(`/api/downloadFile?fileId=${fileId}`, { responseType: 'blob' })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
          const newTab = window.open(url, '_blank');
          if (newTab) {
            newTab.focus();
          } else {
            console.error('Failed to open new tab');
          }
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('There was an error downloading the resolved file:', error);
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
    toggleReopen(event) {
      this.reopenEnabled = event.target.checked;
    },
    reopenTicket() {
      if (this.reopenEnabled && this.selectedTicket) {
        const updatedTicket = { ...this.selectedTicket, status: 'RE-OPENED' };
        axios.put(`/api/updateRequestFormData`, updatedTicket)
          .then(() => {
            this.fetchTicketList();
            Swal.fire({
              icon: 'success',
              title: 'Reopened',
              text: 'The ticket was reopened successfully',
            }).then(() => {
              const modalElement = document.getElementById('exampleModal');
              if (modalElement) {
                const modalInstance = Modal.getInstance(modalElement);
                if (modalInstance) {
                  modalInstance.hide();
                }
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                  backdrop.parentNode.removeChild(backdrop);
                }
              }
            });
          })
          .catch(error => {
            console.error('There was an error reopening the ticket:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was a problem reopening the ticket',
            });
          });
      } else {
        console.error('Reopen enabled is false or selectedTicket is undefined');
      }
    }
  },
};
</script>




<style scoped>
.box {
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
h6 {
    color: #385c92;
}

.card.active {
    color: #ffffff;
    background-color: #385c92;
    h6.active {
        color: #ffffff;    
    }
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