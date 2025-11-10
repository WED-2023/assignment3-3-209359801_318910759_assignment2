# Recipes Web App — Frontend

Small Vue 3 frontend for the Recipes project (course assignment).  
Implements search, recipe view, favorites, create recipe modal, register/login and basic pages. Connects to a local Node/Express backend.

## Prerequisites
- Node.js (>=16)
- npm
- Backend running (default: `http://localhost:3000`)

## Quick start
1. Install dependencies
   ```
   npm install
   ```
2. Run dev server (hot reload)
   ```
   npm run serve
   ```
3. Build for production
   ```
   npm run build
   ```
4. Lint
   ```
   npm run lint
   ```

## Configuration
- Backend base URL is defined in the app store (check `src/store.js` or where `server_domain` is set). Update it if your backend runs elsewhere.
- Many requests use `withCredentials: true` — ensure backend CORS allows credentials and correct origin.

## Important API endpoints (backend)
- `GET /recipes` — list of full recipe objects
- `GET /recipes/info/:id` — full recipe details for a single ID
- `GET /user/favorites` — returns array of favorite recipe IDs for current session
- `POST /user/favorites` — mark recipe as favorite (payload: `{ recipe_id }`)

Note: `/user/favorites` returns IDs only; frontend fetches full details separately (e.g. `/recipes/info/:id`) before rendering favorites.

## Common issues & tips
- Favorites show empty list: inspect browser Console / Network. Ensure `GET /user/favorites` returns IDs and subsequent `/recipes/info/:id` calls succeed.
- Missing `recipe_id` on route push: make sure recipe objects passed to `RecipePreviewList` include an `id` or `recipe_id` field used by the router.
- CORS / credentials: server must set `Access-Control-Allow-Credentials: true` and allow the frontend origin.
- Background image cropping: use `background-size: contain` or render an `<img>` with `object-fit: contain` to show full image.
- WebSocket errors: verify ws server address and port, and that the server is listening on `/ws`.

## Development notes
- Components: `src/components/RecipePreview.vue`, `RecipePreviewList.vue`, `CreateRecipeModal.vue`
- Pages: `src/pages/*` (Main, Search, RecipeView, MyFavoritePage, MyRecipesPage, MyFamilyRecipesPage, Register, Login, About)
- Global styles: `src/App.vue` (imports `scss/form-style.scss`)

## Contributing
Open an issue or submit a PR. Keep changes small and add console logs for debugging asynchronous flows (favorites/recipe detail fetching).

## License
Follow course / instructor guidelines.




<!-- # assignment3_3-frontend-main

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/). -->
