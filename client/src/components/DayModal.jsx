import { SLOTS } from '../data/slots';

export default function DayModal({ record, dateStr, onClose }) {
  if (!record) return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{dateStr}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No data recorded for this day.</div>
        </div>
      </div>
    </div>
  );

  const done  = record.slots.filter((s) => s.completed).length;
  const total = record.slots.length;
  const pct   = record.completionRate;

  // Format date nicely
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const label  = `${months[+m-1]} ${+d}, ${y}`;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{label}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-summary">
          <div className="modal-stat">
            <div className="modal-stat-val gold">{record.xp}</div>
            <div className="modal-stat-lbl">XP Earned</div>
          </div>
          <div className="modal-stat">
            <div className="modal-stat-val green">{pct}%</div>
            <div className="modal-stat-lbl">Completion</div>
          </div>
          <div className="modal-stat">
            <div className="modal-stat-val" style={{ color:'var(--blue)' }}>{done}/{total}</div>
            <div className="modal-stat-lbl">Tasks Done</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="xp-track" style={{ marginBottom: 16, height: 6 }}>
          <div className="xp-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="slots-list" style={{ gap: 4 }}>
          {record.slots.map((slot) => {
            const def = SLOTS.find((s) => s.id === slot.slotId);
            if (!def) return null;
            return (
              <div key={slot.slotId}
                className={`slot-card${slot.completed ? ' done' : ''}`}
                style={{ cursor: 'default' }}>
                <span className="slot-emoji">{def.emoji}</span>
                <div className="slot-info">
                  <div className="slot-title">{def.title}</div>
                  <div className="slot-time">{def.time}</div>
                </div>
                <span className="slot-xp">{def.xp} XP</span>
                <div className="slot-check">{slot.completed ? '✓' : ''}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
