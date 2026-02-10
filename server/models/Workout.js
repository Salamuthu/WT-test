const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    session: {
        type: String,
        enum: ["Morning", "Evening"],
    },
    workoutType: {
        type: String,
        enum: ["Sprint", "Endurance", "Strength"],
        required: true,
    },
    notes: String,

    // For Sprint/Endurance workouts
    sets: [
        {
            reps: [
                {
                    distance: Number, // in meters
                    time: String,     // format: "00:00:00"
                }
            ],
            repRest: String,
            setRest: String,
        }
    ],

    // For Strength workouts
    exercises: [
        {
            exercise: String,  // Exercise name (e.g., "Bench Press")
            weight: Number,    // in kg
            reps: Number,      // number of repetitions
        }
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model("Workout", workoutSchema);