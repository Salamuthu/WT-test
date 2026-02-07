const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    date: String,
    session: String, // Morning / Evening
    workoutType: String, // Sprint / Endurance / Strength

    sets: [
        {
            reps: [
                {
                    distance: Number,
                    time: String,
                },
            ],
            repRest: String,
            setRest: String,
        },
    ],

    exercises: [
        {
            name: String,
            weight: Number,
            reps: Number,
        },
    ],

    notes: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },
});



module.exports = mongoose.model("Workout", workoutSchema);
