import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogWorkoutSheet from "../components/LogWorkoutSheet";

const Dashboard = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔽 NEW: bottom sheet state
    const [showLogWorkout, setShowLogWorkout] = useState(false);

    // 🔽 NEW: toast notification state
    const [toast, setToast] = useState(null);

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

                setProfile(res.data);
            } catch (err) {
                console.error("Failed to load profile");
                navigate("/setup-profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Auto hide toast after 3 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleWorkoutSave = (result) => {
        setToast(result);
    };

    if (loading) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
                Loading dashboard...
            </div>
        );
    }

    return (
        <>
            {/* TOAST NOTIFICATION */}
            {toast && (
                <div
                    className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-2xl animate-slideDown max-w-md w-full mx-4 ${
                        toast.success
                            ? "bg-green-600 border border-green-500"
                            : "bg-red-600 border border-red-500"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-white">
                            {toast.success ? "check_circle" : "error"}
                        </span>
                        <p className="text-white font-semibold">{toast.message}</p>
                    </div>
                </div>
            )}

            {/* DASHBOARD */}
            <div className="bg-background-dark text-white min-h-screen">
                {/* TOP APP BAR */}
                <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full border-2 border-primary bg-primary flex items-center justify-center text-sm font-bold">
                                {profile.fullName?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs opacity-60">Welcome back,</p>
                                <h2 className="text-lg font-bold">{profile.fullName}</h2>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="size-10 rounded-full bg-slate-800 flex items-center justify-center">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>

                            <button
                                className="size-10 rounded-full bg-slate-800 flex items-center justify-center"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate("/login");
                                }}
                            >
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-md mx-auto">
                    {/* QUICK STATS */}
                    <section className="p-4 grid grid-cols-2 gap-3">
                        {[
                            {
                                icon: "emoji_events",
                                label: "Main Event",
                                value: profile.mainEvent,
                            },
                            {
                                icon: "query_stats",
                                label: "BMI",
                                value: profile.bmi,
                            },
                            {
                                icon: "local_fire_department",
                                label: "Training Days",
                                value: `${profile.trainingDaysPerWeek} / week`,
                            },
                            {
                                icon: "history",
                                label: "Personal Best",
                                value: profile.personalBestValue || "—",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-4 bg-slate-800/50 border border-slate-700/50 flex flex-col gap-2"
                            >
                <span className="material-symbols-outlined text-primary">
                  {item.icon}
                </span>
                                <p className="text-xs uppercase text-slate-400 tracking-wider">
                                    {item.label}
                                </p>
                                <p className="text-xl font-bold">{item.value}</p>
                            </div>
                        ))}
                    </section>

                    {/* ANALYTICS */}
                    <section className="px-4 py-2">
                        <h2 className="text-xl font-bold mb-4">
                            Performance Analytics
                        </h2>
                        <div className="rounded-2xl p-5 bg-slate-800/30 border border-slate-700/30">
                            <p className="text-slate-400 text-sm">Coming Soon</p>
                            <div className="h-28 mt-4 rounded-xl bg-gradient-to-t from-primary/30 to-transparent" />
                        </div>
                    </section>

                    {/* RECENT WORKOUTS */}
                    <section className="p-4">
                        <h2 className="text-xl font-bold mb-4">Recent Workouts</h2>
                        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                            <p className="text-slate-400 text-sm">
                                Workout tracking coming next 🚀
                            </p>
                        </div>
                    </section>
                </main>
            </div>

            {/* 🔽 BOTTOM SHEET MOUNT */}
            <LogWorkoutSheet
                open={showLogWorkout}
                onClose={() => setShowLogWorkout(false)}
                onSave={handleWorkoutSave}
            />
        </>
    );
};

export default Dashboard;