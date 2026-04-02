import { useState, useEffect, useCallback } from 'react';
import Navbar    from '../components/Navbar';
import SlotCard  from '../components/SlotCard';
import DayGrid   from '../components/DayGrid';
import XPBar     from '../components/XPBar';
import DayModal  from '../components/DayModal';
import api       from '../api/axios';
import { todayStr, MAX_XP, SLOTS } from '../data/slots';

export default function Dashboard() {
  const today = todayStr();
  const [year, setYear]   = useState(() => +today.split('-')[0]);
  const [month, setMonth] = useState(() => +today.split('-')[1]);

  const [todayRecord, setTodayRecord] = useState(null);
  const [monthRecords, setMonthRecords] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [toggling, setToggling] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  /* ── fetch today's record ── */
  const fetchToday = useCallback(async () => {
    try {
      const { data } = await api.get(`/records/day?date=${today}`);
      setTodayRecord(data);
    } catch (e) { console.error(e); }
  }, [today]);

  /* ── fetch month records ── */
  const fetchMonth = useCallback(async () => {
    try {
      const pad = (n) => String(n).padStart(2, '0');
      const { data } = await api.get(`/records/month?year=${year}&month=${pad(month)}`);
      setMonthRecords(data);
    } catch (e) { console.error(e); }
  }, [year, month]);

  /* ── fetch streak + totalXP ── */
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/records/streak');
      setStreak(data.streak);
      setTotalXp(data.totalXp);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchToday(); fetchStats(); }, [fetchToday, fetchStats]);
  useEffect(() => { fetchMonth(); }, [fetchMonth]);

  /* ── toggle slot ── */
  const handleToggle = async (slotId) => {
    if (toggling) return;
    setToggling(true);
    try {
      const { data } = await api.patch('/records/toggle', { date: today, slotId });
      setTodayRecord(data);
      fetchMonth();
      fetchStats();
    } catch (e) { console.error(e); }
    finally { setToggling(false); }
  };

  /* ── calendar nav ── */
  const handleMonthChange = (dir) => {
    let m = month + dir, y = year;
    if (m < 1)  { m = 12; y--; }
    if (m > 12) { m = 1;  y++; }
    setMonth(m); setYear(y);
  };

  /* ── day click → modal ── */
  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    const rec = monthRecords.find((r) => r.date === dateStr) || null;
    setSelectedRecord(rec);
  };

  const completedCount  = todayRecord?.slots?.filter((s) => s.completed).length ?? 0;
  const completionRate  = todayRecord?.completionRate ?? 0;
  const earnedXp        = todayRecord?.xp ?? 0;

  return (
    <>
      <Navbar streak={streak} />

      <div className="page-wrap fade-in">
        {/* XP bar */}
        <XPBar totalXp={totalXp} />

        {/* Stats row */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-label">Today's XP</div>
            <div className="stat-value gold">{earnedXp}<span style={{ fontSize:14, color:'var(--txt3)' }}>/{MAX_XP}</span></div>
            <div className="stat-sub">{completionRate}% complete</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Tasks Done</div>
            <div className="stat-value blue">{completedCount}<span style={{ fontSize:14, color:'var(--txt3)' }}>/{SLOTS.length}</span></div>
            <div className="stat-sub">slots completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Streak</div>
            <div className="stat-value" style={{ color: streak > 0 ? 'var(--gold)' : 'var(--txt3)' }}>
              {streak}<span style={{ fontSize:14 }}> 🔥</span>
            </div>
            <div className="stat-sub">days ≥50%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total XP</div>
            <div className="stat-value green">{totalXp.toLocaleString()}</div>
            <div className="stat-sub">lifetime earned</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="dash-grid">
          {/* Left: today's slots */}
          <div>
            <div className="section-title">
              <span className="dot" />
              TODAY'S MISSIONS
              <span style={{ fontSize:13, color:'var(--txt3)', fontFamily:'var(--font-mono)', marginLeft:'auto' }}>
                {today}
              </span>
            </div>

            {/* Progress bar for today */}
            <div style={{ marginBottom: 16 }}>
              <div className="xp-track" style={{ height: 6 }}>
                <div className="xp-fill" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <div className="slots-list">
              {todayRecord
                ? todayRecord.slots.map((slot) => (
                    <SlotCard key={slot.slotId} slot={slot} onToggle={handleToggle} disabled={toggling} />
                  ))
                : Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="slot-card" style={{ height: 54, opacity: .3, background: 'var(--card2)' }} />
                  ))
              }
            </div>
          </div>

          {/* Right: calendar */}
          <div>
            <div className="section-title"><span className="dot" style={{ background:'var(--gold)' }} />30-DAY VIEW</div>
            <DayGrid
              monthRecords={monthRecords}
              year={year} month={month}
              onDayClick={handleDayClick}
              onMonthChange={handleMonthChange}
            />
          </div>
        </div>
      </div>

      {selectedDate && (
        <DayModal
          record={selectedRecord}
          dateStr={selectedDate}
          onClose={() => { setSelectedDate(null); setSelectedRecord(null); }}
        />
      )}
    </>
  );
}
