<template>
    <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
        <ul class="sidebar-menu">
            <template v-if="role === 'ADMIN'">
                <li class="nav-item" :class="{ active: activePath === '/user/list' }" @click="setActive('/user/list')">
                    <router-link to="/user/admin/list" class="nav-link">Dashboard</router-link>
                </li>
                <!-- <li class="nav-item" :class="{ active: activePath === '/user/create' }"
                    @click="setActive('/user/create')">
                    <router-link to="/user/create" class="nav-link">Raise a Ticket</router-link>
                </li> -->
            </template>

            <template v-if="role === 'Employee'">
                <li class="nav-item" :class="{ active: activePath === '/user/list' }" @click="setActive('/user/list')">
                    <router-link to="/user/list" class="nav-link">Dashboard</router-link>
                </li>
                <!-- <li class="nav-item" :class="{ active: activePath === '/user/create' }"
                    @click="setActive('/user/create')">
                    <router-link to="/user/create" class="nav-link">Raise a Ticket</router-link>
                </li> -->
            </template>

            <template v-if="role === 'user'">
                <li class="nav-item" :class="{ active: activePath === '/user/list' }" @click="setActive('/user/list')">
                    <router-link to="/user/list" class="nav-link">Dashboard</router-link>
                </li>
                <li class="nav-item" :class="{ active: activePath === '/user/create' }"
                    @click="setActive('/user/create')">
                    <router-link to="/user/create" class="nav-link">Raise a Ticket</router-link>
                </li>
            </template>
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
            activePath: '/user/list',
            role: localStorage.getItem('role')
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
    overflow: hidden;
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
    font-weight: bold;
    background-color: #060389;
    color: rgb(255, 255, 255);
}

.nav-link {
    display: block;
    color: inherit;
    text-decoration: none;
}

.nav-link.active {
    color: rgb(255, 255, 255);
}
</style>