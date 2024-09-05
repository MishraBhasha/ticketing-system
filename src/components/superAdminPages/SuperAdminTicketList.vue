<template>
    <layout-div>
        <AppLoader v-if="isLoading" />
        <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }"> Dashboard </h2>
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
                <div class="row mb-3">
                    <div class="col-md-6">
                        <!-- <div class="chart-container"> -->
                        <DoughnutChart :chartData="doughnutChartData" :options="doughnutChartOptions" />
                        <!-- </div> -->
                    </div>
                    <div class="col-md-6">
                        <LineChart :chartData="lineChartData" :options="lineChartOptions" />
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
                                <div class="col-md-4" v-if="requestData !== 'REJECTED' && requestData !== 'CANCELLED'">
                                    <div class="form-group">
                                        <label for="status">Status</label>
                                        <select v-model="status" class="form-select" @change="onStatusChange">
                                            <option value="" disabled selected>Select</option>
                                            <option value="ASSIGNED" v-if="isStatusSelectable()">ASSIGN</option>

                                            <option value="CLOSED" v-if="requestData === 'IN-VERIFY'">CLOSE</option>
                                            <option value="REJECTED">REJECT</option>
                                            <option value="DEFERRED">DEFER</option>
                                            <option value="FORWARDED">FORWARD</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-4" v-if="showEmployeeList">
                                    <div class="form-group">
                                        <label for="firstName">Employee List</label>
                                        <select v-model="assignedTo" class="form-select">
                                            <option value="" disabled selected>Select an employee</option>
                                            <option v-for="data in listOfEmployee" :key="data.id" :value="data.id">
                                                {{ data.firstName }} {{ data.lastName }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="modal-footer">

                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                        </form>
                        <form @submit.prevent="saveComment">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="field2" class="form-label">Admin Comment</label>
                                        <textarea v-model="commentForm.empComment" class="form-control"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-6 mt-5">
                                    <button class="btn btn-primary" type="submit">
                                        Add Comments
                                    </button>
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Close</button>
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
import { DoughnutChart, LineChart } from "vue-chart-3";
import {
    Chart, ArcElement, Legend, Tooltip, DoughnutController,
    LineController, LineElement, PointElement, CategoryScale, LinearScale
} from "chart.js";

Chart.register(ArcElement, Legend, Tooltip, DoughnutController,
    LineController, LineElement, PointElement, CategoryScale, LinearScale);

export default {
    name: 'TicketList',
    components: {
        LayoutDiv,
        AppLoader,
        DoughnutChart,
        LineChart
    },
    data() {
        return {
            tickets: [],
            listOfEmployee: [],
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            searchQuery: "",
            status: '',
            assignedTo: '',
            comment: '',
            allStatistic: {},
            requestData: 'CREATED',
            isLoading: false,
            activeTab: 'CREATED',
            showEmployeeList: false,
            companyId: localStorage.getItem('companyId'),
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
            commentForm: {
                empComment: ''
            },
            requestFormCode: '',

            tabs: [
                { name: 'ALL', color: 'rgba(255, 99, 132, 0.8)' },
                { name: 'CREATED', color: 'rgba(0, 255, 0, 0.8)' },
                { name: 'ASSIGNED', color: 'rgba(255, 159, 64, 0.8)' },
                { name: 'INPROGRESS', color: 'rgba(54, 162, 235, 0.8)' },
                { name: 'IN-VERIFY', color: 'rgba(75, 192, 192, 0.8)' },
                { name: 'DENY', color: 'rgba(153, 102, 255, 0.8)' },
                { name: 'RE-ASSIGNED', color: 'rgba(255, 159, 64, 0.8)' },
                { name: 'RE-OPENED', color: 'rgba(255, 99, 132, 0.8)' },
                { name: 'CLOSED', color: 'rgba(255, 205, 86, 0.8)' },
                { name: 'REJECTED', color: 'rgba(201, 203, 207, 0.8)' },
                { name: 'DEFERRED', color: 'rgba(75, 192, 192, 0.8)' },
            ],

            doughnutChartData: {
                labels: [], // Use tab labels for chart labels
                datasets: [
                    {
                        label: "# of Votes",
                        data: [], // Initialize with zeros
                        backgroundColor: [],
                        borderColor: ["rgba(255, 99, 132, 1)"],
                        borderWidth: 1,
                    },
                ],
            },
            doughnutChartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
                onClick: (e, elements) => {
                    if (elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const label = this.doughnutChartData.labels[elementIndex];
                        const value = this.doughnutChartData.datasets[0].data[elementIndex];
                        console.log(`Clicked segment: ${label} with value ${value}`);
                        // this.selectedTab = label; // Update the selected tab
                        this.activeTab = label;
                    }
                },
            },
            lineChartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Issues Raised',
                        data: [10, 20, 30, 25, 40, 35, 50, 45, 55, 50, 60, 70], // Example data
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue background color
                        borderColor: 'rgba(54, 162, 235, 1)', // Blue border color
                        fill: false,
                        lineTension: 0,
                        radius: 5,
                    },
                    {
                        label: 'Issues Resolved',
                        data: [5, 15, 20, 20, 30, 25, 40, 35, 45, 40, 50, 60], // Example data
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Green background color
                        borderColor: 'rgba(75, 192, 192, 1)', // Green border color
                        fill: false,
                        lineTension: 0,
                        radius: 5,
                    },
                ],
            },
            lineChartOptions: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
                scales: {
                    x: {
                        type: 'category', // Ensure this is set correctly
                        beginAtZero: true,
                    },
                    y: {
                        type: 'linear', // Ensure this is set correctly
                        beginAtZero: true,
                    },
                },
            },
        };
    },
    created() {
        this.fetchTicketList();
        this.getDashboardStatistics();
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
        isStatusSelectable() {
            return (
                this.requestData === 'CREATED' ||
                this.requestData === 'DENY' ||
                this.requestData === 'FORWARDED' ||
                this.requestData === 'DEFERRED' ||
                this.requestData === 'RE-OPENED'
            );
        },
        onStatusChange() {
            const selectedStatus = this.status;
            this.showEmployeeList =
                this.requestData === 'CREATED' ||
                this.requestData === 'DENY' ||
                this.requestData === 'FORWARDED' ||
                this.requestData === 'DEFERRED' ||
                this.requestData === 'RE-OPENED';

            if (selectedStatus === 'REJECTED' || selectedStatus === 'DEFERRED') {
                this.showEmployeeList = false;
            }
        },
        setActiveTab(tabName) {
            this.activeTab = tabName;
            this.currentPage = 1; // Reset to first page on tab change
            this.fetchTicketList();
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
                    // status: this.activeTab,
                    companyId: this.companyId // or simply companyId if the key and variable name are the same
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
            const payload = {
                status: this.status,
                assignedTo: this.activeTab === 'GENERATED' ? 0 : this.assignedTo,
                comment: this.comment,
                requestFormCode: this.selectedTicket.requestFormCode,
                assignedBy: localStorage.getItem('userId')
            };

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
                axios.post('/api/saveRequestFormTrackingRecord', payload),
                axios.put(`/api/updateStatus?status=${payload.status}&id=${payload.requestFormCode}`)
            ])
                .then(axios.spread(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Status Updated',
                        text: `${payload.status} successfully.`,
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
                    this.updateDoughnutChartData();
                    return response
                })
                .catch(error => {
                    return error
                });
        },
        updateDoughnutChartData() {
            this.doughnutChartData.labels = this.tabs.map(tab => tab.name);
            console.log(this.doughnutChartData.labels)
            this.doughnutChartData.datasets[0].data = this.tabs.map(tab => this.allStatistic[tab.name] || 0);
            console.log(this.doughnutChartData.datasets[0].data)
            this.doughnutChartData.datasets[0].backgroundColor = this.tabs.map(tab => tab.color);
            console.log(this.doughnutChartData.datasets[0].backgroundColor)
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
    },

};
</script>

<style scoped>
.chart-container {
    width: 400px;
    height: 400px;
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