// src/store.js
import { ref } from 'vue';

const username = ref(localStorage.getItem('username'));

const store = {
  username,
  server_domain: "http://localhost:3000",

  login(name) {
    localStorage.setItem('username', name);
    username.value = name;
  },

  logout() {
    localStorage.removeItem('username');
    username.value = null;
  }
};

export default store;