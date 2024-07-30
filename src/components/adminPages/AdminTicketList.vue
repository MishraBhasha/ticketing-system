<template>
    <layout-div>
        <div class="container">
            <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Ticket Manager</h2>
            <div class="card">
                <div class="card-body">

                    <ul class="nav nav-underline">
                        <li class="nav-item" v-for="tab in tabs" :key="tab.name">
                            <a class="nav-link" :class="{ active: activeTab === tab.name }"
                                @click="setActiveTab(tab.name)" href="#">
                                {{ tab.label }}
                            </a>
                        </li>
                        <!-- <li class="nav-item"><a class="nav-link">ALL</a></li>
                        <li class="nav-item"><a class="nav-link">ASSIGNED</a></li>
                        <li class="nav-item"><a class="nav-link">SUBMITTED</a></li>
                        <li class="nav-item"><a class="nav-link">GENERATED</a></li>
                        <li class="nav-item"><a class="nav-link">APPROVED</a></li>
                        <li class="nav-item"><a class="nav-link">REJECTED</a></li>
                        <li class="nav-item"><a class="nav-link">CANCELLED</a></li> -->
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
                            <tr v-for="(ticket, i) in tickets" :key="ticket.id">
                                <td>{{ i + 1 }}</td>
                                <td>{{ ticket.ticketName }}</td>
                                <td>{{ formatDate(ticket.createdOn) }}</td>
                                <td>{{ ticket.commentBox }}</td>
                                <td :class="getPriorityClass(ticket.priorityName)">
                                    {{ ticket.priorityName }}
                                </td>
                                <td>{{ formatDate(ticket.expectedDeliveryDate) }}</td>
                                <td>{{ ticket.status }}</td>
                                <td>
                                    <a data-bs-toggle="modal" data-bs-target="#exampleModal" @click="openModal(ticket)">
                                        <i class="bi bi-pencil-fill text-primary mx-2"></i>
                                    </a>
                                    <!-- <router-link :to="`/show/${ticket.id}`"
                                        class="btn btn-outline-info mx-1">Show</router-link> -->
                                    <!-- <router-link :to="`/edit/${ticket.id}`">
                                        <i class="bi bi-pencil-fill text-primary mx-2"></i>
                                    </router-link> -->
                                    <i class="bi bi-trash3-fill text-danger" @click="handleDelete(ticket.id)"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!--Modal-->
        <div class="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Ticket Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Company Name</label>
                                        <input type="text" class="form-control" id="field1" v-model="selectedTicket.companyName"
                                        disabled  readOnly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Address</label>
                                        <input type="text" class="form-control" id="field2" v-model="selectedTicket.address"
                                        disabled   readonly />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Person Name</label>
                                        <input type="text" class="form-control" id="field1" v-model="selectedTicket.personName"
                                        disabled   readonly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Phone Number</label>
                                        <input type="tel" id="phone" class="form-control"
                                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" v-model="selectedTicket.phoneNumber"
                                            disabled  readonly />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Email Id</label>
                                        <input type="text" class="form-control" id="field1" v-model="selectedTicket.emailId"
                                        disabled  readonly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Delivery Date</label>
                                        <input type="date" class="form-control" id="field2"
                                        v-model="selectedTicket.expectedDeliveryDate" disabled  readonly />
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Status</label>
                                        <input type="text" class="form-control" v-model="selectedTicket.status" disabled  readonly />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">User Submission Date</label>
                                        <input type="text" :value="formattedUserSubmissionDate" class="form-control" disabled  readonly />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Ticket Type</label>
                                        <input type="text" v-model="selectedTicket.ticketName" class="form-control" disabled  readonly />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Priority Type</label>
                                        <input type="text" v-model="selectedTicket.priorityName" class="form-control"
                                        disabled  readonly />
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Comment</label>
                                        <textarea rows="1" cols="20" id="commentBox" v-model="selectedTicket.commentBox"
                                            class="form-control" placeholder="Enter your comment here..."
                                            disabled  readonly></textarea>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label for="fileView" class="form-label">User File</label>
                                        <div class="file-item">
                                            <button class="btn btn-success btn-sm" @click.prevent="downloadFile(selectedTicket.fileId)" target="_blank">
                                                <i class="fas fa-file-pdf mx-1"></i>Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3" v-if="activeTab === 'GENERATED'">
                                    <div class="form-group">
                                        <label for="fileView" class="form-label">Resolved File</label>
                                        <div class="file-item">
                                            <button class="btn btn-success btn-sm" target="_blank" @click.prevent="downloadResolvedFile(selectedTicket.resolvedFileId)">
                                                <i class="fas fa-file-pdf mx-1"></i>Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form @submit.prevent="adminAssigned">
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="status">Status</label>
                                    <select class="form-select" v-model="status">
                                        <option value="">--select--</option>
                                        <option value="ASSIGNED" v-if="activeTab === 'SUBMITTED'">ASSIGN</option>
                                        <option value="APPROVED" v-if="activeTab === 'GENERATED'">APPROVE</option>
                                        <option value="REJECTED">REJECT</option>

                                    </select>
                                </div>
                                <div class="col-md-6" v-if="activeTab === 'SUBMITTED'">
                                    <label>Employee Name</label>
                                    <select class="form-select" v-model="assignedTo">
                                        <option value="">--select--</option>
                                        <option v-for="data in listOfEmployee" :key="data.id" :value="data.id">
                                            {{ data.firstName }} {{ data.lastName }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="heading-container">
                                <h4>Comment Section</h4>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <label>Admin Comment</label>
                                    <textarea class="form-control" v-model="comment">

                                    </textarea>

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
            listOfEmployee:[],
            activeTab: 'SUBMITTED',
            tabs: [
                { name: 'SUBMITTED', label: 'SUBMITTED' },
                { name: 'ALL', label: 'ALL' },
                { name: 'ASSIGNED', label: 'ASSIGNED' },
                { name: 'GENERATED', label: 'GENERATED' },
                { name: 'APPROVED', label: 'APPROVED' },
                { name: 'REJECTED', label: 'REJECTED' },
                { name: 'CANCELLED', label: 'CANCELLED' },
            ],
            selectedTicket: {
                companyName: '',
                address: '',
                personName: '',
                phoneNumber: '',
                emailId: '',
                expectedDeliveryDate: '',
                status: '',
                createdOn: '',
                ticketName: '',
                priorityName: '',
                commentBox: '',
            },
        };
    },
    created() {
        this.fetchTicketList();
        
    },
    methods: {
        setActiveTab(tabName) {
            this.activeTab = tabName;
            console.log(this.activeTab)
        },
        openModal(ticket) {
            this.selectedTicket = ticket;
            this.fetchEmployeeList();
        },
        fetchTicketList() {
            axios.get('api/getRequestFormData')
                .then(response => {
                    this.tickets = response.data.data;
                    console.log(this.tickets)
                    return response
                })
                .catch(error => {
                    return error
                });
                
        },
        fetchEmployeeList() {
            axios.get('api/getEmployeelist')
                .then(response => {
                    this.listOfEmployee = response.data.data;
                    console.log(this.listOfEmployee)
                    return response
                })
                .catch(error => {
                    return error
                });
                
        },
        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            // return `${year}-${month}-${day}`; // Format date as YYYY-MM-DD
            return `${day}-${month}-${year}`; // Format date as YYYY-MM-DD
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
                    axios.delete(`/api/fetchRequestFormRecordsByUserName/${id}`)
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Ticket deleted successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.fetchTicketList();
                            return response
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: 'An Error Occured!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            return error
                        });
                }
            })
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
        downloadFile(fileId) {
            console.log(fileId)
            axios.get(`/api/downloadFile?fileId=${fileId}`, { responseType: 'blob' })
                .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
         
                const newTab = window.open(url, '_blank');
                if (newTab) {
                    newTab.focus(); // Focus the new tab if it was successfully opened
                } else {
                    console.error('Failed to open new tab');
                }
                window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        downloadResolvedFile(fileId) {
            console.log(fileId)
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
                    console.error(error);
                });
        },
        adminAssigned() {
      const payload = {
        status: this.status,
        assignedTo: this.assignedTo,
        comment: this.comment,
        requestFormCode:this.selectedTicket.requestFormCode,
        assignedBy:10
      };

      axios.post('/api/saveRequestFormTrackingRecord', payload)
        .then(response => {
            console.log(response)
          Swal.fire({
            icon: 'success',
            title: 'Status Updated',
            text:'Assigned Successfully!',
            showConfirmButton: true,
            timer: 1500
          }).then(() => {
             // Close the modal using Bootstrap's Modal instance
             const modalElement = document.getElementById('exampleModal');
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance.hide();
            this.fetchTicketList();
            // Redirect to /user/alist using Vue Router
            // this.$router.push('/user/alist'); 
          });
         
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'An error occurred!',
            text: error.response.data.message,
            showConfirmButton: false,
            timer: 1500
          });
        });
    },
    },
    
    computed: {
        formattedUserSubmissionDate() {
            return this.formatDate(this.selectedTicket.createdOn);
        },
        formattedCreatedOn() {
            return this.formatDate(this.selectedTicket.createdOn);
        }
    }
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