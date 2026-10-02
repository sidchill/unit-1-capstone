import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Recipes, {
  type Recipe,
} from "../../components/Recipes/Recipes";
import "./HomePage.css";

const recipeKey = "spoonful-recipes";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const savedRecipes = localStorage.getItem(recipeKey);
    setRecipes(savedRecipes ? JSON.parse(savedRecipes) : []);
  }, []);

  function deleteRecipe(id: string) {
    setRecipes((currentRecipes) => {
      const updatedRecipes = currentRecipes.filter(
        (recipe) => recipe.id !== id,
      );

      localStorage.setItem(recipeKey, JSON.stringify(updatedRecipes));
      return updatedRecipes;
    });
  }

  return (
    <main className="home-page">
      <header className="home-header">
        <h1>Spoonful</h1>
      </header>

      <Recipes recipes={recipes} onDelete={deleteRecipe} />

      <Link to="/recipes/new" className="create-recipe-button">
        Create Recipe
      </Link>
    </main>
  );
}