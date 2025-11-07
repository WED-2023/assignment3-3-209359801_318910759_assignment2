<template>
  <div class="container mt-5 login-container" style="max-width: 500px;" dir="ltr">
    <h2 class="mb-4 text-center">Login</h2>
    <b-form @submit.prevent="login">

      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="bag.username"
          @input="hideLogoutMessage"
          placeholder="Insert Username"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          You must put Username!
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="bag.password"
          @input="hideLogoutMessage"
          placeholder="Insert Password 🔒"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          You must put Password!
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" class="w-100">login</b-button>

      <!-- Log Out -->
      <div
        v-if="logoutSuccess"
        class="alert alert-info mt-3 text-center"
        role="alert"
      >
        Logout success
      </div>

      <!-- Login failed -->
      <div
        v-if="bag.invalidCredentials"
        class="alert alert-danger mt-3 text-center"
        role="alert"
      >
        Username or Password inccorect!
      </div>

      <!-- Login success-->
      <div
        v-if="bag.loginSuccess"
        class="alert alert-success mt-3 text-center"
        role="alert"
      >
        Login success
      </div>

      <!-- failed massage -->
      <div
        v-if="bag.submitError"
        class="alert alert-danger mt-3 text-center"
        role="alert"
      >
         Login failed : {{ bag.submitError }}
      </div>
    </b-form>

    <!-- Register link -->
    <div class="mt-3 text-center">
      Want to register?
      <router-link to="/register" class="register-link">
        Press here!
      </router-link>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import store from '../store';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const bag = reactive({
      username: '',
      password: '',
      submitError: null,
      invalidCredentials: false,
      loginSuccess: false,
      hideLogoutSuccess: false
    });

    const logoutSuccess = computed(() => route.query.logout === '1' && !bag.hideLogoutSuccess);

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, bag);

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const hideLogoutMessage = () => {
      bag.hideLogoutSuccess = true;
    };

    const login = async () => {
      bag.invalidCredentials = false;
      bag.submitError = null;
      bag.loginSuccess = false;

      const valid = await v$.value.$validate();
      if (!valid) return;

      try {
        await axios.post('http://localhost:3000/Login', {
          username: bag.username,
          password: bag.password,
        });

        bag.loginSuccess = true;

        setTimeout(() => {
          store.login(bag.username);
          router.push('/');
        }, 1500);
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 401) {
          bag.invalidCredentials = true;
        } else if (message) {
          bag.submitError = message;
        } else {
          bag.submitError = 'Try again';
        }
      }
    };

    return {
      bag,
      v$,
      login,
      getValidationState,
      logoutSuccess,
      hideLogoutMessage
    };
  },
};
</script>

<style scoped>
.login-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Heebo', sans-serif;
}
.register-link {
  color: #0d6efd;
  font-weight: 500;
  text-decoration: none;
}
.register-link:hover {
  text-decoration: underline;
}

</style>

<style scoped>
h2 { 
  font-weight: 800; 
  color: #848892; 
}
</style>