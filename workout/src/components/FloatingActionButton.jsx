import { useState } from "react";

const FloatingActionButton = ({ onLogWorkout, onLogCompetition }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogWorkout = () => {
        setIsOpen(false);
        onLogWorkout();
    };

    const handleLogCompetition = () => {
        setIsOpen(false);
        onLogCompetition();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sub-buttons */}
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50">
                {/* Log Competition Button */}
                <button
                    onClick={handleLogCompetition}
                    className={`flex items-center gap-3 px-5 py-3 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all ${
                        isOpen
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                    style={{ transitionDelay: isOpen ? "50ms" : "0ms" }}
                >
                    <span className="material-symbols-outlined">emoji_events</span>
                    <span className="text-sm font-bold whitespace-nowrap">Log Competition</span>
                </button>

                {/* Log Workout Button */}
                <button
                    onClick={handleLogWorkout}
                    className={`flex items-center gap-3 px-5 py-3 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all ${
                        isOpen
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                    style={{ transitionDelay: isOpen ? "0ms" : "0ms" }}
                >
                    <span className="material-symbols-outlined">directions_run</span>
                    <span className="text-sm font-bold whitespace-nowrap">Log Workout</span>
                </button>
            </div>

            {/* Main FAB */}
            <button
                onClick={toggleMenu}
                className={`flex items-center justify-center size-14 rounded-full bg-primary text-white -mt-10 shadow-lg shadow-primary/40 border-4 border-[#101622] z-50 transition-all ${
                    isOpen ? "rotate-45" : "rotate-0"
                }`}
            >
                <span className="material-symbols-outlined scale-125">add</span>
            </button>
        </>
    );
};

export default FloatingActionButton;