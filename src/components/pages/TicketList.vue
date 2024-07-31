<template>
    <layout-div>
        <div class="container">
            <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Raises Ticket List</h2>
            <div class="card">
                <div class="card-header">
                    <router-link to="/user/create" class="btn btn-outline-primary">
                        Raise New Ticket
                    </router-link>
                </div>
                <div class="card-body">

                    <ul class="nav nav-underline">
                        <li class="nav-item" v-for="tab in tabs" :key="tab.name">
                            <a class="nav-link m-2" :class="{ active: activeTab === tab.name }"
                                @click="setActiveTab(tab.name)" href="#">
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
                                <th>Expected Delivery Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ticket, i) in filteredTickets" :key="ticket.id">
                            <!-- <tr v-for="(ticket, i) in tickets" :key="ticket.id"> -->
                                <td>{{ i + 1 }}</td>
                                <td>{{ ticket.ticketName }}</td>
                                <td>{{ formatDate(ticket.createdOn) }}</td>
                                <td>{{ ticket.commentBox }}</td>
                                <td :class="getPriorityClass(ticket.priorityName)">
                                    {{ ticket.priorityName }}
                                </td>
                                <td>{{ formatDate(ticket.expectedDeliveryDate) }}</td>
                                <td>
                                    <span class="badge rounded-pill text-white"
                                        :class="{
                                            'bg-warning': ticket.status.toLowerCase() === 'assigned',
                                            'bg-primary': ticket.status.toLowerCase() === 'submitted',
                                            'bg-secondary': ticket.status.toLowerCase() === 'generated',
                                            'bg-success': ticket.status.toLowerCase() === 'approved',
                                            'bg-dark': ticket.status.toLowerCase() === 'rejected',
                                            'bg-danger': ticket.status.toLowerCase() === 'cancelled'
                                        }">{{ ticket.status }}
                                    </span>
                                </td>
                                <td>
                                    <!-- <router-link :to="`/show/${ticket.id}`"
                                        class="btn btn-outline-info mx-1">Show</router-link> -->
                                    <router-link>
                                        <i class="bi bi-pencil-fill text-primary mx-2"></i>
                                    </router-link>
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
import Swal from 'sweetalert2'
export default {
    name: 'TicketList',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            tickets: [],
            activeTab: 'ALL',
            tabs: [
                { name: 'ALL', label: 'ALL' },
                { name: 'ASSIGNED', label: 'ASSIGNED' },
                { name: 'SUBMITTED', label: 'SUBMITTED' },
                { name: 'GENERATED', label: 'GENERATED' },
                { name: 'APPROVED', label: 'APPROVED' },
                { name: 'REJECTED', label: 'REJECTED' },
                { name: 'CANCELLED', label: 'CANCELLED' },
            ],
            allStatistic: {}
        };
    },
    created() {
        this.fetchTicketList();
        this.getDashboardStatistics();
    },
    computed: {
        filteredTickets() {
            if (this.activeTab === 'ALL') {
                return this.tickets;
            } else {
                return this.tickets.filter(ticket => ticket.status.toUpperCase() === this.activeTab);
            }
        }
    },
    methods: {
        setActiveTab(tabName) {
            this.activeTab = tabName;
        },
        fetchTicketList() {
            axios.get('api/fetchRequestFormRecordsByUserName')
                .then(response => {
                    this.tickets = response.data.data;
                    console.log(this.tickets)
                    return response
                })
                .catch(error => {
                    return error
                });
        },
        getDashboardStatistics() {
            axios.get('api/getDashboardStatistics')
                .then(response => {
                    this.statistic = response.data;
                    const obj = {
                        ...this.statistic,
                        ALL: response.val,
                    };
                    this.allStatistic = obj.data;
                    console.log(this.allStatistic.data)
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