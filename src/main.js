import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRouter, createWebHistory } from 'vue-router';
import LayoutDiv from './components/LayoutDiv.vue';
import MainLayout from './components/MainLayout.vue';
import TicketList from './components/pages/TicketList';
import TicketCreate from './components/pages/TicketCreate';
import TicketEdit from './components/pages/TicketEdit';
import TicketView from './components/pages/TicketView';
import UserRegister from './components/pages/UserRegister';
import UserLogin from './components/pages/UserLogin';
import store from './store'; 
// axios.defaults.baseURL = process.env.VUE_APP_API_URL
// axios.interceptors.request.use(function (config) {
//     config.headers['Authorization'] = `Bearer ${process.env.VUE_APP_API_KEY}`;
//     return config;
// });
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

const routes = [
    {
        path: '/',
        component: LayoutDiv,
        children: [
            { path: '', component: UserLogin },
            { path: 'register', component: UserRegister },
        ]
    },
    {
        path: '/user',
        component: MainLayout,
        children: [
            { path: 'list', component: TicketList },
            { path: 'create', component: TicketCreate },
            { path: 'edit/:id', component: TicketEdit },
            { path: 'view/:id', component: TicketView },
        ],
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// createApp(App).use(router).mount('#app');
const app = createApp(App);
app.use(store);                    // Use the Vuex store
app.use(router);                   // Use Vue Router
app.mount('#app');
