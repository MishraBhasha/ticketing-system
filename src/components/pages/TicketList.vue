<template>
    <layout-div>
        <div class="container">
            <h2 class="text-center mt-5 mb-3 rounded shadow" :style="{ color: '#060389' }">Ticket Manager</h2>
            <div class="card">
                <div class="card-header">
                    <router-link to="/user/create" class="btn btn-outline-primary">
                        Create New Ticket
                    </router-link>
                </div>
                <div class="card-body">
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
                                    <!-- <router-link :to="`/show/${ticket.id}`"
                                        class="btn btn-outline-info mx-1">Show</router-link> -->
                                    <router-link :to="`/edit/${ticket.id}`">
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
            tickets: []
        };
    },
    created() {
        this.fetchTicketList();
    },
    methods: {
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