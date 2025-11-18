<template>
  <div class="not-found-container">
    <div class="error-box">
      <h1 class="title">❌ 404 - Page Not Found</h1>
      <p class="subtitle">The address you tried to reach does not exist</p>
    </div>
    <router-link to="/" exact>
      <b-button variant="primary" class="mt-3">Back to Home Page</b-button>
    </router-link>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}

.error-box {
  background-color: #ffe5e5; 
  border: 1px solid #ff4d4d; 
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 400px;
}

.title {
  color: #c0392b; 
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #333;
}
</style>