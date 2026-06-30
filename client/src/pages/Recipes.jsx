import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { recipeAPI } from '../api/api';
import styles from './Recipes.module.css';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const data = await recipeAPI.getSuggestions();
      // Normalise Gemini response fields to what RecipeCard expects
      const normalised = data.recipes.map((r, i) => ({
        id: i,
        title: r.name,
        ingredients: r.ingredients,
        note: r.usesExpiringItems ? 'Uses expiring items first' : null,
        readyInMinutes: r.cookingTime ? parseInt(r.cookingTime) : null,
      }));
      setRecipes(normalised);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      {error && <p style={{ color: 'red', padding: '1rem' }}>{error}</p>}

      {recipes.length === 0 && !loading && (
        <p style={{ color: '#888', padding: '1rem' }}>Click the button to get recipe ideas from your pantry!</p>
      )}

      <div className={styles.grid}>
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
