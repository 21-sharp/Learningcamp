import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("fullName", form.fullName);
      data.append("email", form.email);
      data.append("password", form.password);
      if (form.image) {
        data.append("image", form.image);
      }

      await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden transform transition-all duration-300">
          <div className="bg-primary p-6 text-primary-content text-center">
            <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
            <p className="opacity-80 mt-1">Start your learning journey today</p>
          </div>

          <div className="card-body p-8">
            {error && (
              <div className="alert alert-error mb-6 py-3 shadow-sm rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60">Full Name</span>
                </label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="input input-bordered w-full focus:input-primary bg-base-200/50"
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60">Email Address</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="input input-bordered w-full focus:input-primary bg-base-200/50"
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60">Password</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="input input-bordered w-full focus:input-primary bg-base-200/50"
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs uppercase tracking-wider text-base-content/60">Profile Photo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered file-input-primary w-full bg-base-200/50"
                  onChange={handleImage}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary w-full rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </div>
            </form>

            <p className="text-center text-base-content/70 mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold link link-hover">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-base-content/40 font-medium">
          By registering, you agree to our Terms and Conditions.
        </div>
      </div>
    </div>
  );
}

export default Register;