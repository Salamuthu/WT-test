import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import logo from "../assets/logo.png";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-screen overflow-hidden bg-background-dark">
            {/* Aurora Background */}
            <div className="absolute inset-0 z-0">
                <Aurora
                    colorStops={["#ffffff", "#19c0d7", "#1946cc"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={1}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-between h-full max-w-md mx-auto px-6 py-12">
                {/* Logo */}
                <div className="flex-shrink-0 pt-8 animate-fadeIn">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-100 h-100 object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Hero Text */}
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-4 animate-fadeInUp">
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                        <span className="whitespace-nowrap">
                            Track Your Workouts.
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            Build Consistency.
                        </span>
                        <br />
                        See Real Progress.
                    </h1>


                    <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                        Stay motivated and organized with a simple workout tracker built to
                        help you train smarter every day.
                    </p>
                </div>

                {/* Auth Buttons */}
                <div className="w-full space-y-4 pb-8 animate-fadeInUp">
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:scale-[1.02]"
                    >
                        Log In
                    </button>

                    <button
                        onClick={() => navigate("/signup")}
                        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-4 px-6 rounded-xl border-2 border-white/20 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;