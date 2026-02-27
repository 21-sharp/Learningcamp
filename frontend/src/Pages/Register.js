import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";


function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = register, 2 = verify OTP
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",

  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: "Weak", color: "bg-error" };
    if (score <= 4) return { level: 2, label: "Fair", color: "bg-warning" };
    if (score <= 5) return { level: 3, label: "Strong", color: "bg-success" };
    return { level: 4, label: "Very Strong", color: "bg-success" };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.fullName.trim().length < 3) {
      setError("Name must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }



    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      setError("Password must contain uppercase, lowercase and a number");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,

      });

      if (res.data.success) {
        setStep(2);
        setSuccess(res.data.message);
        startResendTimer();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6);
      const newOtp = [...otp];
      digits.split("").forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
      return;
    }

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/verify-otp", {
        email: form.email,
        otp: otpString,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/resend-otp", { email: form.email });
      setSuccess(res.data.message);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={require("../images/auth_bg.png")}
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Step 1: Registration Form */}
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(99,102,241,0.12)" }}>

            {/* Header */}
            <div className="p-8 pb-2 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                <span className="text-2xl text-white font-bold">L</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Create your account</h1>
              <p className="text-gray-500 text-sm">Join LearningCamp and start learning today</p>
            </div>

            <div className="p-8 pt-6">
              {error && (
                <div className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {form.password && (
                    <div className="mt-2.5">
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.level ? passwordStrength.color : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-medium" style={{ color: passwordStrength.level <= 1 ? "#dc2626" : passwordStrength.level <= 2 ? "#d97706" : "#16a34a" }}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}

                  <div className="mt-2 space-y-0.5">
                    <p className={`text-xs flex items-center gap-1.5 ${form.password.length >= 8 ? "text-green-600" : "text-gray-400"}`}>
                      {form.password.length >= 8 ? "✓" : "○"} At least 8 characters
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 ${/[A-Z]/.test(form.password) ? "text-green-600" : "text-gray-400"}`}>
                      {/[A-Z]/.test(form.password) ? "✓" : "○"} One uppercase letter
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 ${/[a-z]/.test(form.password) ? "text-green-600" : "text-gray-400"}`}>
                      {/[a-z]/.test(form.password) ? "✓" : "○"} One lowercase letter
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 ${/\d/.test(form.password) ? "text-green-600" : "text-gray-400"}`}>
                      {/\d/.test(form.password) ? "✓" : "○"} One number
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Creating Account...
                    </span>
                  ) : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(99,102,241,0.12)" }}>

            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #eff6ff, #e0e7ff)" }}>
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Verify your email</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                We've sent a 6-digit verification code to<br />
                <span className="font-semibold text-gray-700">{form.email}</span>
              </p>
            </div>

            <div className="px-8 pb-8">
              {error && (
                <div className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {success && !error && (
                <div className="mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2.5"
                  style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleVerifyOTP}>
                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                      style={{ caretColor: "#6366f1" }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Verifying...
                    </span>
                  ) : "Verify & Continue"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  {resendTimer > 0 ? (
                    <span className="text-gray-400 font-medium">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors"
                    >
                      Resend Code
                    </button>
                  )}
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setError(""); }}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ← Back to registration
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center mt-6 text-xs text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Register;