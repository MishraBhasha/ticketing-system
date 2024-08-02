<template>
    <layout-div>
    
        <div class="container">
            <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Priority Type</h2>
            <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Search...."/>
        </div>
        <!-- <div class="col-md-4">
            <button type="button" class="btn btn-primary">Create Ticket</button>
        </div> -->
        <!-- Button trigger modal -->
        <div class="col-md-4">
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Create Priority Type
</button>
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
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.tickettytype"  />
                                    </div>  
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
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
                            <tr v-for="(ticket, i) in tickets" :key="ticket.id">
                                <td>{{ i + 1 }}</td>
                                <td>{{ ticket.ticketType }}</td>
                                
                                
                                
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
        
       
    </layout-div>
</template>

<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
export default {
    name: 'TicketLists',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            tickets: [],
            listOfTicket: [],
            activeTab: 'SUBMITTED',
            
            selectedTicket: {
                
               
                ticketType: '',
                
            },
        };
    },
    created() {
        // this.fetchTicketList();

    },
    methods: {
        
        openModal(ticket) {
            this.selectedTicket = ticket;
            // this.fetchEmployeeList();
        },
        // fetchTicketList() {
        //     axios.get('api/getRequestFormData')
        //         .then(response => {
        //             this.tickets = response.data.data;
        //             console.log(this.tickets)
        //             return response
        //         })
        //         .catch(error => {
        //             return error
        //         });

        // },
        getAllTicketType() {
            axios.get('api/getAllTicketType')
                .then(response => {
                    this.listOfTickets = response.data.data;
                    console.log(this.listOfTickets)
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
                requestFormCode: this.selectedTicket.requestFormCode,
                assignedBy: 10
            };

            axios.post('/api/saveRequestFormTrackingRecord', payload)
                .then(response => {
                    console.log(response)
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Updated',
                        text: 'Assigned Successfully!',
                        showConfirmButton: true,
                        timer: 1500
                    }).then(() => {
                        const modalElement = document.getElementById('exampleModal');
                        const modalInstance = Modal.getInstance(modalElement);
                        modalInstance.hide();
                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) {
                            backdrop.parentNode.removeChild(backdrop);
                        }
                        this.fetchTicketList();
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