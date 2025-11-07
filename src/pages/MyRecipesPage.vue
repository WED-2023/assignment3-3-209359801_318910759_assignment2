<template>
  <div class="container py-4">
    <h2 class="text-center mb-4"> My Recipes</h2>

    <div v-if="note" class="note">{{ note }}</div>

    <div v-if="myRecipes.length">
      <RecipePreviewList
        :recipes="myRecipes"
        :isShowDelete="true"
        title="Recipes I Created"
        @update-favorite="handleFavoriteUpdate"
        @delete-recipe="handleDeleteRecipe"
      />
    </div>
    <div v-else class="text-center mt-4" style="color: #848892;">
      You haven't created any recipes yet. Try adding one using the "New Recipe" button!
    </div>
  </div>
</template>

<script>
import RecipePreviewList from '../components/RecipePreviewList.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: "MyRecipesPage",
  components: { RecipePreviewList },
  setup() {
    const myRecipes = ref([]);
    const note = ref("");

    const loadMyRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/recipes", {
          withCredentials: true,
        });
        myRecipes.value = res.data;
      } catch (err) {
        console.error("Error loading my recipes:", err);
        showNote("Error loading recipes 😕");
      }
    };

    const showNote = (text, ms = 2500) => {
      note.value = text;
      clearTimeout(showNote.t);
      showNote.t = setTimeout(() => (note.value = ""), ms);
    };

    const handleFavoriteUpdate = (recipe_id, isNowFavorite) => {
      const recipe = myRecipes.value.find(r => r.recipe_id === recipe_id);
      if (recipe) {
        recipe.isFavoriteByUser = isNowFavorite;
      }
    };

    const handleDeleteRecipe = async (recipe_id) => {
      myRecipes.value = myRecipes.value.filter(r => r.recipe_id !== recipe_id);
      showNote("Recipe removed from My Recipes ✅");
      await loadMyRecipes();
    };

    onMounted(() => {
      loadMyRecipes();
    });

    return {
      myRecipes,
      note,
      handleFavoriteUpdate,
      handleDeleteRecipe
    };
  }
};
</script>

<style scoped>

.note {
  background: #f1fff6;
  border: 1px solid #b7e4c7;
  color: #14532d;
  border-radius: 10px;
  padding: .5rem .75rem;
  font-size: .95rem;
  margin-bottom: .75rem;
}
</style>

<style scoped>
h2 { 
  font-size: 5rem;
  font-weight: 800; 
  color: #848892; 
}
</style>