<template>
    <div class="sidebar">
        <ul class="sidebar-menu">
            <li>
                <router-link to="/user/list">Ticket List</router-link>
            </li>
            <li>
                <router-link to="/user/create">Create Ticket</router-link>
            </li>
            <li>
                <router-link to="/user/edit">Edit Ticket</router-link>
            </li>
            <li>
                <router-link to="/user/view">View Ticket</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'AppSidebar',
};
</script>

<style scoped>
.sidebar {
    height: 100%;
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #c5b3e6;
    padding: 15px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
    list-style: none;
    padding: 0;
}

.sidebar-menu li {
    margin: 10px 0;
}

.sidebar-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
}

.sidebar-menu a:hover {
    color: #007bff;
}
</style>