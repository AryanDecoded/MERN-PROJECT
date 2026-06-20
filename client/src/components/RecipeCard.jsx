import styles from './RecipeCard.module.css';

/**
 * RecipeCard — one AI-suggested recipe.
 * recipe: { title, ingredients: string[], note, readyInMinutes }
 */
export default function RecipeCard({ recipe }) {
  const { title, ingredients = [], note, readyInMinutes } = recipe;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.aiTag}>AI</span>
      </div>

      <p className={styles.ingredients}>{ingredients.join(' · ')}</p>

      <div className={styles.footer}>
        {note && <span className={styles.note}>{note}</span>}
        {readyInMinutes && (
          <span className={styles.time}>Ready in {readyInMinutes} min</span>
        )}
      </div>
    </div>
  );
}
