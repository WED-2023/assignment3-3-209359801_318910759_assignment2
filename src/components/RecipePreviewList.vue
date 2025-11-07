// Refactored build: stylistic changes + UI skin; logic preserved.
<template>
  <div class="recipe-list-container">
    <div class="recipe-grid">
      <RecipePreview
        v-for="r in recipes"
        :key="r.id"
        :recipe="r"
        :isShowDelete="isShowDelete" 
        @update-favorite="(id, isFav) => $emit('update-favorite', id, isFav)"
        @delete-recipe="(id) => $emit('delete-recipe', id)"
        @refresh="$emit('refresh')"
      />
    </div>
  </div>
</template>

<script>
import RecipePreview from './RecipePreview.vue';
export default {
  name: "RecipePreviewList",
  components: { RecipePreview },
  props: {
    recipes: { type: Array, required: true },
    isShowDelete: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
.recipe-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}
</style>