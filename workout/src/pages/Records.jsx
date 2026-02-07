import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Records = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");

    // Sample data - replace with API call later
    const featuredPRs = [
        {
            id: 1,
            icon: "speed",
            name: "100m Sprint",
            value: "10.42",
            unit: "s",
            improvement: "-0.15s",
            status: "Active",
            statusColor: "green",
            trending: "trending_down"
        },
        {
            id: 2,
            icon: "fitness_center",
            name: "Back Squat",
            value: "185",
            unit: "kg",
            improvement: "+5.0kg",
            status: "Elite",
            statusColor: "primary",
            trending: "trending_up"
        }
    ];

    const allRecords = [
        {
            id: 1,
            icon: "timer",
            name: "200m Sprint",
            date: "Aug 14, 2023",
            value: "21.85s",
            change: "-0.08s",
            changeType: "positive"
        },
        {
            id: 2,
            icon: "exercise",
            name: "Deadlift",
            date: "Aug 10, 2023",
            value: "210kg",
            change: "+10kg",
            changeType: "positive"
        },
        {
            id: 3,
            icon: "directions_run",
            name: "400m Sprint",
            date: "Jul 28, 2023",
            value: "48.12s",
            change: "Stable",
            changeType: "neutral"
        },
        {
            id: 4,
            icon: "physical_therapy",
            name: "Bench Press",
            date: "Jul 15, 2023",
            value: "140kg",
            change: "+2.5kg",
            changeType: "positive"
        }
    ];

    return (
        <div className="bg-background-dark text-white min-h-screen">
            {/* TOP APP BAR */}
            <header className="sticky top-0 z-50 bg-background-dark border-b border-slate-800/30">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-white flex items-center"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-bold flex-1 text-center">Personal Bests</h2>
                    <button className="flex items-center justify-center">
                        <span className="material-symbols-outlined">analytics</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                {/* SUMMARY STATS */}
                <div className="px-4 pt-6 pb-2">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-primary">
                                Monthly Progress
                            </p>
                            <p className="text-2xl font-bold text-white">+4 New Records</p>
                        </div>
                        <div className="bg-primary rounded-full p-2">
                            <span className="material-symbols-outlined text-white">bolt</span>
                        </div>
                    </div>
                </div>

                {/* CATEGORY TABS */}
                <div className="pb-3 sticky top-[73px] bg-background-dark z-10 pt-2">
                    <div className="flex border-b border-slate-800/30 px-4 gap-8 overflow-x-auto scrollbar-hide">
                        {["all", "sprints", "strength", "endurance"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 whitespace-nowrap ${
                                    activeTab === tab
                                        ? "border-b-primary text-white"
                                        : "border-b-transparent text-slate-400"
                                }`}
                            >
                                <p className="text-sm font-bold capitalize">
                                    {tab === "all" ? "All Records" : tab}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* FEATURED PRS CAROUSEL */}
                <h3 className="text-white text-lg font-bold px-4 pb-2 pt-4">Featured PRs</h3>
                <div className="flex overflow-x-auto scrollbar-hide">
                    <div className="flex items-stretch p-4 gap-4">
                        {featuredPRs.map((pr) => (
                            <div
                                key={pr.id}
                                className="flex h-full flex-1 flex-col gap-3 rounded-xl min-w-[280px] bg-[#1c2638] p-4 border border-slate-700/50 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">
                                            {pr.icon}
                                        </span>
                                    </div>
                                    <span
                                        className={`${
                                            pr.statusColor === "green"
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-primary/10 text-primary border-primary/20"
                                        } text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border`}
                                    >
                                        {pr.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm font-medium">{pr.name}</p>
                                    <h4 className="text-primary text-4xl font-bold mt-1">
                                        {pr.value}
                                        <span className="text-lg">{pr.unit}</span>
                                    </h4>
                                </div>
                                <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-700/30">
                                    <span className="material-symbols-outlined text-green-500 text-sm">
                                        {pr.trending}
                                    </span>
                                    <p className="text-green-500 text-sm font-bold">
                                        {pr.improvement}{" "}
                                        <span className="text-slate-500 font-normal">vs prev</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ALL RECORDS LIST */}
                <div className="px-4 pb-8">
                    <h2 className="text-white text-[22px] font-bold pb-3 pt-5">All History</h2>
                    <div className="space-y-3">
                        {allRecords.map((record) => (
                            <div
                                key={record.id}
                                className="flex items-center justify-between p-4 bg-[#1c2638] rounded-xl border border-slate-700/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-400">
                                            {record.icon}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-base">
                                            {record.name}
                                        </p>
                                        <p className="text-slate-400 text-xs">{record.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold text-lg">{record.value}</p>
                                    <p
                                        className={`text-xs font-bold ${
                                            record.changeType === "positive"
                                                ? "text-green-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {record.change}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Records;