import { useState, useEffect } from "react";
import API from "../services/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState(null);
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

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        try {
            const { data } = await API.put(
                `/auth/profile`,
                formData
            );

            setMessage("Profile updated successfully!");
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                // force re-render across windows/tabs
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

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 shadow-xl rounded-2xl mt-10">
            <h2 className="text-3xl font-bold mb-6 text-primary">Edit Profile</h2>

            {message && (
                <div className={`alert mb-4 ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    <span>{message}</span>
                </div>
            )}

            <div className="flex justify-between items-center bg-primary/5 p-6 rounded-2xl border border-primary/10 mb-8">
                <div className="text-center">
                    <span className="block text-2xl font-black text-primary">{user.points || 0}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Total Points</span>
                </div>
                <div className="divider divider-horizontal"></div>
                <div className="text-center flex-1">
                    <div className="flex flex-wrap justify-center gap-2">
                        {user.badges?.map((badge, idx) => (
                            <div key={idx} className="badge badge-primary badge-outline font-bold text-[10px]">{badge}</div>
                        ))}
                        {!user.badges?.length && <span className="text-xs opacity-40 italic">No badges earned...</span>}
                    </div>
                    <span className="block text-[10px] uppercase font-bold tracking-widest opacity-60 mt-2">Earned Badges</span>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Avatar Preview */}
                <div className="flex items-center gap-6">
                    <div className="avatar">
                        <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={
                                    profileImage
                                        ? URL.createObjectURL(profileImage)
                                        : user.profileImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                }
                                alt="Profile"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Change Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Full Name</span></label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label"><span className="label-text font-medium">Email Address</span></label>
                    <input
                        type="email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
