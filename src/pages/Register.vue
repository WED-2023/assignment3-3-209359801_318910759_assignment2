<template>
  <h2 class="mb-4 text-center">Register</h2>
  <div class="container mt-4 register-box" style="max-width: 1000px;">
    <b-form @submit.prevent="handleRegister">

      <!-- Username -->
      <b-form-group label="Username (3-8 letters)">
        <b-form-input
          v-model="bag.username"
          :bag="validations.username.$dirty ? !validations.username.$invalid : null"
          @input="validations.username.$touch()"
        />
        <b-form-invalid-feedback v-if="validations.username.$error">
          <template v-for="error in validations.username.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- First Name -->
      <b-form-group label="First Name">
        <b-form-input
          v-model="bag.firstName"
          :bag="validations.firstName.$dirty ? !validations.firstName.$invalid : null"
          @input="validations.firstName.$touch()"
        />
        <b-form-invalid-feedback v-if="validations.firstName.$error">
          This field is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Last Name -->
      <b-form-group label="Last Name">
        <b-form-input
          v-model="bag.lastName"
          :bag="validations.lastName.$dirty ? !validations.lastName.$invalid : null"
          @input="validations.lastName.$touch()"
        />
        <b-form-invalid-feedback v-if="validations.lastName.$error">
          This field is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Email -->
      <b-form-group label="Email">
        <b-form-input
          type="email"
          v-model="bag.email"
          :bag="validations.email.$dirty ? !validations.email.$invalid : null"
          @input="validations.email.$touch()"
        />
        <b-form-invalid-feedback v-if="validations.email.$error">
          <template v-for="error in validations.email.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Country -->
      <b-form-group label="Country">
        <b-form-select
          v-model="bag.country"
          :options="bag.countries"
          :bag="validations.country.$dirty ? !validations.country.$invalid : null"
          @change="validations.country.$touch()"
        />
        <b-form-invalid-feedback v-if="validations.country.$error">
          Please select a country.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password (5-10 characters, incl. 1 digit & 1 special char)">
        <b-form-input
          :type="showPassword ? 'text' : 'password'"
          v-model="bag.password"
          :bag="validations.password.$dirty ? !validations.password.$invalid : null"
          @input="validations.password.$touch()"
        />
        <b-form-invalid-feedback v-if="validations.password.$error">
          <template v-for="error in validations.password.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Confirm Password -->
      <b-form-group label="Confirm Password">
        <b-form-input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="bag.confirmPassword"
          :bag="validations.confirmPassword.$dirty ? !validations.confirmPassword.$invalid : null"
          @input="validations.confirmPassword.$touch()"
        />
        <b-form-invalid-feedback v-if="validations.confirmPassword.$error">
          <template v-for="error in validations.confirmPassword.$errors" :key="error.$uid">
            <div>{{ error.$message }}</div>
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="info" class="w-100">Register</b-button>

      <!-- Global error/success messages -->
      <div v-if="bag.submitError" class="mt-3 text-danger font-weight-bold">
        {{ bag.submitError }}
      </div>
      <div v-if="bag.successMessage" class="mt-3 text-success font-weight-bold">
        {{ bag.successMessage }}
      </div>

      <div class="mt-3 text-center" >
        Already have an account?
        <router-link to="/login" class="register-link">
        Log in here!
      </router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { reactive, onMounted, ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, email, sameAs, helpers } from '@vuelidate/validators'
import axios from 'axios'
import countries from '../assets/countries'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterPage',
  setup() {
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const router = useRouter()

    const bag = reactive({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: '',
      countries: [],
      submitError: '',
      successMessage: ''
    })

    const passwordValue = computed(() => bag.password)

    const rules = {
      username: {
        required: helpers.withMessage('This field is required.', required),
        minLength: helpers.withMessage('Username must be at least 3 characters.', minLength(3)),
        maxLength: helpers.withMessage('Username cannot be longer than 8 characters.', maxLength(8)),
        onlyLetters: helpers.withMessage(
          'Username must contain English letters only.',
          value => /^[A-Za-z]+$/.test(value)
        )
      },
      firstName: { required },
      lastName: { required },
      email: {
        required: helpers.withMessage('This field is required.', required),
        email: helpers.withMessage('Invalid email address.', email)
      },
      country: { required },
      password: {
        required: helpers.withMessage('This field is required.', required),
        minLength: helpers.withMessage('Password must be at least 5 characters long.', minLength(5)),
        maxLength: helpers.withMessage('Password cannot be longer than 10 characters.', maxLength(10)),
        hasNumber: helpers.withMessage('Password must include at least one digit.', value => /\d/.test(value)),
        hasSpecialChar: helpers.withMessage('Password must include at least one special character.', value => /[!@#$%^&*(),.?":{}|<>]/.test(value))
      },
      confirmPassword: {
        required: helpers.withMessage('This field is required.', required),
        sameAsPassword: helpers.withMessage('Passwords do not match.', sameAs(passwordValue))
      }

    }

    const v$ = useVuelidate(rules, bag)
    const validations = computed(() => v$.value)

    onMounted(() => {
      bag.countries = countries.map(name => ({ value: name, text: name }));
    });

    const handleRegister = async () => {
      console.log('Registering user:', bag.username)
      bag.submitError = ''
      bag.successMessage = ''
      v$.value.$touch()
      if (v$.value.$invalid){
        alert("Invallid input"); return
      }

      try {
        const response = await axios.post('http://localhost:3000/Register', {
          username: bag.username,
          firstname: bag.firstName,
          lastname: bag.lastName,
          email: bag.email,
          country: bag.country,
          password: bag.password
        })
        if (response.status === 201) {
          bag.successMessage = "Registration successful! Redirecting to the login page..."
          setTimeout(() => {
            router.push('/login');
          }, 1500);
        } else {
          bag.submitError = 'Unexpected error during registration.'
        }
      } catch (err) {
        const message = (err.response?.data?.message || '').toLowerCase()
        const status = err.response?.status || ''
        if (status === 409 && message.includes('username')) {
          bag.submitError = 'Username already exists.'
        } else if (status === 409 && message.includes('email')) {
          bag.submitError = 'Email is already registered.'
        } else {
          bag.submitError = 'An unexpected error occurred. Please try again.'
        }
      }
    }

    return {
      bag,
      v$,
      validations,
      handleRegister,
      showPassword,
      showConfirmPassword
    }
  }
}
</script>

<style scoped>
.register-link {
  color: #0d6efd;
  font-weight: 500;
  text-decoration: none;
}
.register-link:hover {
  text-decoration: underline;
}
.b-form-invalid-feedback {
  font-size: 0.9rem;
}
.b-form-group {
  margin-bottom: 1.25rem;
}
.text-success {
  font-size: 1.1rem;
}

.register-box {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
h2 { 
  font-size: 5rem;
  font-weight: 800; 
  color: #f0e8e8; 
}
</style>

