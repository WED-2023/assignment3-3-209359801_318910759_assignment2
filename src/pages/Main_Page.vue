<template>
  <h1 class="title text-center mb-4">Main Recipes Page</h1>
  
    <div class="recipes-wrapper" :class="{ 'one-column': isLoggedIn }">
      <!-- Login Section -->
      <div class="recipes-section" v-if="!isLoggedIn">
        <h4 class="mb-3 text-center">Welcome to Recipes Website</h4>
        <p class="text-center">Please log in or sign up to continue:</p>
        <LoginPage />
      </div>

      <!-- Recipes Section -->
      <div class="recipes-section">
        <h4 class="mb-3 text-center">Recommended Recipes</h4>
        <RecipePreviewList :recipes="randomRecipes" />
        <div class="text-center mt-3">
          <b-button variant="info" class="w-100" @click="loadMoreRandom">Load More Recipes</b-button>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import LoginPage from './Login.vue';
import RecipePreviewList from '../components/Recipes_List.vue';
import axios from 'axios';
import store from '@/store';

export default {
  components: {
    RecipePreviewList,
    LoginPage
  },
  setup() {
    const isLoggedIn = computed(() => !!store.username.value);
    const randomRecipes = ref([]);

    const loadMoreRandom = async () => {
      try {
        const res = await axios.get('http://localhost:3000/recipes', {
          withCredentials: true,
        });
        randomRecipes.value = res.data;
      } catch (err) {
        console.error('Error loading random recipes:', err);
      }
    };

    onMounted(() => {
      loadMoreRandom();
    });

    return { 
      store, 
      loadMoreRandom, 
      randomRecipes, 
      isLoggedIn 
    };
  }
};
</script>

<style scoped>

.recipes-wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: nowrap;
  justify-content: center;
}
.recipes-section {
  flex: 0 0 48%;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 2rem;
  background-color: #fafafa;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}
.one-column .recipes-section {
  flex: 0 0 1000px;       
  max-width: 1000px;
}
.section-title {
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  border-bottom: 2px solid #848892;
  padding-bottom: 0.3rem;
}

@media (max-width: 992px) {
  .recipes-wrapper {
    flex-direction: column;
  }
  .recipes-section {
    flex: 1 1 100%;
  }
}
h1 { 
  font-size: 5rem;
  font-weight: 800; 
  color: #f0e8e8; 
}
/* h3 { 
  font-size: 3rem;
  font-weight: 800; 
  color: #636060; 
} */
</style>