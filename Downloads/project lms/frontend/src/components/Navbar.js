import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // New state for profile dropdown
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null); // Ref for the profile dropdown container

  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  // Effect for closing profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]); // Re-run if isProfileOpen changes

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsMenuOpen(false);
    setIsProfileOpen(false); // Close profile dropdown on logout
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-base-100/95 backdrop-blur-md z-50 border-b border-base-200 px-6 lg:px-12 flex items-center justify-between">
      {/* Brand & Desktop Links */}
      <div className="flex items-center gap-10 h-full">
        <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsMenuOpen(false)}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
            L
          </div>
          <span className="text-2xl font-black tracking-tighter text-base-content">
            Learning<span className="text-primary">Camp</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 font-bold text-sm text-base-content/60 h-full">
          <li className="h-full flex items-center">
            <Link to="/" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Home</Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/courses" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Courses</Link>
          </li>
          <li className="h-full flex items-center">
            <Link to="/certificates" className="hover:text-primary transition-colors py-2 border-b-2 border-transparent hover:border-primary">Certificates</Link>
          </li>
        </ul>
      </div>

      {/* Right side: Actions / Profile */}
      <div className="flex items-center gap-3">
        {!user ? (
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="px-6 py-2.5 font-bold text-sm hover:text-primary transition-colors text-base-content/70">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Register
            </Link>
          </div>
        ) : (
          <div className="relative" ref={profileDropdownRef}> {/* Attach ref here */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="btn btn-ghost btn-circle avatar ring-2 ring-primary/20 hover:ring-primary transition-all p-0 focus:outline-none"
              aria-label="User profile menu"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-base-300 flex items-center justify-center">
                <img
                  className="w-full h-full object-cover"
                  alt="User Avatar"
                  src={user.profileImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                />
              </div>
            </button>

            {isProfileOpen && (
              <ul className="absolute right-0 top-14 menu menu-sm bg-base-100 rounded-2xl z-[100] mt-3 w-64 p-3 shadow-2xl border border-base-200 animate-in fade-in zoom-in duration-200">
                <li className="px-4 py-3 mb-2 border-b border-base-100">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Signed in as</span>
                  <span className="text-sm font-black truncate">{user.fullName || "User"}</span>
                </li>
                <li>
                  <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="py-3">
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="py-3">
                    👤 Profile Settings
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout} // handleLogout now closes the dropdown
                    className="text-error font-bold py-3 hover:bg-error/10 text-left w-full"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        {/* Mobile Menu Button - Controlled State */}
        <div className="lg:hidden relative">
          <button
            className="btn btn-ghost btn-circle shadow-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute top-14 right-0 z-[100] w-72 bg-base-100 rounded-2xl p-4 shadow-2xl border border-base-200 animate-in fade-in zoom-in slide-in-from-top-4 duration-200">
              <ul className="menu menu-vertical p-0 gap-1">
                <li className="menu-title px-4 py-2 text-[10px] font-black text-primary uppercase tracking-widest">Navigation</li>
                <li><Link to="/" onClick={() => setIsMenuOpen(false)} className="py-3 text-base-content/70 font-semibold">Home</Link></li>
                <li><Link to="/courses" onClick={() => setIsMenuOpen(false)} className="py-3 text-base-content/70 font-semibold">Courses</Link></li>
                <li><Link to="/certificates" onClick={() => setIsMenuOpen(false)} className="py-3 text-base-content/70 font-semibold">Certificates</Link></li>
                {!user && (
                  <div className="mt-4 pt-4 border-t border-base-100 space-y-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-ghost btn-block rounded-xl font-bold">Login</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary btn-block rounded-xl font-bold text-primary-content shadow-lg shadow-primary/20">Register Now</Link>
                  </div>
                )}
                {user && (
                  <div className="mt-4 pt-4 border-t border-base-100 space-y-3">
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="btn btn-primary btn-block rounded-xl font-bold text-primary-content shadow-lg shadow-primary/20">Dashboard</Link>
                    <button onClick={handleLogout} className="btn btn-ghost btn-block rounded-xl font-bold text-error">Logout</button>
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;