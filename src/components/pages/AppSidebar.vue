<template>
    <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
        <ul class="sidebar-menu">
            <!--    <li class="nav-item active">
                <router-link to="/user/list">Ticket List</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/user/create">Create Ticket</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/user/edit">Edit Ticket</router-link>
            </li>
            <li class="nav-item">
                <router-link to="/user/view">View Ticket</router-link>
            </li> -->
            <li class="nav-item" :class="{ active: activePath === '/user/list' }" @click="setActive('/user/list')">
                <router-link to="/user/list" class="nav-link">Ticket List</router-link>
            </li>
            <li class="nav-item" :class="{ active: activePath === '/user/create' }" @click="setActive('/user/create')">
                <router-link to="/user/create" class="nav-link">Create Ticket</router-link>
            </li>
            <li class="nav-item" :class="{ active: activePath === '/user/edit' }" @click="setActive('/user/edit')">
                <router-link to="/user/edit" class="nav-link">Edit Ticket</router-link>
            </li>
            <li class="nav-item" :class="{ active: activePath === '/user/view' }" @click="setActive('/user/view')">
                <router-link to="/user/view" class="nav-link">View Ticket</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'AppSidebar',
    props: {
        isCollapsed: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            activePath: '/user/list'
        };
    },
    methods: {
        setActive(path) {
            this.activePath = path;
        }
    }
};
</script>

<style scoped>
.sidebar {
    margin-top: 75px;
    height: 100%;
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #c5b3e6;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: width 0.3s;
}

.sidebar-collapsed {
    width: 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    padding: 10px 20px;
}

.active {
    background-color: #3f3cfa;
    color: #e3e6e9;
}
</style>