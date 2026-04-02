const express = require('express');
const DayRecord = require('../models/DayRecord');
const { protect } = require('../middleware/authMiddleware');
const { SLOTS, MAX_XP } = require('../data/slots');

const router = express.Router();

/* ─── helpers ────────────────────────────────────── */
const calcXp = (slots) =>
  slots.reduce((sum, s) => {
    const def = SLOTS.find((d) => d.id === s.slotId);
    return s.completed && def ? sum + def.xp : sum;
  }, 0);

const freshSlots = () => SLOTS.map((s) => ({ slotId: s.id, completed: false, completedAt: null }));

/* ─── GET /api/records/day?date=YYYY-MM-DD ───────── */
router.get('/day', protect, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'date query param required' });

    let record = await DayRecord.findOne({ user: req.user._id, date });
    if (!record) {
      record = await DayRecord.create({
        user: req.user._id, date,
        slots: freshSlots(),
        maxXp: MAX_XP,
      });
    }
    res.json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ─── GET /api/records/month?year=2026&month=04 ──── */
router.get('/month', protect, async (req, res) => {
  try {
    const { year, month } = req.query;
    const prefix = `${year}-${month}`;
    const records = await DayRecord.find({
      user: req.user._id,
      date: { $regex: `^${prefix}` },
    }).sort({ date: 1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ─── GET /api/records/history ───────────────────── */
router.get('/history', protect, async (req, res) => {
  try {
    const records = await DayRecord.find({ user: req.user._id }).sort({ date: 1 });

    const map = {};
    records.forEach((r) => {
      const key = r.date.substring(0, 7); // "YYYY-MM"
      if (!map[key]) map[key] = { monthKey: key, totalXp: 0, possibleXp: 0, days: 0, perfectDays: 0, bestRate: 0 };
      map[key].totalXp     += r.xp;
      map[key].possibleXp  += r.maxXp;
      map[key].days        += 1;
      if (r.completionRate === 100) map[key].perfectDays += 1;
      if (r.completionRate > map[key].bestRate) map[key].bestRate = r.completionRate;
    });

    const months = Object.values(map).map((m) => ({
      ...m,
      avgRate: m.possibleXp > 0 ? Math.round((m.totalXp / m.possibleXp) * 100) : 0,
    }));

    res.json(months);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ─── PATCH /api/records/toggle ──────────────────── */
router.patch('/toggle', protect, async (req, res) => {
  try {
    const { date, slotId } = req.body;
    let record = await DayRecord.findOne({ user: req.user._id, date });
    if (!record) {
      record = await DayRecord.create({
        user: req.user._id, date, slots: freshSlots(), maxXp: MAX_XP,
      });
    }

    const slot = record.slots.find((s) => s.slotId === slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    slot.completed   = !slot.completed;
    slot.completedAt = slot.completed ? new Date() : null;

    record.xp             = calcXp(record.slots);
    record.completionRate = Math.round((record.xp / record.maxXp) * 100);

    await record.save();
    res.json(record);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ─── GET /api/records/streak ────────────────────── */
router.get('/streak', protect, async (req, res) => {
  try {
    const records = await DayRecord.find({ user: req.user._id, completionRate: { $gte: 50 } })
      .sort({ date: -1 });

    let streak = 0;
    let prev = null;
    for (const r of records) {
      const d = new Date(r.date);
      if (!prev) { streak = 1; prev = d; continue; }
      const diff = (prev - d) / 86400000;
      if (diff === 1) { streak++; prev = d; }
      else break;
    }

    const totalXp = (await DayRecord.find({ user: req.user._id }))
      .reduce((s, r) => s + r.xp, 0);

    res.json({ streak, totalXp });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
