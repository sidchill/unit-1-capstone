import { useNavigate } from "react-router-dom";
import "./Recipes.css";

export type Recipe = {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  tags: string[];
  image: string;
};

type RecipesProps = {
  recipes: Recipe[];
  onDelete: (id: string) => void;
};

export default function Recipes({ recipes, onDelete }: RecipesProps) {
  const navigate = useNavigate();

  function handleDelete(recipe: Recipe) {
    if (window.confirm(`Delete "${recipe.title}" permanently?`)) {
      onDelete(recipe.id);
    }
  }

  if (recipes.length === 0) {
    return <p className="no-recipes">No recipes saved yet.</p>;
  }

  return (
    <section className="recipes-grid">
      {recipes.map((recipe) => (
        <article className="recipe-card" key={recipe.id}>
          {recipe.image && (
            <img className="recipe-image" src={recipe.image} alt={recipe.title} />
          )}

          <div className="recipe-card-content">
            <h2>{recipe.title}</h2>

            <div className="recipe-tags">
              {recipe.tags.map((tag, index) => (
                <span className="recipe-tag" key={`${recipe.id}-${tag}-${index}`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="recipe-actions">
              <button
                type="button"
                onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
              >
                Edit
              </button>

              <button type="button" onClick={() => handleDelete(recipe)}>
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}