import { createApp, reactive } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import {
  BNavbar,
  BNavbarBrand,
  BNavbarToggle,
  BNavbarNav,
  BNavbarText,
  BCollapse,
  BNavItem,
  BNavItemDropdown,
  BDropdownItem,
  BContainer,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BFormSelect,
  BFormInvalidFeedback,
  BButton,
  BAlert
} from 'bootstrap-vue-3';
import Vuelidate from '@vuelidate/core';


// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Shared store
const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: 'http://localhost:3000',
  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log('login', this.username);
  },
  logout() {
    console.log('logout');
    localStorage.removeItem('username');
    this.username = undefined;
  },
});


// Axios interceptors
axios.interceptors.request.use((config) => config, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));
axios.defaults.withCredentials = true;

// Create app
const app = createApp(App);

// Plugins
app.use(router);
app.use(VueAxios, axios);
app.use(BootstrapVue3);
app.use(Vuelidate); 

// Register global BootstrapVue3 components
app.component('BContainer', BContainer);
app.component('BRow', BRow);
app.component('BCol', BCol);
app.component('BForm', BForm);
app.component('BFormGroup', BFormGroup);
app.component('BFormInput', BFormInput);
app.component('BFormSelect', BFormSelect);
app.component('BFormInvalidFeedback', BFormInvalidFeedback);
app.component('BButton', BButton);
app.component('BAlert', BAlert);
app.component('BNavbar', BNavbar);
app.component('BNavbarBrand', BNavbarBrand);
app.component('BNavbarToggle', BNavbarToggle);
app.component('BNavbarNav', BNavbarNav);
app.component('BNavbarText', BNavbarText);
app.component('BCollapse', BCollapse);
app.component('BNavItem', BNavItem);
app.component('BNavItemDropdown', BNavItemDropdown);
app.component('BDropdownItem', BDropdownItem);

// Global store
// app.config.globalProperties.store = store;
app.config.globalProperties.$store = store;
// Mount app
app.mount('#app');

