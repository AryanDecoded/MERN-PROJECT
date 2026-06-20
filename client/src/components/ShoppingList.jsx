import styles from './ShoppingList.module.css';

/**
 * ShoppingList — checklist of items to buy.
 * items: [{ id, name, quantity, unit, checked }]
 * Checking an item off should PATCH pantry quantity server-side (later).
 */
export default function ShoppingList({ items = [], onToggle }) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Nothing on the list</p>
        <p className={styles.emptyHint}>Low-stock items will show up here automatically.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.row}>
          <label className={styles.label}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={!!item.checked}
              onChange={() => onToggle?.(item)}
            />
            <span className={`${styles.name} ${item.checked ? styles.checked : ''}`}>
              {item.name}
            </span>
          </label>
          <span className={styles.qty}>
            {item.quantity} {item.unit}
          </span>
        </li>
      ))}
    </ul>
  );
}
