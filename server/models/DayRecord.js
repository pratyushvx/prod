const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotId:      { type: String, required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
}, { _id: false });

const dayRecordSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:           { type: String, required: true }, // "YYYY-MM-DD"
  slots:          [slotSchema],
  xp:             { type: Number, default: 0 },
  maxXp:          { type: Number, default: 164 },
  completionRate: { type: Number, default: 0 }, // 0–100
}, { timestamps: true });

dayRecordSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DayRecord', dayRecordSchema);
