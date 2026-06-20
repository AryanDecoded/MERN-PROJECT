import { useState } from 'react';
import styles from './NotificationBell.module.css';

/**
 * NotificationBell — navbar icon showing count of at-risk/expired items.
 * notifications: [{ id, message, type: 'soon' | 'expired' }]
 */
export default function NotificationBell({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const count = notifications.length;

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.bellBtn}
        onClick={() => setOpen((o) => !o)}
        aria-label={`${count} notification${count === 1 ? '' : 's'}`}
        aria-expanded={open}
      >
        <BellIcon />
        {count > 0 && <span className={styles.badge}>{count}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {count === 0 ? (
            <p className={styles.emptyMsg}>You're all caught up.</p>
          ) : (
            <ul className={styles.list}>
              {notifications.map((n) => (
                <li key={n.id} className={styles.item}>
                  <span
                    className={`${styles.dot} ${
                      n.type === 'expired' ? styles.dotExpired : styles.dotSoon
                    }`}
                  />
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
