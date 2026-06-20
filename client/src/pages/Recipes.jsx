import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import styles from './Recipes.module.css';

const sampleRecipes = [
  {
    id: 1,
    title: 'Bread Omelette',
    ingredients: ['Eggs', 'Bread', 'Onions'],
    note: 'Uses expiring items first',
  },
  {
    id: 2,
    title: 'Tomato Rice',
    ingredients: ['Rice', 'Tomatoes', 'Onions'],
    readyInMinutes: 20,
  },
  {
    id: 3,
    title: 'Curd Rice',
    ingredients: ['Rice', 'Curd'],
    note: '5-minute comfort meal',
  },
];

export default function Recipes() {
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [loading, setLoading] = useState(false);

  function handleGenerate() {
    setLoading(true);
    // TODO: POST pantry contents to /api/recipes -> Gemini API
    setTimeout(() => {
      setRecipes(sampleRecipes);
      setLoading(false);
    }, 800);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>AI Recipes</h1>
          <p className={styles.subtitle}>Based on your pantry today</p>
        </div>
        <button type="button" className={styles.genBtn} onClick={handleGenerate} disabled={loading}>
          {loading ? 'Thinking…' : 'What can I cook?'}
        </button>
      </header>

      <div className={styles.grid}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
