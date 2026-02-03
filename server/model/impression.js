const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        index: true
    },
    voter: {
        type: String,
        required: true
    },
    mbti: {
        type: String,
        set: v => typeof v === 'string' ? v.trim().toUpperCase() : v,
        default: null
    },
    enneagram: {
        type: String,
        set: v => typeof v === 'string' ? v.trim().toUpperCase() : v,
        default: null
    },
    zodiac: {
        type: String,
        set: v => typeof v === 'string' ? v.trim().toUpperCase() : v,
        default: null
    },
    vote: {
        type: Number,
        default: 0
    },
    comment: String,

}, {
    timestamps: true
});

schema.index({ profileId: 1, vote: -1, createdAt: -1 });

const Impression = mongoose.models.impressions || mongoose.model("impression", schema);

schema.pre('save', async function () {
    if (this.profiId || !this.isNew) return;

    const counter = await Impression.findOneAndUpdate(
        { name: 'impression' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    this.profiId = counter.seq;
});

module.exports = Impression;