<template>
  <div class="container">
    <div v-if="recipe" class="recipe-card animate-fade-in">
      <!-- Title -->
      <h1 class="recipe-title">{{ recipe.title }}</h1>

      <!-- Image -->
      <img :src="recipe.image" class="recipe-image shadow" />

      <!-- Tags -->
      <div class="tags text-center mt-2 mb-3">
        <b-badge v-if="recipe.vegan" variant="success" class="mx-1">🌱 Vegan</b-badge>
        <b-badge v-if="recipe.vegetarian" variant="success" class="mx-1">🥕 Vegetarian</b-badge>
        <b-badge v-if="recipe.glutenFree" variant="warning" class="mx-1">🚫 Gluten‑Free</b-badge>
        <b-badge v-if="recipe.isFavoriteByUser" variant="danger" class="mx-1">❤️ In Favorites</b-badge>
        <b-badge v-if="recipe.isWatched" variant="info" class="mx-1">👁️ Watched Recently</b-badge>
      </div>

      <div class="row recipe-body">
        <!-- Ingredients -->
        <div class="col-md-6 ingredients-box">
          <h4 class="section-title">🧂 Ingredients</h4>
          <p class="info-text">
            For {{ recipe.servings }} servings | Prep time: {{ recipe.readyInMinutes }} minutes
          </p>
          <ul             
            :dir="ingredientsDirection.dir"
            :style="{ textAlign: ingredientsDirection.textAlign }">
            <li v-for="(r, index) in recipe.extendedIngredients" :key="index">
              {{ r.original }}
            </li>
          </ul>
        </div>

        <!-- Instructions -->
        <div class="col-md-6 instructions-box">
          <h4 class="section-title">📖 Instructions</h4>
           <div
            v-html="formattedInstructions.html"
            :dir="formattedInstructions.dir"
            :style="{ textAlign: formattedInstructions.textAlign }"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center my-5 text-muted">
      Loading recipe...
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: null,
    };
  },

  computed: {
    formattedInstructions() {
      if (!this.recipe || !this.recipe.instructions) {
        return { html: '', dir: 'rtl', textAlign: 'right' };
      }

      const raw = this.recipe.instructions.trim();
      console.log(raw);
      const isHebrew = /[\u0590-\u05FF]/.test(raw);
      const dir = isHebrew ? 'rtl' : 'ltr';
      const textAlign = isHebrew ? 'right' : 'left';

      // HTML
      if (/<\/?(ol|ul|li)>/i.test(raw)) {
        const hasNumberedList = /<li>\s*\d+[.)]?\s*/i.test(raw) || /<ol>/i.test(raw);

        // ordered
        if (hasNumberedList) {
          return { html: raw, dir, textAlign };
        }

        // not ordered
        const cleanText = raw.replace(/<\/?[^>]+>/g, '');
        const steps = this.smartSplit(cleanText);
        const html = `<ol>${steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
        return { html, dir, textAlign };
      }

      // regular text
      const lines = raw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      const isNumbered = lines.every(line => /^\d+[.)]\s*/.test(line));

      if (isNumbered) {
        const steps = lines.map(s => s.replace(/^\d+[.)]\s*/, ''));
        const listItems = steps.map(s => `<li>${s}</li>`).join('');
        const html = `<ol>${listItems}</ol>`;
        return { html, dir, textAlign };
      } else {
        const sentences = raw.replace(/<\/?[^>]+>/g, '');
        const steps = this.smartSplit(sentences);
        const html = `<ol>${steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
        return { html, dir, textAlign };
      }
    },

    ingredientsDirection() {
      const ingredientsText = this.recipe.extendedIngredients
        .map(ing => typeof ing.original === 'string' ? ing.original : '')
        .join(' ');

      const isHebrew = /[\u0590-\u05FF]/.test(ingredientsText);
      return {
        dir: isHebrew ? 'rtl' : 'ltr',
        textAlign: isHebrew ? 'right' : 'left'
      };
  }
},

  methods: {
      smartSplit(text) {
      if (text.includes('.')) {
        return text
          .split(/(?<=[.?!])\s+/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
      } else {
        return text
          .split(/\n+/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
      }
    }}, 
  async created() {
    try {
      let response = await this.axios.get(
        this.$root.store.server_domain + "/recipes/search/" + this.$route.params.recipeId
      );

      if (response.status !== 200) {
        this.$router.replace("/NotFound");
        return;
      }

      let {
        title,
        readyInMinutes,
        image,
        vegan,
        vegetarian,
        glutenFree,
        extendedIngredients,
        instructions,
        servings,
        isFavoriteByUser,
        isWatched,
      } = response.data;
      

      this.recipe = {
        title,
        readyInMinutes,
        image,
        vegan,
        vegetarian,
        glutenFree,
        extendedIngredients: Array.isArray(extendedIngredients)
          ? extendedIngredients.map(s =>
              typeof s === "string"
                ? { original: s.replace(/^"+|"+$/g, "").trim() }
                : s
            )
          : [],
        instructions,
        servings,
        isFavoriteByUser,
        isWatched,
      };
    } catch (error) {
      console.error("Error loading recipe", error);
      this.$router.replace("/NotFound");
    }
  },
};
</script>

<style scoped>
.recipe-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  max-width: 900px;
  margin: auto;
}

.recipe-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
}

.recipe-image {
  display: block;
  margin: 0 auto 1rem auto;
  max-width: 70%; 
  border-radius: 0.5rem;
}

.tags {
  font-size: 1rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.3rem;
  margin-bottom: 0.75rem;
}

.info-text {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.75rem;
}

.ingredients-box li {
  line-height: 1.8;
  margin-bottom: 0.6em;
}

.instructions-box p {
  line-height: 1.8;
  margin-bottom: 0.8em;
}


.ingredients-box,
.instructions-box {
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
