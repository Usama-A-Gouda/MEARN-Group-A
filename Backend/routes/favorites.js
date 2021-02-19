const router = require("express").Router();
const isAuth = require("../middleware/is-auth");
const favoriteRecipesControllers = require("../controllers/favoriteRecipesControllers");
router.post(
  "/add-recipe-to-favorite/:recipeID",
  isAuth,
  favoriteRecipesControllers.addRecipeToFavorite
);
router.put(
  "/remove-recipe-from-favorite/:recipeID",
  isAuth,
  favoriteRecipesControllers.removeFromFavorite
);
module.exports = router;
