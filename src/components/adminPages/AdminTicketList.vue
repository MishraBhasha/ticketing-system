<template>
    <layout-div>
        <AppLoader v-if="isLoading" />
        <!-- <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }"> Dashboard </h2> -->
        <div class="d-flex justify-content-between align-items-center mt-5 mb-3">
            <h2 class="text-center rounded shadow mb-0" :style="{ color: '#060389' }">Dashboard</h2>
            <div>
                <select id="companyName" class="form-control d-inline-block w-auto"
                    :class="{ 'is-invalid': submitted && errors.companyName }" @change="handleCompanyChange($event)"
                    v-model="selectedCompanyId">
                    <option value="" disabled selected>Select your company</option>
                    <option v-for="item in companies" :key="item.id" :value="item.id">
                        {{ item.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="card">
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
                                        ticket.status.toLowerCase() === 'deny' ||
                                        ticket.status.toLowerCase() === 're-assigned',
                                    'bg-primary': ticket.status.toLowerCase() === 'forwarded',
                                    'bg-info': ticket.status.toLowerCase() === 'inprogress',
                                    'bg-secondary':
                                        ticket.status.toLowerCase() === 'in-verify' ||
                                        ticket.status.toLowerCase() === 'deferred' ||
                                        ticket.status.toLowerCase() === 're-opened',
                                    'bg-success': ticket.status.toLowerCase() === 'closed',
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
                        <form>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Company Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.companyName" disabled readOnly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Address</label>
                                        <input type="text" class="form-control" id="field2"
                                            v-model="selectedTicket.address" disabled readonly />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Person Name</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.personName" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Phone Number</label>
                                        <input type="tel" id="phone" class="form-control"
                                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" v-model="selectedTicket.phoneNumber"
                                            disabled readonly />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field1" class="form-label">Email Id</label>
                                        <input type="text" class="form-control" id="field1"
                                            v-model="selectedTicket.emailId" disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Delivery Date</label>
                                        <input type="date" class="form-control" id="field2"
                                            v-model="selectedTicket.expectedDeliveryDate" disabled readonly />
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="commentBox" class="form-label">User Status</label>
                                        <input type="text" class="form-control" v-model="selectedTicket.status" disabled
                                            readonly />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">User Submission Date</label>
                                        <input type="text" :value="formattedUserSubmissionDate" class="form-control"
                                            disabled readonly />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label for="createdOn" class="form-label">Ticket Type</label>
                                        <input type="text" v-model="selectedTicket.ticketName" class="form-control"
                                            disabled readonly />
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
                                            class="form-control" placeholder="Enter your comment here..." disabled
                                            readonly></textarea>
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
                            </div>
                        </form>
                        <form @submit.prevent="adminAssigned">
                            <div class="row">
                                <div class="col-md-6" v-if="requestData !== 'REJECTED' && requestData !== 'CANCELLED'">
                                    <label for="status">Status</label>
                                    <select class="form-select" v-model="status" @change="onStatusChange">
                                        <option value="" disabled selected>--select--</option>
                                        <option value="ASSIGNED" v-if="
                                            requestData === 'CREATED' ||
                                            requestData === 'DENY' ||
                                            requestData === 'DEFERRED' ||
                                            requestData === 'RE-OPENED' || requestData === 'FORWARDED'
                                        ">
                                            ASSIGN
                                        </option>

                                        <option value="CLOSED" v-if="requestData === 'IN-VERIFY'">
                                            CLOSE
                                        </option>
                                        <option value="REJECTED">REJECT</option>
                                        <option value="DEFERRED">DEFER</option>

                                    </select>
                                </div>
                                <div class="col-md-6" v-if="showEmployeeList">
                                    <label>Employee Name</label>
                                    <select class="form-select" v-model="assignedTo">
                                        <option value="" disabled selected>--select--</option>
                                        <option v-for="data in listOfEmployee" :key="data.id" :value="data.id">
                                            {{ data.firstName }} {{ data.lastName }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <br>
                            <!-- <div class="heading-container">
                                <h4>Comment Section</h4>
                            </div> -->
                            <!-- <div class="row">
                                <div class="col-md-12">
                                    <label>Admin Comment</label>
                                    <textarea class="form-control" v-model="comment">

                                    </textarea>

                                </div>

                            </div> -->
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </form>
                        <div class="heading-container">
                            <h4>Comment Section</h4>
                        </div>
                        <form @submit.prevent="saveComment">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Admin Comment</label>
                                        <textarea v-model="commentForm.empComment" class="form-control"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-6 mt-5 d-flex">
                                    <button class="btn btn-primary me-2" type="submit">
                                        Add Comments
                                    </button>
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal" >Close</button>
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
import AppLoader from '../pages/AppLoader.vue';
export default {
    name: 'TicketList',
    components: {
        LayoutDiv,
        AppLoader
    },
    data() {
        return {
            tickets: [],
            listOfEmployee: [],
            companies: [],
            currentPage: 1,
            itemsPerPage: 5,
            totalItems: 0,
            searchQuery: "",
            status: '',
            assignedTo: '',
            comment: '',
            allStatistic: {},
            isLoading: false,
            activeTab: 'FORWARDED',
            requestData: 'FORWARDED',
            showEmployeeList: false,
            selectedCompanyId: '',
            companyId: localStorage.getItem('companyId'),
            tabs: [
                { name: 'FORWARDED', label: 'FORWARDED', icon: 'bi bi-ui-checks' },
                { name: 'ALL', label: 'ALL', icon: 'bi bi-list-check' },
                { name: 'ASSIGNED', label: 'ASSIGNED', icon: 'bi bi-person-check' },
                { name: 'INPROGRESS', label: 'INPROGRESS', icon: 'bi bi-person-check' },
                { name: 'INVERIFY', label: 'INVERIFY', icon: 'bi bi-bar-chart' },
                { name: 'DENY', label: 'DENY', icon: 'bi bi-calendar2-x' },
                { name: 'REASSIGNED', label: 'REASSIGNED', icon: 'bi bi-calendar2-x' },
                { name: 'REOPENED', label: 'RE-OPENED', icon: 'bi bi-calendar2-x' },
                { name: 'CLOSED', label: 'CLOSED', icon: 'bi bi-journal-check' },
                { name: 'REJECTED', label: 'REJECTED', icon: 'bi bi-x-circle' },
                { name: 'DEFERRED', label: 'DEFERRED', icon: 'bi bi-file-earmark-image-fill' },
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
                // commentBox: '',
            },
            commentForm: {
                empComment: ''
            },
        };
    },
    created() {
        this.fetchTicketList();
        this.getDashboardStatistics();
        this.companyWiseRequest();
    },
    computed: {
        formattedUserSubmissionDate() {
            return this.formatDate(this.selectedTicket.createdOn);
        },
        formattedCreatedOn() {
            return this.formatDate(this.selectedTicket.createdOn);
        },
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
                    (ticket.priorityName?.toLowerCase().includes(query) || '') ||
                    (ticket.commentBox?.toLowerCase().includes(query) || '')
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
            this.currentPage = 1; 
            // this.fetchTicketList();
            console.log(this.activeTab)
        },
        openModal(ticket) {
            this.selectedTicket = ticket;
            this.requestFormCode = ticket.requestFormCode;
            this.fetchEmployeeList();
        },
        closeModal() {
            const modalElement = document.getElementById('exampleModal');
            const modalInstance = Modal.getInstance(modalElement);
            modalInstance.hide();
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
        },
        fetchTicketList() {
            axios.get('api/getRequestFormData', {
                params: {
                    // status: this.activeTab
                    companyId: this.companyId 
                }
            })
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
            return `${day}-${month}-${year}`; // Format date as DD-MM-YYYY
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
            // this.isLoading = true;
            let obj = {};
            if (this.requestData === 'COMPILED' || this.status === 'REJECTED') {
                obj = {
                    status: this.status,
                    assignedTo: 0,
                    comment: this.comment,
                    requestFormCode: this.selectedTicket.requestFormCode,
                    assignedBy: localStorage.getItem('userId'),
                    companyId: this.selectedCompanyId
                }

            }
            else {
                obj = {
                    status: this.status,
                    assignedTo: this.assignedTo,
                    comment: this.comment,
                    requestFormCode: this.selectedTicket.requestFormCode,
                    assignedBy: localStorage.getItem('userId'),
                    companyId: this.selectedCompanyId
                }
            }
            // const payload = {
            //     status: this.status,
            //     assignedTo: this.activeTab === 'GENERATED' ? 0 : this.assignedTo,
            //     comment: this.comment,
            //     requestFormCode: this.selectedTicket.requestFormCode,
            //     assignedBy: localStorage.getItem('userId')
            // };

            Swal.fire({
                title: 'Please wait...',
                html: 'Submitting the form',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            // this.isLoading = true;

            axios.all([
                axios.post('/api/saveRequestFormTrackingRecord', obj),
                axios.put(`/api/updateStatus?status=${obj.status}&id=${obj.requestFormCode}`)
            ])
                .then(axios.spread(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Updated',
                        text: `${obj.status} successfully.`,
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {

                            this.closeModal();
                            this.fetchTicketList();
                            Swal.close();
                            this.getDashboardStatistics();
                        }
                    });
                }))
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'An error occurred!',
                        text: error.response.data.message,
                        showConfirmButton: true,
                        // timer: 1500
                    });
                })
                .finally(() => {
                    this.isLoading = false; // Hide loader
                });
        },
        onStatusChange() {
            const selectedStatus = this.status;
            this.showEmployeeList = ['FORWARDED', 'DENY', 'DEFERRED', 'RE-OPENED'].includes(this.requestData);
            console.log(this.showEmployeeList);

            if (selectedStatus === 'REJECTED' || selectedStatus === 'DEFERRED') {
                this.showEmployeeList = false;
                console.log(this.showEmployeeList);
            }
        },

        getDashboardStatistics() {
            axios.get('api/getDashboardStatistics', {
                params: {
                    companyId: this.companyId // or simply companyId if the key and variable name are the same
                }
            })
                .then(response => {
                    const statistic = response.data.data;
                    const obj = {
                        ...statistic,
                        ALL: response.data.val,
                    };
                    this.allStatistic = obj;
                    console.log(this.allStatistic)
                    return response
                })
                .catch(error => {
                    return error
                });
        },
        // changePage(page) {
        //     if (page < 1 || page > this.totalPages) return;
        //     this.currentPage = page;
        //     this.fetchTicketList();
        // },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        saveComment() {
            const userRole = localStorage.getItem('userRole');
            const userId = localStorage.getItem('userId')
            console.log(this.commentForm);

            const obj = {
                comment: this.commentForm.empComment,
                requestFormCode: this.requestFormCode,
                role: userRole,
                employeeId: 0,
                adminId: userId,
            };

            Swal.fire({
                title: 'Please wait...',
                html: 'Submitting the Comment',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            axios.post(`/api/saveComment`, obj).then(
                (response) => {
                    if (response.data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Comment Submitted',
                            text: 'Your Comment has been submitted successfully.',
                            confirmButtonText: 'OK',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.close();
                            }
                        });
                    }
                },
                (error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Form Submission Failed',
                        text: 'An error occurred while submitting the form.',
                        confirmButtonText: 'OK',
                    });
                }
            );
        },

        handleCompanyChange(valueOrEvent) {
            const value = valueOrEvent.target ? valueOrEvent.target.value : valueOrEvent;
            this.selectedCompanyId = value;
            // Perform any additional logic here, such as making API calls
        },
        companyWiseRequest() {
            axios.get('api/getCompanylist')
                .then(response => {
                    this.companies = response.data.data;
                    console.log(this.companies)
                    // return response
                    if (this.companies.length > 0) {
                        this.selectedCompanyId = this.companies[0].id;
                        this.$nextTick(() => {
                            this.handleCompanyChange(this.selectedCompanyId);
                        });
                    }
                })
                .catch(error => {
                    return error
                });
        },
        resetForm() {
            this.status = '';
            this.assignedTo = '';
            this.commentForm.empComment = '';
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

.heading-container {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
}

.heading-container::before,
.heading-container::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #000;
    margin: 0 10px;
}
</style>