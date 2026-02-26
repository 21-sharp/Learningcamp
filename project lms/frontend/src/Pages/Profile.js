import { useState, useEffect } from "react";
import API from "../services/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFullName(parsedUser.fullName || "");
            setEmail(parsedUser.email || "");
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const { data } = await API.put("/auth/profile", {
                fullName,
                email,
            });

            setMessage("Profile updated successfully!");
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new Event("userUpdated"));
            }

        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-8 text-center"><span className="loading loading-spinner text-primary"></span></div>;

    const avatarLetter = user.fullName?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="min-h-[calc(100vh-80px)] py-12 px-4"
            style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #faf5ff 50%, #f0fdf4 100%)" }}>
            <div className="max-w-2xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6"
                    style={{ boxShadow: "0 8px 40px rgba(99,102,241,0.10)" }}>
                    <div className="p-8 text-center"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white border-4 border-white/30 shadow-lg">
                            {avatarLetter}
                        </div>
                        <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
                        <p className="text-white/80 text-sm mt-1">{user.email}</p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
                        <div className="p-5 text-center">
                            <span className="block text-2xl font-black text-indigo-600">{user.points || 0}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Points</span>
                        </div>
                        <div className="p-5 text-center">
                            <span className="block text-2xl font-black text-indigo-600">{user.badges?.length || 0}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Badges</span>
                        </div>
                        <div className="p-5 text-center">
                            <span className="block text-2xl font-black text-indigo-600">{user.enrolledCourses?.length || 0}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Courses</span>
                        </div>
                    </div>
                </div>

                {/* Badges Section */}
                {user.badges?.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6"
                        style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.06)" }}>
                        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Earned Badges</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.badges.map((badge, idx) => (
                                <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-bold"
                                    style={{ background: "#eff6ff", color: "#4f46e5", border: "1px solid #c7d2fe" }}>
                                    🏆 {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Edit Profile Form */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.06)" }}>
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>

                        {message && (
                            <div className={`mb-5 p-3.5 rounded-xl text-sm font-medium ${message.includes('success')
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] disabled:opacity-60"
                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        Saving...
                                    </span>
                                ) : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
