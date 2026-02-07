import { useState } from "react";
import axios from "axios";
import "./ProfileSetup.css";

const ProfileSetup = () => {
    const [form, setForm] = useState({
        fullName: "",
        mainEvent: "",
        otherEvents: "",
        personalBestValue: "",
        height: "",
        weight: "",
        trainingDays: "",
    });

    const [bmi, setBmi] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🧮 BMI calculation
    const calculateBMI = (h, w) => {
        if (!h || !w) return null;
        const hm = h / 100;
        return Number((w / (hm * hm)).toFixed(1));
    };

    // 🎨 BMI color class
    const getBmiClass = (bmi) => {
        if (bmi < 18.5) return "bmi-yellow";
        if (bmi < 25) return "bmi-green";
        if (bmi < 30) return "bmi-yellow";
        return "bmi-red";
    };

    // 🧠 Normalize event (add 'm' if missing)
    const normalizeEvent = (value) => {
        if (!value) return value;
        const v = value.trim();
        return /\d$/.test(v) ? `${v}m` : v;
    };

    // 🧠 Normalize PB value (add 's' if missing)
    const normalizePB = (value) => {
        if (!value) return value;
        const v = value.trim();
        return /\d$/.test(v) ? `${v}s` : v;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...form, [name]: value };
        setForm(updated);

        if (name === "height" || name === "weight") {
            setBmi(calculateBMI(updated.height, updated.weight));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const mainEvent = normalizeEvent(form.mainEvent);

            const otherEvents = form.otherEvents
                .split(",")
                .map(e => normalizeEvent(e))
                .filter(Boolean);

            const personalBestValue = normalizePB(form.personalBestValue);

            await axios.post(
                "http://localhost:3000/api/profile",
                {
                    fullName: form.fullName,
                    mainEvent,
                    otherEvents,
                    personalBestValue,
                    heightCm: Number(form.height),
                    weightKg: Number(form.weight),
                    trainingDaysPerWeek: Number(form.trainingDays),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            window.location.href = "/dashboard";
        } catch (err) {
            setError("Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <form className="profile-form" onSubmit={handleSubmit}>
                <h1>Set Up Your Profile</h1>
                <p className="subtitle">Help us personalize your training</p>

                <input
                    name="fullName"
                    placeholder="Full Name"
                    required
                    onChange={handleChange}
                />

                <input
                    name="mainEvent"
                    placeholder="Main Event (e.g. 100m)"
                    required
                    onChange={handleChange}
                />

                <input
                    name="otherEvents"
                    placeholder="Other Events (comma separated)"
                    onChange={handleChange}
                />

                <input
                    name="personalBestValue"
                    placeholder="Personal Best (e.g. 10.45s)"
                    onChange={handleChange}
                />

                <div className="row">
                    <input
                        type="number"
                        name="height"
                        placeholder="Height (cm)"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="weight"
                        placeholder="Weight (kg)"
                        required
                        onChange={handleChange}
                    />
                </div>

                {bmi && (
                    <div className={`bmi-box ${getBmiClass(bmi)}`}>
                        <span>BMI</span>
                        <strong>{bmi}</strong>
                    </div>
                )}

                <input
                    type="number"
                    name="trainingDays"
                    placeholder="Training Days per Week"
                    required
                    onChange={handleChange}
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Complete Setup"}
                </button>
            </form>
        </div>
    );
};

export default ProfileSetup;
