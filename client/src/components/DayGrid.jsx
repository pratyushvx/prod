import { useState } from 'react';
import { daysInMonth, firstDayOfMonth, tierOf, todayStr } from '../data/slots';

const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const MONTHS   = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

export default function DayGrid({ monthRecords, year, month, onDayClick, onMonthChange }) {
  const today    = todayStr();
  const total    = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month); // 0=Sun

  // build a lookup: date string → record
  const byDate = {};
  (monthRecords || []).forEach((r) => { byDate[r.date] = r; });

  const cells = [];
  // blank cells before first day
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = (d) => `${year}-${pad(month)}-${pad(d)}`;
  const isFuture = (d) => dateStr(d) > today;

  return (
    <div className="calendar-card">
      <div className="cal-header">
        <div className="cal-title">{MONTHS[month - 1]} {year}</div>
        <div className="cal-nav">
          <button onClick={() => onMonthChange(-1)}>‹</button>
          <button onClick={() => onMonthChange(1)}>›</button>
        </div>
      </div>

      <div className="cal-weekdays">
        {WEEKDAYS.map((w) => <div key={w} className="cal-weekday">{w}</div>)}
      </div>

      <div className="cal-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} className="cal-day empty" />;
          const ds  = dateStr(d);
          const rec = byDate[ds];
          const rate = rec ? rec.completionRate : 0;
          const isToday = ds === today;
          const future  = isFuture(d);

          let cls = 'cal-day';
          if (future)  cls += ' future';
          else if (rec) cls += ` ${tierOf(rate)}`;
          else          cls += ' tier-0';
          if (isToday) cls += ' today';

          return (
            <div key={ds} className={cls}
              title={rec ? `${rate}% complete · ${rec.xp} XP` : future ? 'Future' : 'No data'}
              onClick={() => !future && onDayClick(ds)}>
              <span className="day-num">{d}</span>
              {rec && <span className="day-pct">{rate}%</span>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
        {[
          { cls:'tier-0', label:'0%' },
          { cls:'tier-1', label:'<40%' },
          { cls:'tier-2', label:'<70%' },
          { cls:'tier-3', label:'<90%' },
          { cls:'tier-4', label:'100%' },
        ].map(({ cls, label }) => (
          <div key={cls} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, color:'var(--txt3)' }}>
            <div className={`cal-day ${cls}`}
              style={{ width:12, height:12, borderRadius:3, border:'1px solid transparent', padding:0, aspectRatio:'auto', cursor:'default' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
