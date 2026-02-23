import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../Styles/AfterLoginHome.css";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AfterLoginHome() {
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await API.get("/auth/me");

        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (error) {
        console.error("Fetch user error:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };

  const displayName = user?.fullName?.trim() || "Student";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Course Progress",
        data: [20, 40, 35, 60, 75, 80],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 13, weight: '500' }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 12 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } }
      }
    }
  };

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      {/* ===== SIDEBAR (Desktop) ===== */}
      <aside className="w-72 bg-base-100 shadow-2xl hidden lg:flex flex-col z-30 border-r border-base-300">
        <div className="p-8 pb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content font-bold text-xl shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform">L</div>
            <span className="text-xl font-black tracking-tighter text-base-content">Learning<span className="text-primary">Camp</span></span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8">
          <ul className="menu w-full space-y-2 font-bold text-base-content/60">
            <li className="menu-title px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-black opacity-40">Main Menu</li>
            <li>
              <button className={`${window.location.pathname === '/dashboard' ? 'active bg-primary/10 text-primary' : ''} py-3 px-4 rounded-xl hover:bg-base-200 transition-all text-left w-full flex items-center`} onClick={() => navigate("/dashboard")}>
                <span className="text-xl mr-3">📊</span> Dashboard
              </button>
            </li>
            <li>
              <button className="py-3 px-4 rounded-xl hover:bg-base-200 transition-all text-left w-full flex items-center" onClick={() => navigate("/courses")}>
                <span className="text-xl mr-3">📚</span> Explore Courses
              </button>
            </li>
            <li className="menu-title px-4 py-2 mt-6 text-[10px] uppercase tracking-[0.2em] font-black opacity-40">Learning Progress</li>
            <li>
              <button className="py-3 px-4 rounded-xl hover:bg-base-200 transition-all text-left w-full flex items-center" onClick={() => navigate("/profile")}>
                <span className="text-xl mr-3">👤</span> My Profile
              </button>
            </li>
            <li>
              <button className="py-3 px-4 rounded-xl hover:bg-base-200 transition-all text-left w-full flex items-center" onClick={() => navigate("/certificates")}>
                <span className="text-xl mr-3">🏆</span> Certificates
              </button>
            </li>
          </ul>
        </div>

        <div className="p-6 border-t border-base-200">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 rounded-2xl border border-primary/10">
            <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Premium Plan</p>
            <p className="text-[10px] opacity-60 mb-3 leading-relaxed">Upgrade to unlock unlimited courses.</p>
            <button className="btn btn-xs btn-primary w-full rounded-lg font-bold">Upgrade Now</button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* MOBILE HEADER */}
        <header className="bg-base-100/90 backdrop-blur-md shadow-sm border-b border-base-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile - State Controlled */}
            <div className="lg:hidden relative">
              <button
                className="btn btn-ghost btn-circle shadow-none"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  )}
                </svg>
              </button>

              {isSidebarOpen && (
                <ul className="absolute top-14 left-0 menu menu-md z-[100] p-3 shadow-2xl bg-base-100 rounded-2xl w-64 border border-base-200 animate-in fade-in slide-in-from-left-4 duration-200">
                  <li className="px-4 py-2 font-black text-primary border-b border-base-100 mb-2 uppercase tracking-widest text-[10px]">Dashboard Menu</li>
                  <li><button onClick={() => { navigate("/dashboard"); setIsSidebarOpen(false); }}>📊 Dashboard</button></li>
                  <li><button onClick={() => { navigate("/courses"); setIsSidebarOpen(false); }}>📚 Courses</button></li>
                  <li><button onClick={() => { navigate("/certificates"); setIsSidebarOpen(false); }}>🏆 Certificates</button></li>
                  <li><button onClick={() => { navigate("/profile"); setIsSidebarOpen(false); }}>👤 Profile</button></li>
                  <div className="divider my-1"></div>
                  <li><button className="text-error font-bold" onClick={handleLogout}>🚪 Logout</button></li>
                </ul>
              )}
            </div>

            <div className="lg:block hidden">
              <h3 className="text-xl font-bold tracking-tight">Main Dashboard</h3>
              <p className="text-[10px] uppercase font-bold text-base-content/40 tracking-widest mt-0.5">Welcome back, {displayName}!</p>
            </div>

            <div className="lg:hidden block">
              <h3 className="text-lg font-black tracking-tight"><span className="text-primary decoration-primary/30 decoration-4 underline-offset-4 ">L</span>earningCamp</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="btn btn-circle btn-ghost btn-sm md:btn-md hover:bg-primary/10 transition-colors" onClick={toggleDarkMode}>
              🌙
            </button>
            <button className="btn btn-circle btn-ghost btn-sm md:btn-md relative hover:bg-primary/10">
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
              🔔
            </button>

            <div className="dropdown dropdown-end" ref={menuRef}>
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring ring-primary/20 ring-offset-2 hover:ring-primary transition-all overflow-hidden" onClick={() => setOpenMenu(!openMenu)}>
                <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-xl font-bold text-primary overflow-hidden">
                  {user?.profileImage ? (
                    <img className="w-full h-full object-cover" src={user.profileImage} alt="avatar" />
                  ) : (
                    avatarLetter
                  )}
                </div>
              </div>

              {openMenu && (
                <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-64 border border-base-200">
                  <li className="px-4 py-3 mb-2 border-b border-base-100">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Signed in as</span>
                    <span className="text-sm font-black truncate">{displayName}</span>
                  </li>
                  <li><button onClick={() => { navigate("/profile"); setOpenMenu(false); }} className="py-3">👤 Edit Profile</button></li>
                  <li><button onClick={() => { navigate("/courses"); setOpenMenu(false); }} className="py-3">📚 My Courses</button></li>
                  <li><button onClick={() => { navigate("/certificates"); setOpenMenu(false); }} className="py-3">🏆 Certificates</button></li>
                  <div className="divider my-1"></div>
                  <li><button className="text-error font-bold py-3 hover:bg-error/10" onClick={handleLogout}>🚪 Sign Out</button></li>
                </ul>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-primary to-accent text-primary-content shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1 duration-300" onClick={() => navigate("/courses")}>
              <div className="card-body">
                <div className="text-4xl mb-2 bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm">📚</div>
                <h3 className="card-title text-2xl font-bold">Browse Courses</h3>
                <p className="text-primary-content/80 text-sm mt-2">Discover new skills and start your next course today.</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn pr-0 text-primary-content font-semibold flex items-center">Explore <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow cursor-pointer transform hover:-translate-y-1 duration-300" onClick={() => navigate("/certificates")}>
              <div className="card-body">
                <div className="text-4xl mb-2 bg-secondary/10 text-secondary w-16 h-16 rounded-2xl flex items-center justify-center">🏆</div>
                <h3 className="card-title text-xl font-bold">Your Certificates</h3>
                <p className="text-base-content/60 text-sm mt-2">View and download your earned certificates.</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-ghost text-secondary hover:bg-secondary/10 flex items-center gap-1 font-semibold pr-0">View All <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="card-body">
                <div className="text-4xl mb-2 bg-warning/10 text-warning w-16 h-16 rounded-2xl flex items-center justify-center">✨</div>
                <h3 className="card-title text-xl font-bold">Gamification</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-warning">{user?.points || 0}</span>
                    <span className="text-xs uppercase font-bold tracking-widest opacity-50">Points</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-primary">{user?.badges?.length || 0}</span>
                    <span className="text-xs uppercase font-bold tracking-widest opacity-50">Badges</span>
                  </div>
                </div>
                <div className="flex gap-1 mt-4 overflow-x-auto pb-2">
                  {user?.badges?.map((badge, idx) => (
                    <div key={idx} className="badge badge-warning badge-outline p-3 text-[10px] font-bold shrink-0">{badge}</div>
                  ))}
                  {!user?.badges?.length && <p className="text-[10px] opacity-40 italic">No badges earned yet.</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                <h3 className="card-title text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-primary">🚀</span> Continue Learning
                </h3>

                <div className="space-y-4">
                  {user?.enrolledCourses?.length > 0 ? (
                    user.enrolledCourses.slice(0, 3).map(course => (
                      <div key={course._id} className="flex items-center gap-4 p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors group">
                        <div className="w-16 h-12 rounded-lg bg-base-300 overflow-hidden flex-shrink-0">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{course.title}</h4>
                          <p className="text-xs text-base-content/50">{course.instructor || "Expert Instructor"}</p>
                        </div>
                        <Link to={`/course/${course._id}`} className="btn btn-sm btn-circle btn-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base-content/50 text-sm">You haven't enrolled in any courses yet.</p>
                      <Link to="/courses" className="btn btn-link btn-sm text-primary p-0">Browse Courses</Link>
                    </div>
                  )}
                </div>

                {user?.enrolledCourses?.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/courses" className="text-sm font-bold text-primary hover:underline">View All My Courses</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="card-title text-xl font-bold">📈 Learning Progress</h3>
                  <select className="select select-bordered select-sm max-w-xs">
                    <option>Last 6 months</option>
                    <option>This year</option>
                  </select>
                </div>
                <div className="w-full h-[250px] flex justify-center items-center">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AfterLoginHome;