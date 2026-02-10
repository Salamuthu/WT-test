const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Competition = require("../models/Competition");

const SECRET_KEY = "your_secret_key";

// Auth middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// POST - Create new competition result
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { raceTime, competitionName, date, location, distance, roundType, wind, position, lane } = req.body;

        // Validate required fields
        const missingFields = [];

        if (!raceTime || raceTime === "00:00:00") {
            missingFields.push("Race Time");
        }
        if (!date) {
            missingFields.push("Date");
        }
        if (!location || location.trim() === "") {
            missingFields.push("Location");
        }

        // If any required fields are missing, return error
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following required fields: ${missingFields.join(", ")}`,
                missingFields: missingFields
            });
        }

        // Create new competition
        const competition = new Competition({
            userId: req.userId,
            raceTime,
            competitionName: competitionName || "Untitled Competition",
            date,
            location,
            distance: distance || "100m",
            roundType: roundType || "Final",
            wind: wind || null,
            position: position || null,
            lane: lane || null,
        });

        await competition.save();

        res.status(201).json({
            success: true,
            message: "Competition result saved successfully!",
            competition,
        });
    } catch (error) {
        console.error("Error saving competition:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save competition result",
            error: error.message,
        });
    }
});

// GET - Get all competitions for logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const competitions = await Competition.find({ userId: req.userId })
            .sort({ date: -1 }) // Most recent first
            .limit(100);

        res.json({
            success: true,
            competitions,
        });
    } catch (error) {
        console.error("Error fetching competitions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch competitions",
            error: error.message,
        });
    }
});

// GET - Get single competition by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const competition = await Competition.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!competition) {
            return res.status(404).json({
                success: false,
                message: "Competition not found",
            });
        }

        res.json({
            success: true,
            competition,
        });
    } catch (error) {
        console.error("Error fetching competition:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch competition",
            error: error.message,
        });
    }
});

// PUT - Update competition
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { raceTime, competitionName, date, location, distance, roundType, wind, position, lane } = req.body;

        // Validate required fields
        const missingFields = [];

        if (!raceTime || raceTime === "00:00:00") {
            missingFields.push("Race Time");
        }
        if (!date) {
            missingFields.push("Date");
        }
        if (!location || location.trim() === "") {
            missingFields.push("Location");
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill in the following required fields: ${missingFields.join(", ")}`,
                missingFields: missingFields
            });
        }

        const competition = await Competition.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            {
                raceTime,
                competitionName,
                date,
                location,
                distance,
                roundType,
                wind,
                position,
                lane,
            },
            { new: true }
        );

        if (!competition) {
            return res.status(404).json({
                success: false,
                message: "Competition not found",
            });
        }

        res.json({
            success: true,
            message: "Competition updated successfully!",
            competition,
        });
    } catch (error) {
        console.error("Error updating competition:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update competition",
            error: error.message,
        });
    }
});

// DELETE - Delete competition
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const competition = await Competition.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!competition) {
            return res.status(404).json({
                success: false,
                message: "Competition not found",
            });
        }

        res.json({
            success: true,
            message: "Competition deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting competition:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete competition",
            error: error.message,
        });
    }
});

module.exports = router;