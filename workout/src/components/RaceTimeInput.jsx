import { useState, useRef, useEffect } from "react";

const RaceTimeInput = ({ value, onChange }) => {
    // Parse the value into individual digits
    // Format: mm:ss.ms (e.g., "10:42.35")
    const parseTime = (timeString) => {
        const cleaned = timeString.replace(/[^0-9]/g, "");
        const padded = cleaned.padStart(6, "0").slice(0, 6);
        return {
            m1: padded[0] || "0",
            m2: padded[1] || "0",
            s1: padded[2] || "0",
            s2: padded[3] || "0",
            ms1: padded[4] || "0",
            ms2: padded[5] || "0",
        };
    };

    const [digits, setDigits] = useState(parseTime(value || ""));
    const inputRefs = {
        m1: useRef(null),
        m2: useRef(null),
        s1: useRef(null),
        s2: useRef(null),
        ms1: useRef(null),
        ms2: useRef(null),
    };

    useEffect(() => {
        setDigits(parseTime(value || ""));
    }, [value]);

    const handleChange = (key, newValue, nextKey) => {
        // Only allow digits
        if (!/^\d*$/.test(newValue)) return;

        const updatedDigits = { ...digits, [key]: newValue.slice(-1) || "0" };
        setDigits(updatedDigits);

        // Format as mm:ss.ms
        const timeString = `${updatedDigits.m1}${updatedDigits.m2}:${updatedDigits.s1}${updatedDigits.s2}.${updatedDigits.ms1}${updatedDigits.ms2}`;
        onChange(timeString);

        // Auto-focus next input if digit was entered
        if (newValue && nextKey && inputRefs[nextKey]?.current) {
            inputRefs[nextKey].current.focus();
            inputRefs[nextKey].current.select();
        }
    };

    const handleKeyDown = (key, e, prevKey, nextKey) => {
        // Backspace - move to previous
        if (e.key === "Backspace" && !digits[key] && prevKey) {
            e.preventDefault();
            inputRefs[prevKey]?.current?.focus();
            inputRefs[prevKey]?.current?.select();
        }
        // Arrow left
        else if (e.key === "ArrowLeft" && prevKey) {
            e.preventDefault();
            inputRefs[prevKey]?.current?.focus();
            inputRefs[prevKey]?.current?.select();
        }
        // Arrow right
        else if (e.key === "ArrowRight" && nextKey) {
            e.preventDefault();
            inputRefs[nextKey]?.current?.focus();
            inputRefs[nextKey]?.current?.select();
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Minutes */}
            <div className="flex gap-2">
                <input
                    ref={inputRefs.m1}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digits.m1}
                    onChange={(e) => handleChange("m1", e.target.value, "m2")}
                    onKeyDown={(e) => handleKeyDown("m1", e, null, "m2")}
                    onFocus={handleFocus}
                    className="w-16 h-20 text-center text-4xl font-bold text-white bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                />
                <input
                    ref={inputRefs.m2}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digits.m2}
                    onChange={(e) => handleChange("m2", e.target.value, "s1")}
                    onKeyDown={(e) => handleKeyDown("m2", e, "m1", "s1")}
                    onFocus={handleFocus}
                    className="w-16 h-20 text-center text-4xl font-bold text-white bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                />
            </div>

            {/* Colon */}
            <span className="text-4xl font-bold text-slate-500">:</span>

            {/* Seconds */}
            <div className="flex gap-2">
                <input
                    ref={inputRefs.s1}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digits.s1}
                    onChange={(e) => handleChange("s1", e.target.value, "s2")}
                    onKeyDown={(e) => handleKeyDown("s1", e, "m2", "s2")}
                    onFocus={handleFocus}
                    className="w-16 h-20 text-center text-4xl font-bold text-white bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                />
                <input
                    ref={inputRefs.s2}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digits.s2}
                    onChange={(e) => handleChange("s2", e.target.value, "ms1")}
                    onKeyDown={(e) => handleKeyDown("s2", e, "s1", "ms1")}
                    onFocus={handleFocus}
                    className="w-16 h-20 text-center text-4xl font-bold text-white bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                />
            </div>

            {/* Dot */}
            <span className="text-4xl font-bold text-slate-500">.</span>

            {/* Milliseconds */}
            <div className="flex gap-2">
                <input
                    ref={inputRefs.ms1}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digits.ms1}
                    onChange={(e) => handleChange("ms1", e.target.value, "ms2")}
                    onKeyDown={(e) => handleKeyDown("ms1", e, "s2", "ms2")}
                    onFocus={handleFocus}
                    className="w-16 h-20 text-center text-4xl font-bold text-white bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                />
                <input
                    ref={inputRefs.ms2}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digits.ms2}
                    onChange={(e) => handleChange("ms2", e.target.value, null)}
                    onKeyDown={(e) => handleKeyDown("ms2", e, "ms1", null)}
                    onFocus={handleFocus}
                    className="w-16 h-20 text-center text-4xl font-bold text-white bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                />
            </div>
        </div>
    );
};

export default RaceTimeInput;