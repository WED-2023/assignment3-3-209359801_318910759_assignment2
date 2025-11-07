<template>
  <div id="app" dir="ltr">
    <b-navbar toggleable="lg" type="dark" variant="dark" class="main-navbar">
      <!-- Brand -->
      <b-navbar-brand :to="{ name: 'main' }" class="brand">
        Recipes
      </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" />
        
        <b-collapse id="nav-collapse" is-nav class="w-100">

          <b-navbar-nav class="align-items-center w-100">
          <!-- Primary links -->
          <router-link class="nav-link" :to="{ name: 'main' }">
            <i class="bi bi-house"></i> Home
          </router-link>
          <router-link class="nav-link" :to="{ name: 'search' }">
            <i class="bi bi-search"></i> Search
          </router-link>
          <router-link class="nav-link" :to="{ name: 'about' }">
            <i class="bi bi-info-circle"></i> About
          </router-link>

          <!-- Spacer -->
          <div class="flex-fill"></div>

          <!-- User area -->
          <template v-if="!isLoggedIn">
            <b-navbar-text class="text-light mx-2">Hello, Guest</b-navbar-text>
            <router-link class="nav-link" :to="{ name: 'login' }">
              <i class="bi bi-box-arrow-in-right"></i> Login
            </router-link>
            <router-link class="nav-link" :to="{ name: 'register' }">
              <i class="bi bi-person-plus"></i> Register
            </router-link>
          </template>

          <template v-else>
          <b-navbar-text class="user-greeting mx-2">
            Hello {{ store.username }} ! &nbsp;
          </b-navbar-text>
            <div
              class="position-relative"
              @click.stop="toggleDropdown"
              style="cursor: pointer; color: white;"
              aria-label="Personal Area"
            >
              Personal Area ▼
              <transition name="fade-slide">
                <div
                  v-show="isShowDropdown"
                  class="custom-dropdown"
                  @click.stop
                >
                <router-link class="dropdown-link" :to="{ name: 'favorites' }" @click="closeDropdown">
                   My Favorites
                </router-link>
                <router-link class="dropdown-link" :to="{ name: 'myRecipes' }" @click="closeDropdown">
                   My Recipes
                </router-link>
                <router-link class="dropdown-link" :to="{ name: 'familyRecipes' }" @click="closeDropdown">
                   My Family Recipes
                </router-link>

                </div>
              </transition>
            </div>

            <b-nav-item @click="showCreateModal = true">
               New Recipe
               
            </b-nav-item>
            <b-nav-item @click="logout">
               Logout
            </b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <CreateRecipeModal v-model:show="showCreateModal" />

    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance, ref, computed, onMounted, onUnmounted } from 'vue';
import CreateRecipeModal from '@/components/CreateRecipeModal.vue';
import store from '@/store';
import axios from 'axios';

export default {
  name: "App",
  components: { CreateRecipeModal },
  setup() {
    const internalInstance = getCurrentInstance();
    const router = internalInstance.appContext.config.globalProperties.$router;
    const isLoggedIn = computed(() => !!store.username.value);
    const showCreateModal = ref(false);
    const isShowDropdown = ref(false);

    const toggleDropdown = () => {
      isShowDropdown.value = !isShowDropdown.value;
    };

    const closeDropdown = () => {
      isShowDropdown.value = false;
    };

    const logout = async () => {
      store.logout();
      await axios.post('http://localhost:3000/Logout', {}, { withCredentials: true });
      router.push({ name: 'login', query: { logout: '1' } }).catch(() => {});
    };


    onMounted(() => {
      document.addEventListener('click', closeDropdown);
    });
    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown);
    });

    return {
      store,
      logout,
      showCreateModal,
      isLoggedIn,
      isShowDropdown,
      toggleDropdown,
      closeDropdown,
    };
  }
};

</script>
<style lang="scss">
@import '@/scss/form-style.scss';

#app {
  font-family: 'Poppins', sans-serif; // Modern, clean font
  min-height: 100vh;
  color: #b0b0c5; // Darker, richer text color
}

/* Navbar */
.main-navbar {
  background: linear-gradient(90deg, #2c3e50 0%, #3498db 100%); // More professional gradient
  padding: 0.7rem 1.8rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}

.brand {
  font-size: 1.4rem;
  font-family: 'Montserrat', sans-serif; // Different font for brand
  font-weight: 600;
  color: #ecf0f1 !important;
}

.nav-link {
  color: #ecf0f1 !important;
  margin: 0 0.8rem;
  font-weight: 500;
  position: relative;
  transition: color 0.3s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #3498db; // Highlight color
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.custom-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  min-width: 220px;
  padding: 0.7rem 0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  text-align: center;
}

.dropdown-link {
  display: block;
  padding: 0.5rem 0;
  color: #2c3e50;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    background-color: #f8f9fa;
    color: #3498db;
  }
}

.custom-dropdown::before {
  content: "";
  position: absolute;
  top: -8px;
  right: 1.5rem;
  border-width: 0 8px 8px 8px;
  border-style: solid;
  border-color: transparent transparent #ffffff transparent;
  filter: drop-shadow(0 -2px 2px rgba(0,0,0,0.05));
}

body {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  line-height: 1.8;
  color: #2c3e50;
  background: url('~@/assets/back.png') no-repeat center center fixed;
  //  linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
  background-size: cover;
  background-attachment: fixed;
  position: relative;
  
}

.user-greeting {
  color: #fff;
  background-color: rgba(52, 152, 219, 0.2);
  padding: 6px 15px;
  border-radius: 12px;
  font-weight: 500;
  display: inline-block;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  backdrop-filter: blur(5px);
}

// Animation adjustments
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>