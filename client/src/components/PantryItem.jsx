import ExpiryBadge from './ExpiryBadge';
import styles from './PantryItem.module.css';

/**
 * PantryItem — one row in the pantry list/grid.
 * Expects: { name, quantity, unit, category, expiryDate }
 */
export default function PantryItem({ item, onEdit, onDelete }) {
  const { name, quantity, unit, category, expiryDate } = item;

  return (
    <div className={styles.card}>
      <div className={styles.main}>
        <p className={styles.name}>{name}</p>
        <p className={styles.meta}>
          {quantity} {unit}
          {category && <span className={styles.category}> · {category}</span>}
        </p>
      </div>

      <div className={styles.right}>
        <ExpiryBadge expiryDate={expiryDate} />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onEdit?.(item)}
            aria-label={`Edit ${name}`}
          >
            Edit
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => onDelete?.(item)}
            aria-label={`Remove ${name}`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
