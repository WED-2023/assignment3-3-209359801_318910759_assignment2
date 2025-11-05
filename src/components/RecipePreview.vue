<template>
  <div @click="handleClick" class="card-link">
    <div class="recipe-card-horizontal d-flex align-items-center">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="recipe-image-horizontal"
        alt="Recipe image"
      />

      <div class="recipe-details flex-grow-1 pe-3">
        <h5 class="card-title mb-2">{{ recipe.title }}</h5>
        <p class="card-text">⏱ Prep time: {{ recipe.readyInMinutes }} minutes</p>

        <div class="badges d-flex flex-wrap mb-2">
          <b-badge v-if="recipe.vegetarian" variant="success" class="badge-item">Vegetarian</b-badge>
          <b-badge v-if="recipe.vegan" variant="success" class="badge-item">Vegan</b-badge>
          <b-badge v-if="recipe.glutenFree" variant="warning" class="badge-item">Gluten‑Free</b-badge>
          <!-- <b-badge v-if="recipe.isWatched" variant="info" class="badge-item">Watched</b-badge> -->
          <b-badge v-if="isFavorite" variant="danger" class="badge-item"> Favorite</b-badge>
        </div>

        <div v-if="isLoggedIn">
          <b-button
            v-if="!isFavorite"
            variant="outline-danger"
            size="sm"
            @click.stop="markAsFavorite"
          >
          Add to Favorites
          </b-button>
          <b-button
            v-else
            variant="outline-secondary"
            size="sm"
            @click.stop="removeFromFavorites"
          >
          Remove from Favorites
          </b-button>

          <b-button
            v-if="isShowDelete"
            variant="outline-secondary"
            size="sm"
            @click.stop="removeFromMyRecipe"
          >          
          Remove Recipe
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import { computed, ref } from 'vue';

export default {
  name: "RecipePreview",
  props: {
    recipe: { type: Object, required: true },
    isShowDelete: { type: Boolean, default: false }
  },
  setup(props) {
    const isLoggedIn = computed(() => !!store.username.value);
    const isFavorite = ref(props.recipe.isFavoriteByUser || false);
    const showDeleteBtn = computed(() => props.isShowDelete);
    return { isLoggedIn, isFavorite, showDeleteBtn };
  },
  methods: {
    async handleClick() {
      try {
        await this.axios.post(
          `${this.$root.store.server_domain}/user/search`,
          { recipeID: this.recipe.id },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Error marking as watched:", err);
      }
      this.$router.push({ name: "recipe", params: { recipeId: this.recipe.id } });
    },
    async markAsFavorite() {
      try {
        await this.axios.post(
          `${this.$root.store.server_domain}/user/favorites`,
          { recipeID: this.recipe.id },
          { withCredentials: true }
        );
        this.isFavorite = true;
        this.$emit("update-favorite", this.recipe.id, true);
      } catch (err) {
        console.error("Error adding to favorites:", err);
      }
    },
    async removeFromFavorites() {
      try {
        await this.axios.delete(
          `${this.$root.store.server_domain}/user/favorites/${this.recipe.id}`,
          { withCredentials: true }
        );
        this.isFavorite = false;
        this.$emit("update-favorite", this.recipe.id, false);
        this.$emit("refresh");
      } catch (err) {
        console.error("Error removing from favorites:", err);
      }
    },
    async removeFromMyRecipe() {
      try {
        await this.axios.delete(
          `${this.$root.store.server_domain}/user/recipes/${String(this.recipe.id).replace("U_", "")}`,
          { withCredentials: true }
        );
        this.$emit("delete-recipe", this.recipe.id);
        this.$emit("refresh");
      } catch (err) {
        console.error("Error deleting recipe:", err);
      }
    }
  }
};
</script>

<style scoped>
.recipe-card-horizontal {
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  background: #fff;
  min-height: 150px; 
}

.recipe-card-horizontal:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.recipe-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
}

.recipe-image-horizontal {
  width: 120px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.card-title {
  font-weight: 700;       
  font-size: 1.15rem;    
  color: #222;           
}

.card-text {
  font-size: 0.95rem;
  color: #555;
}

.recipe-details b-button {
  font-weight: 600;
}

.badges {
  gap: 0.4rem;
  flex-wrap: wrap;
}

.badge-item {
  font-size: 0.85rem;   
}

@media (max-width: 576px) {
  .recipe-card-horizontal {
    flex-direction: column;
    align-items: flex-start;
  }
  .recipe-image-horizontal {
    width: 100%;
    height: 150px;
    margin-bottom: 0.5rem;
  }
  .recipe-details {
    width: 100%;
  }
}
</style>
