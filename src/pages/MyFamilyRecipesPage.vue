<template>
  <h2 class="text-center mb-4"> My Family Recipes</h2>
    
    <div v-if="familyRecipes.length">
      <div v-for="recipe in familyRecipes" :key="recipe.id" class="recipe-card mb-5">
        <div class="recipe-content">
          <div class="image-column">
            <div class="image-carousel">
              <img
                v-for="(imgSrc, index) in recipe.images"
                :key="index"
                :src="resolveImage(imgSrc)"
                class="recipe-image"
                :alt="`Image ${index + 1} for recipe ${recipe.title}`"
                @error="onImageError($event)"
                loading="lazy"
              />
            </div>
          </div>

          <div class="recipe-details">
            <h5 class="card-title">{{ recipe.title }}</h5>
            <p style="font-size: 1.2rem;"><strong>⏱ Preparation Time:</strong> {{ recipe.readyInMinutes }} minutes</p>
            <p style="font-size: 1.5rem;"><strong>🧾 Ingredients:</strong></p>
            <ul>
              <li v-for="(ingredient, index) in parseIngredients(recipe.extendedIngredients)" :key="index">
                {{ ingredient }}
              </li>
            </ul>
            <p class="instructions" style="font-size: 1.5rem;"><strong>📋 Instructions:</strong></p>
            <ol>
              <li v-for="(step, iIdx) in parseInstructions(recipe.instructions)" :key="iIdx">
                {{ step }}
              </li>
            </ol>
            <p class="author"><strong>👩‍🍳 Family Chef:</strong> {{ recipe.recipeMaster }}</p>
            <p class="season"><strong>🎉 When is it usually eaten?</strong> {{ recipe.timeInYear }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center" style="color: #f0e8e8;">
      <h4>No family recipes found. Please add at least three recipes related to your family</h4>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: "FamilyRecipesPage",
  setup() {
    const familyRecipes = ref([]);

    const normalizeImages = (imageField) => {
      if (!imageField) return [];
      if (typeof imageField === "string") {
        const s = imageField.trim();
        if (s.startsWith("[") || s.startsWith("{")) {
          try {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
            if (parsed?.url || parsed?.src) return [parsed.url || parsed.src];
          } catch {
            return [s];
          }
        }
        return [s];
      }
      if (Array.isArray(imageField)) return imageField.filter(Boolean);
      if (typeof imageField === "object" && (imageField.url || imageField.src))
        return [imageField.url || imageField.src];
      return [];
    };

    const resolveImage = (src) => {
      if (!src) return "/placeholder-recipe.jpg";
      const isAbsolute = /^https?:\/\//i.test(src);
      const clean = String(src).replace(/^\/+/, "");
      return isAbsolute ? src : `/${clean}`;
    };

    const onImageError = (e) => {
      e.target.src = "/placeholder-recipe.jpg";
      e.target.alt = "Default image";
    };

    const loadFamilyRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/user/family", {
          withCredentials: true,
        });
        familyRecipes.value = res.data.map((r, i) => ({
          ...r,
          id: r.recipe_id ?? r.id ?? i,
          images: normalizeImages(r.image),
        }));
        console.log("images:", familyRecipes.value.map(r => r.images));
      } catch (err) {
        console.error("Error loading family recipes:", err);
      }
    };

    const parseIngredients = (raw) => {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [raw];
      } catch (e) {
        return String(raw).split(",").map((s) => s.trim()).filter(Boolean);
      }
    };

    const parseInstructions = (text) => {
      if (!text) return [];
      return String(text)
        .split(/\n|\r|\d+\.\s?/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    };

    onMounted(() => {
      loadFamilyRecipes();
    });

    return {
      familyRecipes,
      parseIngredients,
      parseInstructions,
      resolveImage,
      onImageError,
    };
  },
};
</script>


<style scoped>

.recipe-card{
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(2, 29, 59, 0.06);
  padding: clamp(1rem, 2vw, 2rem);
  transition: transform .2s ease, box-shadow .2s ease;
  border: 1px solid rgba(0,0,0,0.04);
}
.recipe-card:hover{
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(2, 29, 59, 0.08);
}
.recipe-content{
  display: grid;
  grid-template-columns: 220px 1fr;  
  gap: 1.25rem;
  align-items: start;
}
@media (max-width: 992px){
  .recipe-content{ grid-template-columns: 180px 1fr; }
}
@media (max-width: 576px){
  .recipe-content{ grid-template-columns: 1fr; } 
}

.image-column{ width: 100%; }
.image-carousel{
  display: flex;
  flex-direction: column;   
  gap: 12px;
}
.recipe-image{
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: transform .25s ease, box-shadow .25s ease;
  background: #f0f3f7;
}
.recipe-image:hover{
  transform: scale(1.02);
  box-shadow: 0 10px 28px rgba(0,0,0,0.12);
  cursor: zoom-in;
}
.recipe-details{ text-align: left; min-width: 0; }
.recipe-details .card-title{
  font-size: clamp(1.25rem, 1.8vw, 1.6rem);
  font-weight: 800;
  letter-spacing: .2px;
  color: #263238;
  margin-bottom: .75rem;
}
.recipe-details p,
.recipe-details li{ color: #3c4858; }
.recipe-details strong{ color: #2c3e50; font-weight: 800; }
.recipe-details .author{
  display: inline-block;
  background: #ffe6ef;
  color: #9a1b4c;
  border: 1px solid #ffd0e1;
  padding: .35rem .6rem;
  border-radius: 999px;
  margin-top: .5rem;
  font-size: 1rem;
}
.recipe-details .season{
  display: inline-block;
  background: #fff1e0;
  color: #f57c00;
  border: 1px solid #ffd7b0;
  padding: .35rem .6rem;
  border-radius: 999px;
  margin-top: .5rem;
  font-size: 1rem;
}
.recipe-details ul,
.recipe-details ol{
  padding-inline-start: 1.2rem;
  margin: .25rem 0 1rem;
  line-height: 1.8;
}
.recipe-details li + li{ margin-top: .25rem; }

h2{ font-size: 5rem;
  font-weight: 800; 
  color: #f0e8e8;  }

.recipe-image[src*="placeholder-recipe.jpg"]{
  object-fit: contain;
  background: repeating-linear-gradient(
    45deg,
    #f3f4f6,
    #f3f4f6 10px,
    #eef2f7 10px,
    #eef2f7 20px
  );
}
</style>