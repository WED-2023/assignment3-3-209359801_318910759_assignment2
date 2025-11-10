<template>
  <div class="container py-4">
    <h2 class="text-center mb-4"> My Favorites Recipes</h2>
    <RecipePreviewList
      v-if="favorites.length > 0"
      :recipes="favorites"
      title="Saved Recipes"
      @update-favorite="handleFavoriteUpdate"
    />
    <div v-else class="text-center mt-3" style="color: #f0e8e8;">
      No saved recipes at the moment.
    </div>
  </div>
</template>

<script>

import RecipePreviewList from '../components/RecipePreviewList.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';


export default {
  name: "FavoritesPage",
  components: {RecipePreviewList },
  setup() {
    const favorites = ref([]);

    const loadFavorites = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/favorites", {
          withCredentials: true,
        });
        favorites.value = res.data;
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    const handleFavoriteUpdate = (recipe_id, isNowFavorite) => {
      if (!isNowFavorite) {
        favorites.value = favorites.value.filter(r => r.id !== recipe_id);
      }
    };

    onMounted(() => {
      loadFavorites();
    });

    return { favorites, handleFavoriteUpdate };
  }
};

</script>

<style scoped>
h2 { 
  font-size: 5rem;
  font-weight: 800; 
  color: #f0e8e8; 
}
</style>