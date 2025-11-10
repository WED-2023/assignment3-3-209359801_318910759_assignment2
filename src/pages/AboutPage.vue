<template>
  <h1 class="mb-4 text-center">About Our Project</h1>
  <div class="container py-5">
    <p class="lead text-center">
      The recipe search website was developed during the course "Web Development Environment" as a final project, which included the development of both server and client sides, as well as a database setup. The website allows searching for recipes by ID, creating new recipes, and more.
    </p>
    <p class="text-center">
      The project was created by two reservists who served over 300 days inside the Gaza Strip, even during their active duty in the "Iron Swords" war, driven by their love for programming.
    </p>
    <div class="mt-4">
      <h3 class="text-center mb-3">Previous course exercises (the space shooter game is amazing and we plan to improve it further)</h3>
      <ul class="list-group list-group-flush mx-auto" style="max-width: 1000px;">
        <li class="list-group-item">
          <a href="https://wed-2023.github.io/209359801/" target="_blank">Exercise 1 - Yehonatan Segal</a>
        </li>
        <li class="list-group-item">
          <a href="https://wed-2023.github.io/318910759/" target="_blank">Exercise 1 - Omer Onn</a>
        </li>
        <li class="list-group-item">
          <a href="https://wed-2023.github.io/assignment2-209359801_318910759_assignment2/" target="_blank">Exercise 2 - Space Shooter Game</a>
        </li>
        <li class="list-group-item">
          <a href="/openapi-finalAPI.yaml" target="_blank">Exercise 3.1 - API Documentation (YAML)</a>
        </li>
        <li class="list-group-item">
          <a href="https://github.com/WED-2023/assignment3-2-209359801_318910759_assignment2" target="_blank">Exercise 3.2 - Backend Project</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage"
};
</script>


<style scoped>

.container{
  max-width: 950px;    /* מקסימום רוחב חדש — שנה לפי הצורך */
  width: 92%;          /* רוחב יחסית למכשיר */
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
h1 {
  font-size: 5rem;
  font-weight: 800; 
  color: #f0e8e8; 
}
a {
  font-size: 1.2rem;
  font-weight: 500;
  color: #848892;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>


