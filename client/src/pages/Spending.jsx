import styles from './Spending.module.css';

const sampleMembers = [
  { id: 1, name: 'You', spent: 1240 },
  { id: 2, name: 'Roommate', spent: 860 },
];

const sampleLog = [
  { id: 1, item: 'Rice', amount: 240, member: 'You', date: '2026-06-12' },
  { id: 2, item: 'Milk', amount: 60, member: 'Roommate', date: '2026-06-14' },
  { id: 3, item: 'Onions', amount: 90, member: 'You', date: '2026-06-15' },
];

export default function Spending() {
  const total = sampleMembers.reduce((sum, m) => sum + m.spent, 0);

  function handleExport() {
    // TODO: generate CSV from spending log once server route exists
    console.log('Export CSV');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Spending</h1>
          <p className={styles.subtitle}>This month's breakdown by member</p>
        </div>
        <button type="button" className={styles.exportBtn} onClick={handleExport}>
          Export CSV
        </button>
      </header>

      <div className={styles.totalCard}>
        <p className={styles.totalLabel}>Total this month</p>
        <p className={styles.totalValue}>₹{total.toLocaleString('en-IN')}</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>By member</h2>
        <div className={styles.members}>
          {sampleMembers.map((m) => (
            <div key={m.id} className={styles.memberRow}>
              <span className={styles.memberName}>{m.name}</span>
              <span className={styles.memberAmount}>₹{m.spent.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent purchases</h2>
        <div className={styles.log}>
          {sampleLog.map((entry) => (
            <div key={entry.id} className={styles.logRow}>
              <div>
                <p className={styles.logItem}>{entry.item}</p>
                <p className={styles.logMeta}>{entry.member} · {entry.date}</p>
              </div>
              <span className={styles.logAmount}>₹{entry.amount}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
