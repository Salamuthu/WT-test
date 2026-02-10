const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        raceTime: {
            type: String,
            required: true,
        },
        competitionName: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        distance: {
            type: String,
            required: true,
        },
        roundType: {
            type: String,
            enum: ["Heats", "Semis", "Final"],
            default: "Final",
        },
        wind: {
            type: String,
            default: null,
        },
        position: {
            type: String,
            default: null,
        },
        lane: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Competition", competitionSchema);