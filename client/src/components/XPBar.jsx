import { getLevel } from '../data/slots';

export default function XPBar({ totalXp }) {
  const lvl = getLevel(totalXp);

  return (
    <div className="xp-wrap">
      <div className="xp-header">
        <div className="xp-title">⚡ LEVEL {lvl.level} — {lvl.title.toUpperCase()}</div>
        <div className="xp-level">{totalXp.toLocaleString()} XP</div>
      </div>
      <div className="xp-track">
        <div className="xp-fill" style={{ width: `${lvl.pct}%` }} />
      </div>
      <div className="xp-nums">
        <span>{lvl.min.toLocaleString()}</span>
        <span>{lvl.pct}% to {lvl.next ? `Lv.${lvl.next.level} ${lvl.next.title}` : 'MAX'}</span>
        <span>{lvl.next ? lvl.next.min.toLocaleString() : '∞'}</span>
      </div>
    </div>
  );
}
