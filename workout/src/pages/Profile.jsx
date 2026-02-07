import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [athleteCode, setAthleteCode] = useState("");
    const [athleteData, setAthleteData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3000/api/profile/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Profile loaded:", res.data);
                setProfile(res.data);

                if (res.data.worldAthleticsCode) {
                    setAthleteCode(res.data.worldAthleticsCode);
                }
                if (res.data.worldAthleticsData) {
                    console.log("Athlete data:", res.data.worldAthleticsData);
                    setAthleteData(res.data.worldAthleticsData);
                }
            } catch (err) {
                console.error("Failed to load profile");
                navigate("/setup-profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleSaveAthleteCode = async () => {
        if (!athleteCode.trim()) {
            alert("Please enter a World Athletics code");
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem("token");

        try {
            console.log("Saving athlete code:", athleteCode);

            const res = await axios.post(
                "http://localhost:3000/api/profile/world-athletics",
                { athleteCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Server response:", res.data);

            setAthleteData(res.data.athleteData);
            setProfile(res.data.profile);

            alert(`World Athletics data loaded successfully for ${res.data.athleteData.name || 'athlete'}!`);
        } catch (err) {
            console.error("Failed to load athlete data:", err);
            const errorMsg = err.response?.data?.error || "Failed to load athlete data. Please check the code and try again.";
            alert(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearData = async () => {
        if (!confirm("Are you sure you want to clear World Athletics data?")) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://localhost:3000/api/profile/clear-world-athletics",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAthleteData(null);
            setAthleteCode("");

            const res = await axios.get(
                "http://localhost:3000/api/profile/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setProfile(res.data);

            alert("World Athletics data cleared successfully!");
        } catch (err) {
            console.error("Failed to clear data:", err);
            alert("Failed to clear data");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white min-h-screen">
            {/* TOP APP BAR */}
            <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800/50"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-lg font-bold flex-1 text-center">Athlete Profile</h2>
                    <button className="flex size-10 items-center justify-center rounded-full bg-slate-800/50">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            {/* PROFILE HERO SECTION */}
            <div className="flex p-6 flex-col items-center">
                <div className="relative">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary shadow-[0_0_20px_rgba(37,106,244,0.3)] bg-slate-700 flex items-center justify-center">
                        <span className="text-5xl font-bold text-white">
                            {profile.fullName?.charAt(0)}
                        </span>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-primary text-white p-1 rounded-full border-2 border-background-dark flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs">verified</span>
                    </div>
                </div>

                <div className="mt-4 flex flex-col items-center">
                    <p className="text-2xl font-bold tracking-tight">{profile.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                            Athlete
                        </span>
                        <p className="text-slate-400 text-sm font-medium">{profile.mainEvent}</p>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="flex w-full max-w-sm gap-3 mt-6">
                    <button
                        onClick={() => navigate("/setup-profile")}
                        className="flex-1 flex items-center justify-center rounded-xl h-12 bg-primary text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/20"
                    >
                        <span>Edit Profile</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 flex items-center justify-center rounded-xl h-12 bg-slate-800 text-slate-300 text-sm font-bold border border-slate-700"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* BIOMETRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                <div className="flex flex-col gap-1 rounded-2xl p-4 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                            straighten
                        </span>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            Height
                        </p>
                    </div>
                    <p className="text-xl font-bold">
                        {profile.heightCm || profile.height || "—"}
                        <span className="text-xs font-normal ml-0.5 text-slate-400">cm</span>
                    </p>
                </div>

                <div className="flex flex-col gap-1 rounded-2xl p-4 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                            monitor_weight
                        </span>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            Weight
                        </p>
                    </div>
                    <p className="text-xl font-bold">
                        {profile.weightKg || profile.weight || "—"}
                        <span className="text-xs font-normal ml-0.5 text-slate-400">kg</span>
                    </p>
                </div>

                <div className="flex flex-col gap-1 rounded-2xl p-4 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                            calculate
                        </span>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            BMI
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-bold">{profile.bmi || "—"}</p>
                        {profile.bmi && (
                            <>
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] text-emerald-500 font-bold uppercase">
                                    Optimal
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-1 rounded-2xl p-4 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                            calendar_today
                        </span>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                            Freq
                        </p>
                    </div>
                    <p className="text-xl font-bold">
                        {profile.trainingDaysPerWeek || "—"}
                        <span className="text-xs font-normal ml-0.5 text-slate-400">d/wk</span>
                    </p>
                </div>
            </div>

            {/* PRIMARY EVENT & PREFERENCES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mt-2">
                <div className="flex flex-col">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] pb-3 px-1">
                        Primary Focus
                    </h3>
                    <div className="flex items-center gap-4 rounded-2xl bg-primary/10 p-4 border border-primary/20">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <span className="material-symbols-outlined text-3xl">timer</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-base font-bold">{profile.mainEvent || "Not Set"}</p>
                            <p className="text-primary text-xs font-medium">Primary Event</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] pb-3 px-1">
                        Training
                    </h3>
                    <div className="flex items-center gap-4 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-yellow-400">
                            <span className="material-symbols-outlined text-3xl">fitness_center</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-base font-bold">
                                {profile.trainingDaysPerWeek || "—"} days/week
                            </p>
                            <p className="text-slate-400 text-xs font-medium">
                                Frequency
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* WORLD ATHLETICS CODE SECTION */}
            <div className="p-4 mb-24">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] pb-3 px-1">
                    World Athletics Profile
                </h3>
                <div className="rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-5">
                    <p className="text-slate-400 text-sm mb-4">
                        Enter your World Athletics athlete code to sync your official statistics
                        and records.
                    </p>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={athleteCode}
                            onChange={(e) => setAthleteCode(e.target.value)}
                            placeholder="e.g., 14201847"
                            className="flex-1 h-12 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button
                            onClick={handleSaveAthleteCode}
                            disabled={isSaving}
                            className="px-6 h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSaving ? "Loading..." : "Save"}
                        </button>
                        {athleteData && (
                            <button
                                onClick={handleClearData}
                                className="px-4 h-12 rounded-xl bg-red-600/20 text-red-400 font-bold hover:bg-red-600/30 border border-red-600/30 transition-all"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {athleteData && athleteData.seasonalBests && athleteData.seasonalBests.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-700/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                                    <span className="material-symbols-outlined">verified</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold">
                                        {athleteData.name || "Official Profile Synced"}
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                        Last updated: {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Display synced athlete data */}
                            <div className="space-y-3">
                                {athleteData.seasonalBests.map((sb, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-700/30"
                                    >
                                        <div className="flex flex-col">
                                            <p className="text-slate-400 text-xs font-medium">
                                                {sb.discipline}
                                            </p>
                                            <p className="text-white text-lg font-bold">
                                                {sb.performance}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-primary text-xs font-bold">
                                                {sb.venue}
                                            </p>
                                            <p className="text-slate-500 text-[10px] uppercase font-bold">
                                                {sb.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;