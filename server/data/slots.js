const SLOTS = [
  { id: 'wake-up',          time: '6:30 – 7:00',   title: 'Wake Up + Freshen Up',              emoji: '🌅', category: 'routine',  xp: 5  },
  { id: 'breakfast',        time: '7:00 – 7:30',   title: 'Breakfast + Plan Day',               emoji: '🍳', category: 'routine',  xp: 5  },
  { id: 'job-slot-1',       time: '8:00 – 10:00',  title: 'Job Slot 1 (MNC + Service)',         emoji: '💼', category: 'job',      xp: 15 },
  { id: 'break-1',          time: '10:00 – 10:30', title: 'Chill / Break',                      emoji: '☕', category: 'break',    xp: 3  },
  { id: 'deep-learning',    time: '10:30 – 11:30', title: 'Deep Learning (DBMS / OS / OOPs)',   emoji: '🧠', category: 'learning', xp: 12 },
  { id: 'project-work',     time: '10:45 – 12:30', title: 'Project Work',                       emoji: '⚙️', category: 'project',  xp: 12 },
  { id: 'lunch',            time: '12:30 – 1:30',  title: 'Lunch + Light Revision',             emoji: '🍱', category: 'routine',  xp: 5  },
  { id: 'testing',          time: '1:30 – 2:30',   title: 'Testing (Aptitude / Coding / SQL)',  emoji: '📝', category: 'practice', xp: 10 },
  { id: 'interview',        time: '2:30 – 4:00',   title: 'Interview Practice + New Learning',  emoji: '🎯', category: 'learning', xp: 12 },
  { id: 'linkedin',         time: '4:00 – 4:30',   title: 'LinkedIn / Follow-ups / Resume',     emoji: '🔗', category: 'job',      xp: 8  },
  { id: 'break-2',          time: '4:30 – 5:00',   title: 'Break',                              emoji: '😴', category: 'break',    xp: 3  },
  { id: 'gym',              time: '5:00 – 6:00',   title: 'Gym / Play',                         emoji: '💪', category: 'health',   xp: 8  },
  { id: 'dsa-1',            time: '6:00 – 8:00',   title: 'DSA Practice (Session 1)',           emoji: '🔥', category: 'dsa',      xp: 15 },
  { id: 'chill',            time: '8:00 – 8:30',   title: 'Chill',                              emoji: '🎮', category: 'break',    xp: 3  },
  { id: 'job-slot-2',       time: '8:30 – 9:30',   title: 'Job Slot 2 (Startups + Bulk Apply)', emoji: '🚀', category: 'job',      xp: 15 },
  { id: 'dinner',           time: '9:30 – 10:00',  title: 'Dinner',                             emoji: '🍽️', category: 'routine',  xp: 3  },
  { id: 'dsa-2',            time: '10:00 – 11:00', title: 'DSA Practice (Session 2)',           emoji: '💻', category: 'dsa',      xp: 15 },
  { id: 'notion-update',    time: '11:00 – 11:20', title: 'Notion Update + Plan',               emoji: '📓', category: 'routine',  xp: 5  },
  { id: 'sleep',            time: '11:20',          title: 'Sleep on Time',                      emoji: '🌙', category: 'routine',  xp: 5  },
];

const MAX_XP = SLOTS.reduce((sum, s) => sum + s.xp, 0); // 164

module.exports = { SLOTS, MAX_XP };
