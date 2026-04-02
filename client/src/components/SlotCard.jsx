import { useState } from 'react';
import { SLOTS } from '../data/slots';

export default function SlotCard({ slot, onToggle, disabled }) {
  const [flash, setFlash] = useState(false);
  const def = SLOTS.find((s) => s.id === slot.slotId);
  if (!def) return null;

  const handleClick = async () => {
    if (disabled) return;
    await onToggle(slot.slotId);
    if (!slot.completed) { setFlash(true); setTimeout(() => setFlash(false), 1050); }
  };

  return (
    <div
      className={`slot-card${slot.completed ? ' done' : ''}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={slot.completed}
    >
      {flash && <span className="xp-flash">+{def.xp} XP ⚡</span>}

      <span className="slot-emoji">{def.emoji}</span>

      <div className="slot-info">
        <div className="slot-title">{def.title}</div>
        <div className="slot-time">
          {def.time}
          <span className={`cat-badge cat-${def.category}`} style={{ marginLeft: 8 }}>{def.category}</span>
        </div>
      </div>

      <span className="slot-xp">{def.xp} XP</span>

      <div className="slot-check">
        {slot.completed ? '✓' : ''}
      </div>
    </div>
  );
}
