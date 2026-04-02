import { useState, useEffect } from 'react';
import Navbar   from '../components/Navbar';
import DayGrid  from '../components/DayGrid';
import DayModal from '../components/DayModal';
import api      from '../api/axios';
import { formatMonthKey, todayStr } from '../data/slots';

export default function History() {
  const today = todayStr();
  const currentMonthKey = today.substring(0, 7);

  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null); // monthKey
  const [monthRecs, setMonthRecs] = useState([]);
  const [dayModal, setDayModal]   = useState(null);

  useEffect(() => {
    api.get('/records/history')
      .then(({ data }) => {
        // exclude current month from history
        setHistory(data.filter((m) => m.monthKey < currentMonthKey).reverse());
      })
      .finally(() => setLoading(false));
  }, [currentMonthKey]);

  const openMonth = async (monthKey) => {
    setSelected(monthKey);
    const [y, m] = monthKey.split('-');
    const { data } = await api.get(`/records/month?year=${y}&month=${m}`);
    setMonthRecs(data);
  };

  const handleDayClick = (dateStr) => {
    const rec = monthRecs.find((r) => r.date === dateStr) || null;
    setDayModal({ dateStr, rec });
  };

  const streak = 0; // history page doesn't need live streak

  if (selected) {
    const [y, m] = selected.split('-');
    const label  = formatMonthKey(selected);
    const info   = history.find((h) => h.monthKey === selected);

    return (
      <>
        <Navbar streak={streak} />
        <div className="page-wrap fade-in">
          <button
            onClick={() => { setSelected(null); setMonthRecs([]); }}
            style={{ display:'flex', alignItems:'center', gap:6, color:'var(--txt2)', fontSize:14, marginBottom:20,
              padding:'6px 14px', border:'1px solid var(--border)', borderRadius:8, transition:'var(--trans)' }}
          >
            ← Back to History
          </button>

          <div className="section-title">
            <span className="dot" />
            {label} — MONTH REVIEW
          </div>

          {info && (
            <div className="stats-bar" style={{ marginBottom: 24 }}>
              <div className="stat-card">
                <div className="stat-label">Avg Completion</div>
                <div className="stat-value green">{info.avgRate}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total XP</div>
                <div className="stat-value gold">{info.totalXp.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Days Tracked</div>
                <div className="stat-value blue">{info.days}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Perfect Days</div>
                <div className="stat-value" style={{ color:'var(--purple)' }}>{info.perfectDays}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Best Day</div>
                <div className="stat-value" style={{ color:'var(--gold)' }}>{info.bestRate}%</div>
              </div>
            </div>
          )}

          <DayGrid
            monthRecords={monthRecs}
            year={+y} month={+m}
            onDayClick={handleDayClick}
            onMonthChange={() => {}}
          />
        </div>

        {dayModal && (
          <DayModal
            record={dayModal.rec}
            dateStr={dayModal.dateStr}
            onClose={() => setDayModal(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Navbar streak={streak} />
      <div className="page-wrap fade-in">
        <div className="section-title">
          <span className="dot" style={{ background:'var(--purple)' }} />
          MISSION HISTORY
        </div>

        {loading && (
          <div style={{ color:'var(--txt3)', fontFamily:'var(--font-mono)', fontSize:14, padding:'40px 0' }}>
            Loading archives…
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <div className="empty-text">No completed months yet. Keep grinding — history builds up at month end!</div>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="history-grid">
            {history.map((m, i) => (
              <div
                key={m.monthKey}
                className="month-card"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => openMonth(m.monthKey)}
              >
                <div className="month-name">{formatMonthKey(m.monthKey)}</div>

                <div className="month-stats">
                  <div className="month-stat">
                    <div className="ms-label">Avg</div>
                    <div className={`ms-value ${m.avgRate >= 70 ? 'green' : m.avgRate >= 40 ? 'gold' : ''}`}>
                      {m.avgRate}%
                    </div>
                  </div>
                  <div className="month-stat">
                    <div className="ms-label">XP</div>
                    <div className="ms-value gold">{m.totalXp.toLocaleString()}</div>
                  </div>
                  <div className="month-stat">
                    <div className="ms-label">Days</div>
                    <div className="ms-value blue">{m.days}</div>
                  </div>
                  <div className="month-stat">
                    <div className="ms-label">Perfect</div>
                    <div className="ms-value" style={{ color:'var(--purple)' }}>{m.perfectDays}</div>
                  </div>
                </div>

                <div className="month-bar-wrap">
                  <div className="month-bar-label">
                    <span>Completion Rate</span>
                    <span>{m.avgRate}%</span>
                  </div>
                  <div className="month-bar-track">
                    <div className="month-bar-fill" style={{ width: `${m.avgRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
