import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LogWorkoutSheet from "./LogWorkoutSheet";
import LogCompetitionSheet from "./LogCompetitionSheet";
import FloatingActionButton from "./FloatingActionButton";

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Sheet states
    const [showLogWorkout, setShowLogWorkout] = useState(false);
    const [showLogCompetition, setShowLogCompetition] = useState(false);

    // Toast notification state
    const [toast, setToast] = useState(null);

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

    const handleCompetitionSave = (result) => {
        setToast(result);
    };

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

            <div className="bg-background-dark text-white min-h-screen">
                {/* Main Content */}
                <div className="pb-28">
                    <Outlet />
                </div>

                {/* BOTTOM NAV - Persistent across pages */}
                <nav className="fixed bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-xl border-t border-slate-800 max-w-md mx-auto px-6 pb-8 pt-3 z-50">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className={`flex flex-col items-center ${
                                location.pathname === "/dashboard"
                                    ? "text-primary"
                                    : "text-slate-500"
                            }`}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-[10px] font-bold uppercase">Home</span>
                        </button>

                        <button className="flex flex-col items-center text-slate-500">
                            <span className="material-symbols-outlined">event_note</span>
                            <span className="text-[10px] font-bold uppercase">Plan</span>
                        </button>

                        {/* FAB with popup buttons */}
                        <FloatingActionButton
                            onLogWorkout={() => setShowLogWorkout(true)}
                            onLogCompetition={() => setShowLogCompetition(true)}
                        />

                        <button
                            onClick={() => navigate("/records")}
                            className={`flex flex-col items-center ${
                                location.pathname === "/records"
                                    ? "text-primary"
                                    : "text-slate-500"
                            }`}
                        >
                            <span className="material-symbols-outlined">insights</span>
                            <span className="text-[10px] font-bold uppercase">Stats</span>
                        </button>

                        <button
                            onClick={() => navigate("/profile")}
                            className={`flex flex-col items-center ${
                                location.pathname === "/profile"
                                    ? "text-primary"
                                    : "text-slate-500"
                            }`}
                        >
                            <span className="material-symbols-outlined">person</span>
                            <span className="text-[10px] font-bold uppercase">Profile</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* LogWorkout Bottom Sheet */}
            <LogWorkoutSheet
                open={showLogWorkout}
                onClose={() => setShowLogWorkout(false)}
                onSave={handleWorkoutSave}
            />

            {/* LogCompetition Bottom Sheet */}
            <LogCompetitionSheet
                isOpen={showLogCompetition}
                onClose={() => setShowLogCompetition(false)}
                onSave={handleCompetitionSave}
            />
        </>
    );
};

export default MainLayout;