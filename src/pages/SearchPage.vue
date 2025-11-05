<template>
  <div class="container">
    <h1 class="title text-center mb-4">Recipe Search</h1>

    <b-card class="p-4 mx-auto search-form mt-4">
      <b-form @submit.prevent="searchRecipes">
        <!-- First row -->
        <b-row class="mb-3">
          <b-col md="6">
            <div class="form-floating-vue">
              <b-form-input
                v-model="query.title"
                placeholder=" "
              />
              <label>Recipe Name</label>
            </div>
          </b-col>
          <b-col md="3">
            <div class="form-floating-vue">
              <b-form-select
                v-model="query.limit"
                :options="limitOptions"
                placeholder=" "
              />
              <label>Number of Results</label>
            </div>
          </b-col>
          <b-col md="3">
            <b-button
              variant="outline-secondary"
              size="sm"
              @click="showFilters = !showFilters"
              class="w-100"
              style="height:38px;"
            >
              <b-icon icon="funnel" class="me-1"></b-icon>
              {{ showFilters ? 'Hide Advanced' : 'Advanced Filters' }}
            </b-button>
          </b-col>
        </b-row>

        <!-- Filters row -->
        <transition name="fade">
          <b-row v-show="showFilters" class="mb-3">
            <b-col md="4">
              <div class="form-floating-vue">
                <b-form-select
                  v-model="query.cuisine"
                  :options="cuisineOptions"
                  placeholder=" "
                />
                <label>Cuisine</label>
              </div>
            </b-col>
            <b-col md="4">
              <div class="form-floating-vue">
                <b-form-select
                  v-model="query.diet"
                  :options="dietOptions"
                  placeholder=" "
                />
                <label>Diet</label>
              </div>
            </b-col>
            <b-col md="4">
              <div class="form-floating-vue">
                <b-form-select
                  v-model="query.intolerance"
                  :options="intoleranceOptions"
                  placeholder=" "
                />
                <label>Intolerance</label>
              </div>
            </b-col>
          </b-row>
        </transition>

        <!-- Search button -->
        <b-row>
          <b-col>
            <b-button type="submit" variant="primary" class="search-button w-100">
              Search
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card>

    <!-- Results -->
    <div v-if="recipes && recipes.length > 0" class="mt-4">
      <h3 class="text-center mb-3">Search Results</h3>
      <RecipePreviewList :recipes="recipes" @refresh="searchRecipes" />
    </div>

    <div v-else-if="searched && recipes && recipes.length === 0" class="text-center mt-3">
      <p class="text-danger">No results found</p>
    </div>
  </div>
</template>

<script>
import RecipePreviewList from '@/components/RecipePreviewList.vue';

export default {
  name: "SearchPage",
  components: { RecipePreviewList },
  data() {
    return {
      limitOptions: [
        { value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 15, text: '15' }
      ],
      recipes: [],
      searched: false,
      showFilters: false,
      query: {
        title: '',
        cuisine: '',
        diet: '',
        intolerance: '',
        limit: 5
      },
      cuisineOptions: [
        '', 'African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
        'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish',
        'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean',
        'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'
      ],
      dietOptions: [
        '', 'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
        'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Low FODMAP', 'Whole30'
      ],
      intoleranceOptions: [
        '', 'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame',
        'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
      ]
    };
  },
  methods: {
    async searchRecipes() {
      console.log("searchRecipes invoked");
      try {
        const params = {
          query: this.query.title,
          cuisine: this.query.cuisine,
          diet: this.query.diet,
          intolerance: this.query.intolerance,
          limit: this.query.limit
        };
        const response = await this.axios.get(this.$root.store.server_domain + '/recipes/search', { params });
        console.log("Recipes:", response.data);
        this.recipes = response.data;
      } catch (error) {
        console.error('Error performing search:', error);
      } finally {
        this.searched = true;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 2rem;
  padding-bottom: 2rem;
  max-width: 900px;
}

.search-form {
  max-width: 850px;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.search-button {
  font-size: 1.1rem;
}

.filter-toggle-btn {
  font-size: 0.9rem;
  padding: 0.4rem 0.6rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.form-floating-vue {
  position: relative;
  margin-bottom: 1.5rem;
}
.form-floating-vue label {
  position: absolute;
  top: 0.65rem;
  right: 0.75rem;
  color: #777;
  pointer-events: none;
  transition: all 0.2s ease;
  font-size: 1rem;
}
.form-floating-vue input:focus + label,
.form-floating-vue input:not(:placeholder-shown) + label,
.form-floating-vue select:focus + label,
.form-floating-vue select:not([value=""]) + label {
  top: -0.6rem;
  right: 0.65rem;
  background: #fff;
  padding: 0 0.3rem;
  font-size: 0.8rem;
  color: #333;
}
</style>