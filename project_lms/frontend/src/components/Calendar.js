import React, { useState } from 'react';

const Calendar = ({ enrolledCourses = [], user }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonthDays = firstDayOfMonth(year, month);
    const totalDays = daysInMonth(year, month);

    // Month Names
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    // Map enrolled courses to "events" on specific days (mocking realtime schedule)
    const events = {};
    if (enrolledCourses.length > 0) {
        enrolledCourses.forEach((course, index) => {
            // Distribute sessions across the month for demo
            const day = ((today.getDate() + (index * 3)) % totalDays) || 1;
            events[day] = {
                title: `${course.title} Session`,
                time: "10:00 AM",
                type: index % 2 === 0 ? "live" : "event"
            };
        });
    }

    // Always add a fixed "Exam Prep" on a future day
    const examDay = (today.getDate() + 5) % totalDays || 1;
    events[examDay] = { title: "Final Exam Window", time: "All Day", type: "deadline" };

    return (
        <div className="w-full bg-base-100 rounded-2xl">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                            <span className="text-xs font-bold">{user?.fullName?.charAt(0) || "S"}</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-base-content">{user?.fullName || "Student"}</h4>
                        <p className="text-[10px] text-base-content/50 font-medium">Learning Journey: {enrolledCourses.length} Courses</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-base-content">{monthNames[month]}</h2>
                        <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">{year}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="btn btn-sm btn-circle btn-ghost border border-base-200">‹</button>
                        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="btn btn-sm btn-circle btn-ghost border border-base-200">›</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black uppercase text-base-content/30 tracking-tighter">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {[...Array(prevMonthDays)].map((_, i) => (
                    <div key={`prev-${i}`} className="aspect-square"></div>
                ))}
                {[...Array(totalDays)].map((_, i) => {
                    const day = i + 1;
                    const event = events[day];
                    return (
                        <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-xl relative cursor-pointer transition-all hover:bg-primary/5 ${isToday(day) ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-110 z-10' : 'text-base-content'}`}>
                            <span className="text-xs font-bold">{day}</span>
                            {event && !isToday(day) && (
                                <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${event.type === 'live' ? 'bg-error' : event.type === 'deadline' ? 'bg-warning' : 'bg-info'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-base-content/40 border-b border-base-200 pb-2">Upcoming Schedule</h4>
                {Object.entries(events).map(([d, e]) => (
                    <div key={d} className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-base-200 hover:bg-base-200/30 transition-all cursor-pointer group">
                        <div className={`w-1.5 h-8 rounded-full ${e.type === 'live' ? 'bg-error' : e.type === 'deadline' ? 'bg-warning' : 'bg-primary/40'}`} />
                        <div className="flex-1">
                            <h5 className="text-xs font-bold leading-none mb-1 group-hover:text-primary transition-colors">{e.title}</h5>
                            <p className="text-[10px] opacity-40 font-medium">Day {d} • {e.time}</p>
                        </div>
                        {e.type === 'live' && <span className="badge badge-error badge-xs font-black text-[8px] animate-pulse">LIVE</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
