const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    profiId: Number,
    name: String,
    description: String,
    mbti: String,
    enneagram: String,
    variant: String,
    tritype: Number,
    socionics: String,
    sloan: String,
    psyche: String,
    image: String
}, {
    timestamps: true
});

const Profile = mongoose.models.profiles || mongoose.model("profile", schema);

schema.pre('save', async function () {
    if (this.profiId || !this.isNew) return;

    const counter = await Profile.findOneAndUpdate(
        { name: 'profile' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    this.profiId = counter.seq;
});

module.exports = Profile;