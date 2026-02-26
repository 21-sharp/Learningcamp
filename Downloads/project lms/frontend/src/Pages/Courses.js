import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/courses")
      .then((res) => {
        setCourses(res.data);
        setFilteredCourses(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const title = course.title || "";
      const description = course.description || "";
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredCourses(filtered);
  }, [searchTerm, activeCategory, courses]);

  const categories = ["All", ...new Set(courses.map(c => c.category).filter(Boolean))];

  const [enrolling, setEnrolling] = useState(null);

  const isEnrolled = (courseId) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    return user.enrolledCourses?.some(c => (typeof c === 'string' ? c : c._id) === courseId);
  };

  const handleCourseClick = async (course) => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      alert("Please register or login first");
      navigate("/login");
      return;
    }

    if (isEnrolled(course._id)) {
      localStorage.setItem("courseName", course.title);
      navigate(`/course/${course._id}`);
      return;
    }

    setEnrolling(course._id);
    try {
      // Enroll User automatically
      const res = await API.post("/auth/enroll", { courseId: course._id });

      // Update local storage user with new enrollment
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      localStorage.setItem("courseName", course.title);
      navigate(`/course/${course._id}`);
    } catch (err) {
      console.error(err);
      // Even if enrollment fails because already enrolled, let them see it
      if (err.response?.status === 400 && err.response?.data?.message?.includes("Already")) {
        localStorage.setItem("courseName", course.title);
        navigate(`/course/${course._id}`);
      } else {
        alert("Enrollment failed. Try again.");
      }
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-primary"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight mb-4">
          Discover Our <span className="text-primary">Premium Courses</span>
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-10">
          Elevate your skills with our expert-led courses designed for your success.
        </p>

        {/* Search and Filter UI */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              type="text"
              placeholder="Search courses..."
              className="input input-bordered w-full pl-10 focus:input-primary rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm rounded-full normal-case px-4 ${activeCategory === cat ? 'btn-primary' : 'btn-ghost bg-base-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-base-200">
              <figure className="relative h-56 overflow-hidden">
                <img
                  src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"}
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="badge badge-primary font-semibold py-3 px-4 shadow-sm">{course.level || "Beginner"}</span>
                </div>
              </figure>

              <div className="card-body">
                <div className="flex items-center gap-2 mb-2 text-sm text-base-content/60 font-medium">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"></path></svg>
                    {course.duration || "Self-paced"}
                  </span>
                  <span>•</span>
                  <span>{course.category || "General"}</span>
                </div>
                <h3 className="card-title text-xl font-bold leading-tight mb-2">{course.title}</h3>
                <p className="text-base-content/70 text-sm line-clamp-3 mb-4">{course.description}</p>

                <div className="mt-auto">
                  <div className="divider my-2"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span className="text-xs">{course.instructor ? course.instructor.charAt(0) : "I"}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{course.instructor || "Expert Instructor"}</span>
                    </div>
                    <button
                      className={`btn ${isEnrolled(course._id) ? 'btn-outline btn-secondary' : 'btn-primary'} btn-sm px-6 rounded-full ${enrolling === course._id ? 'loading' : ''}`}
                      onClick={() => handleCourseClick(course)}
                      disabled={enrolling === course._id}
                    >
                      {enrolling === course._id ? "" : (isEnrolled(course._id) ? "Continue" : "Enroll")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No courses found</h3>
          <p className="text-base-content/60">Try adjusting your search or category filters.</p>
          <button
            onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
            className="btn btn-primary mt-6 rounded-xl"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;
