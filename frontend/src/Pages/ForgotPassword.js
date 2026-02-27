import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1=email, 2=otp+new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await API.post("/auth/forgot-password", { email });
            if (res.data.success) {
                setStep(2);
                setSuccess(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset code");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            const digits = value.replace(/\D/g, "").slice(0, 6);
            const newOtpArr = [...otp];
            digits.split("").forEach((d, i) => {
                if (index + i < 6) newOtpArr[index + i] = d;
            });
            setOtp(newOtpArr);
            const nextIndex = Math.min(index + digits.length, 5);
            document.getElementById(`fp-otp-${nextIndex}`)?.focus();
            return;
        }
        if (!/^\d?$/.test(value)) return;
        const newOtpArr = [...otp];
        newOtpArr[index] = value;
        setOtp(newOtpArr);
        if (value && index < 5) document.getElementById(`fp-otp-${index + 1}`)?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`fp-otp-${index - 1}`)?.focus();
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await API.post("/auth/reset-password", {
                email,
                otp: otpString,
                newPassword,
            });

            if (res.data.success) {
                setSuccess("Password reset successfully!");
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4"
            style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    style={{ boxShadow: "0 8px 40px rgba(99,102,241,0.12)" }}>

                    {step === 1 && (
                        <>
                            <div className="p-8 pb-2 text-center">
                                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
                                    <span className="text-3xl">🔑</span>
                                </div>
                                <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset your password</h1>
                                <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset code</p>
                            </div>
                            <div className="p-8 pt-6">
                                {error && (
                                    <div className="mb-5 p-3.5 rounded-xl text-sm font-medium"
                                        style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSendCode} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-60"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                                    >
                                        {loading ? "Sending..." : "Send Reset Code"}
                                    </button>
                                </form>
                                <div className="mt-6 text-center">
                                    <Link to="/login" className="text-sm text-indigo-600 font-semibold hover:text-indigo-500">
                                        ← Back to Sign In
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="p-8 pb-2 text-center">
                                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, #eff6ff, #e0e7ff)" }}>
                                    <span className="text-3xl">🔐</span>
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Enter reset code</h2>
                                <p className="text-gray-500 text-sm">
                                    Code sent to <span className="font-semibold text-gray-700">{email}</span>
                                </p>
                            </div>
                            <div className="p-8 pt-6">
                                {error && (
                                    <div className="mb-5 p-3.5 rounded-xl text-sm font-medium"
                                        style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-5 p-3.5 rounded-xl text-sm font-medium"
                                        style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                                        {success}
                                    </div>
                                )}
                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div className="flex justify-center gap-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`fp-otp-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                            />
                                        ))}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Min. 8 characters"
                                                required
                                                minLength={8}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? "🙈" : "👁️"}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-60"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                                    >
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
