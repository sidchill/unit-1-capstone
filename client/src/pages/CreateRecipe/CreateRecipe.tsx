import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Recipe } from "../../components/Recipes/Recipes";
import "./CreateRecipe.css";

const recipeKey = "spoonful-recipes";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const savedRecipes = localStorage.getItem(recipeKey);
    const recipes: Recipe[] = savedRecipes
      ? JSON.parse(savedRecipes)
      : [];

    const recipe = recipes.find((item) => item.id === id);

    if (!recipe) {
      navigate("/dashboard", { replace: true });
      return;
    }

    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setInstructions(recipe.instructions);
    setTags(recipe.tags.join(", "));
    setImageUrl(recipe.image ?? "");
  }, [id, navigate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const savedRecipes = localStorage.getItem(recipeKey);
    const recipes: Recipe[] = savedRecipes
      ? JSON.parse(savedRecipes)
      : [];

    const updatedRecipe: Recipe = {
      id: id ?? Date.now().toString(),
      title: title.trim(),
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      image: imageUrl.trim(),
    };

    const updatedRecipes = id
      ? recipes.map((recipe) =>
          recipe.id === id ? updatedRecipe : recipe,
        )
      : [...recipes, updatedRecipe];

    localStorage.setItem(recipeKey, JSON.stringify(updatedRecipes));
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className="create-recipe-page">
      <header className="create-recipe-header">
        <h1>Spoonful</h1>
      </header>

      <section className="create-recipe-container">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Home
        </button>

        <h2>{isEditing ? "Edit Recipe" : "Create Recipe"}</h2>

        <form className="create-recipe-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(event) => setIngredients(event.target.value)}
            required
          />

          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            required
          />

          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />

          <label htmlFor="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />

          {imageUrl && (
            <img
              className="image-preview"
              src={imageUrl}
              alt="Recipe preview"
            />
          )}

          <button type="submit" className="submit-recipe-button">
            {isEditing ? "Save Changes" : "Save Recipe"}
          </button>
        </form>
      </section>
    </main>
  );
}