import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-base-content mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-base-content/60">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
              <div className="alert alert-error mb-6 py-3 shadow-sm rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSignin} className="space-y-5">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60">Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="input input-bordered w-full focus:input-primary bg-base-200/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60">Password</span>
                  <Link to="#" className="label-text-alt link link-hover text-primary font-semibold">Forgot password?</Link>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="input input-bordered w-full focus:input-primary bg-base-200/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`btn btn-primary w-full rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <div className="divider my-8 text-xs font-bold uppercase tracking-widest opacity-30">OR</div>

            <p className="text-center text-base-content/70">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold link link-hover">
                Register Now
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-base-content/40 font-medium">
          © 2026 LearningCamp. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;