import styles from './ExpiryBadge.module.css';

/**
 * ExpiryBadge — the signature freshness indicator.
 * Pass an expiry date, get back a status dot + label.
 * Reused on the dashboard, pantry list, item detail, and shopping list.
 *
 * Status rules:
 *   expired  -> expiryDate is in the past
 *   soon     -> expiryDate is within `warningDays` (default 3) days from now
 *   fresh    -> everything else
 */

function getStatus(expiryDate, warningDays = 3) {
  if (!expiryDate) return 'fresh';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= warningDays) return 'soon';
  return 'fresh';
}

function getLabel(expiryDate, status) {
  if (status === 'expired') return 'Expired';
  if (!expiryDate) return 'Fresh';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

  if (status === 'soon') {
    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }
  return 'Fresh';
}

export default function ExpiryBadge({ expiryDate, warningDays = 3, size = 'md' }) {
  const status = getStatus(expiryDate, warningDays);
  const label = getLabel(expiryDate, status);

  return (
    <span className={`${styles.badge} ${styles[status]} ${styles[size]}`}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </span>
  );
}
