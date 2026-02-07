// server/models/Profile.js - Add these fields to your existing Profile model

const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    bmi: {
        type: Number
    },
    mainEvent: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Elite', 'Professional'],
        required: true
    },
    trainingDaysPerWeek: {
        type: Number,
        min: 1,
        max: 7,
        required: true
    },
    personalBestValue: {
        type: String
    },
    personalBestUnit: {
        type: String
    },
    personalBestEvent: {
        type: String
    },
    preferredSession: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening']
    },
    // 🆕 NEW: World Athletics Integration
    worldAthleticsCode: {
        type: String,
        default: null
    },
    worldAthleticsData: {
        personalBests: [{
            event: String,
            performance: String,
            venue: String,
            date: String
        }],
        nationality: String,
        dateOfBirth: String,
        club: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);