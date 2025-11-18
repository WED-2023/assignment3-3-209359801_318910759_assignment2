<template>
  <b-modal
    :model-value="show"
    @update:model-value="onUpdateShow"
    title="Create New Recipe"
    hide-footer
    size="md"
    content-class="custom-modal-content"
    body-class="custom-modal-body"
  >
    <b-form @submit.prevent="submitRecipe">

      <!-- Recipe Name -->
      <b-form-group label="Recipe Name">
        <b-form-input
          v-model="form.title"
          :bag="getValidationState(v$.title)"
          @blur="v$.title.$touch"
        />
        <b-form-invalid-feedback v-if="v$.title.$error">
          This field is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Preparation Time -->
      <b-form-group label="Preparation Time (minutes)">
        <b-form-input
          v-model.number="form.readyInMinutes"
          type="number"
          min="1"
          :bag="getValidationState(v$.readyInMinutes)"
          @blur="v$.readyInMinutes.$touch"
        />
        <b-form-invalid-feedback v-if="v$.readyInMinutes.$error">
          Please enter a number greater than 0.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Image -->
      <b-form-group label="Image (URL)">
        <b-form-input
          v-model="form.image"
          type="text"
          :bag="getValidationState(v$.image)"
          @blur="v$.image.$touch"
        />
        <b-form-invalid-feedback v-if="v$.image.$error">
          Please enter a valid URL.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Dietary Attributes -->
      <b-form-group label="Dietary Attributes">
        <div class="d-flex flex-wrap gap-3">
          <b-form-checkbox v-model="form.vegan">Vegan</b-form-checkbox>
          <b-form-checkbox v-model="form.vegetarian">Vegetarian</b-form-checkbox>
          <b-form-checkbox v-model="form.glutenFree">Gluten-Free</b-form-checkbox>
        </div>
      </b-form-group>

      <!-- Ingredients -->
      <b-form-group label="Ingredients List">
        <b-form-textarea
          v-model="form.extendedIngredients"
          rows="3"
          :bag="getValidationState(v$.extendedIngredients)"
          @blur="v$.extendedIngredients.$touch"
          placeholder="Separate with commas (,)"
        />
        <b-form-invalid-feedback v-if="v$.extendedIngredients.$error">
          This field is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Instructions -->
      <b-form-group label="Preparation Instructions">
        <b-form-textarea
          v-model="form.instructions"
          rows="4"
          :bag="getValidationState(v$.instructions)"
          @blur="v$.instructions.$touch"
        />
        <b-form-invalid-feedback v-if="v$.instructions.$error">
          This field is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Servings -->
      <b-form-group label="Number of Servings">
        <b-form-input
          v-model.number="form.servings"
          type="number"
          min="1"
          :bag="getValidationState(v$.servings)"
          @blur="v$.servings.$touch"
        />
        <b-form-invalid-feedback v-if="v$.servings.$error">
          Please enter a number greater than 0.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Success/Error Messages -->
      <div v-if="bag.successMessage" class="alert alert-success mt-3 text-center">
        {{ bag.successMessage }}
      </div>

      <div v-if="bag.submitError" class="alert alert-danger mt-3 text-center">
        {{ bag.submitError }}
      </div>

      <div class="button-row">
        <b-button variant="danger" @click="onUpdateShow(false)">Cancel</b-button>
        <b-button type="submit" variant="info">Save Recipe</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import { reactive, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, url } from '@vuelidate/validators';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: "CreateRecipeModal",
  props: {
    show: Boolean,
  },
  emits: ["update:show"],
  setup(props, { emit }) {
    const router = useRouter();

    const form = reactive({
      title: "",
      readyInMinutes: 1,
      image: "",
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      extendedIngredients: "",
      instructions: "",
      servings: 1,
    });

    const rules = {
      title: { required },
      readyInMinutes: { required, minValue: minValue(1) },
      image: { required, url },
      extendedIngredients: { required },
      instructions: { required },
      servings: { required, minValue: minValue(1) },
    };

    const v$ = useVuelidate(rules, form);

    const bag = reactive({
      successMessage: "",
      submitError: "",
    });

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const submitRecipe = async () => {
      console.log("Submitting recipe with data:", form);
      const valid = await v$.value.$validate();
      console.log("Validation result:", valid, v$.value);
      // if (!valid) return;

      try {
        bag.successMessage = "";
        bag.submitError = "";

        const payload = { ...form };
        console.log("Payload to be sent:", payload);
        let response = await axios.post("http://localhost:3000/user/recipes/", payload, {
          withCredentials: true,
        });
        console.log("Recipe created successfully:", response.data);

        bag.successMessage = "Recipe saved successfully!";
        // setTimeout(() => {
        //   emit("update:show", false);
        //   router.push({ name: "myRecipes" });
        // }, 1500);
        emit("update:show", false);
        router.push({ name: "myRecipes" });
      } catch (err) {
        console.error("Error creating recipe:", err?.response?.data || err.message || err);
        bag.submitError = "An error occurred while saving the recipe.";
      }
    };

    const onUpdateShow = (val) => {
      emit("update:show", val);
      if (!val) {
        v$.value.$reset();
        Object.assign(form, {
          title: "",
          readyInMinutes: 1,
          image: "",
          vegan: false,
          vegetarian: false,
          glutenFree: false,
          extendedIngredients: "",
          instructions: "",
          servings: 1,
        });
        bag.successMessage = "";
        bag.submitError = "";
      }
    };

    watch(() => props.show, (newVal) => {
      if (!newVal) {
        v$.value.$reset();
      }
    });

    return { form, bag, submitRecipe, v$, getValidationState, onUpdateShow };
  },
};
</script>


<style>
.modal-dialog {
  max-width: 500px !important;
  margin: 15vh auto !important;
}

.modal-header {
  background: linear-gradient(90deg, #06bedf);
  font-weight: 600;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.modal-content .modal-body {
  max-height: 65vh !important;
  overflow-y: auto !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.modal-content .modal-body {
  direction: ltr !important;
  text-align: left !important;
}

.modal-content {
  border: 1px solid #9a9595 !important;
  border-radius: 0.7rem !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
}

.button-row {
  display: flex;
  justify-content: center; 
  gap: 1rem;              
  margin-top: 1.5rem;    
}


</style>