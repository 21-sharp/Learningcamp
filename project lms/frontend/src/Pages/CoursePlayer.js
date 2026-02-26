import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return alert("Please login to leave a review");
    const user = JSON.parse(userStr);

    setSubmittingReview(true);
    try {
      const res = await API.post(`/courses/${id}/reviews`, {
        userId: user._id,
        userName: user.fullName,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setCourse(res.data);
      setNewReview({ rating: 5, comment: "" });
      alert("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    API.get(`/courses/${id}`)
      .then((res) => {
        setCourse(res.data);
        if (res.data?.sections?.[0]?.lessons?.[0]) {
          setCurrentLesson(res.data.sections[0].lessons[0]);
        } else if (res.data?.videoUrl) {
          // If no sections, use the main course video as the default lesson
          setCurrentLesson({
            title: "Intro",
            videoUrl: res.data.videoUrl,
            duration: res.data.duration
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Helper: detect if a URL is a YouTube embed link
  const isYouTubeEmbed = (url) => {
    if (!url) return false;
    return url.includes("youtube.com/embed") || url.includes("youtu.be");
  };

  // Render the appropriate video player based on URL type
  const renderVideoPlayer = () => {
    const videoUrl = currentLesson?.videoUrl;

    if (!videoUrl) {
      // No video at all — show the thumbnail image as a placeholder
      return (
        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center bg-base-300">
          {course?.image ? (
            <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
          ) : (
            <div className="text-center text-base-content/50">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="font-semibold text-base-content">No video available</p>
            </div>
          )}
        </div>
      );
    }

    if (isYouTubeEmbed(videoUrl)) {
      return (
        <iframe
          className="w-full h-full absolute top-0 left-0"
          src={videoUrl}
          title="Course Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // Direct video file URL (e.g., from Cloudinary)
    return (
      <video
        className="w-full h-full absolute top-0 left-0"
        src={videoUrl}
        controls
        controlsList="nodownload"
      >
        Your browser does not support the video tag.
      </video>
    );
  };

  if (loading) return <div className="p-8 text-center text-primary"><span className="loading loading-spinner loading-lg"></span></div>;
  if (!course) return <h2 className="text-center p-8 text-error">Course not found.</h2>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ===== MAIN CONTENT (VIDEO + INFO) ===== */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-base-100 shadow-xl rounded-2xl overflow-hidden border border-base-200">
            <div className="aspect-video relative bg-black">
              {renderVideoPlayer()}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-primary">{course.category || "General"}</span>
                <span className="badge badge-outline">{course.level || "Beginner"}</span>
                {currentLesson && (
                  <span className="badge badge-accent badge-outline">Now Playing</span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold mb-2">
                {currentLesson ? currentLesson.title : course.title}
              </h1>
              <p className="text-base-content/70">
                {currentLesson ? (
                  <>Duration: <span className="font-semibold">{currentLesson.duration}</span> • Part of <span className="font-semibold text-primary">{course.title}</span></>
                ) : (
                  <>By <span className="font-semibold">{course.instructor || "Expert Instructor"}</span> • {course.duration}</>
                )}
              </p>
            </div>
          </div>

          <div className="bg-base-100 shadow-xl rounded-2xl p-6 border border-base-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {currentLesson ? "About this lesson" : "About this course"}
            </h3>
            <p className="text-base-content/80 whitespace-pre-line leading-relaxed mb-6">
              {currentLesson ? currentLesson.description : course.description}
            </p>

            {currentLesson && course.description && (
              <details className="mt-4 group animate-none">
                <summary className="text-sm font-bold text-primary cursor-pointer list-none flex items-center gap-2">
                  <span>View overall course description</span>
                  <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="mt-2 text-sm text-base-content/60 bg-base-200/50 p-4 rounded-xl border border-base-300">
                  {course.description}
                </div>
              </details>
            )}

            <div className="divider opacity-50"></div>

            {/* ===== ENROLLED STUDENTS SECTION ===== */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Students Enrolled
              </h3>
              <div className="flex flex-wrap gap-4">
                {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                  course.enrolledStudents.map((student, index) => (
                    <div key={index} className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-full border border-base-300">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={student.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.fullName}`} alt={student.fullName} />
                        </div>
                      </div>
                      <span className="text-sm font-medium">{student.fullName}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/50 italic text-sm">No students enrolled yet. Be the first!</p>
                )}
              </div>
            </div>

            <div className="divider opacity-50"></div>

            {/* ===== REVIEWS SECTION ===== */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                Course Reviews
              </h3>

              {/* Add Review Form */}
              <div className="bg-base-200 p-4 rounded-xl mb-8 border border-base-300">
                <h4 className="font-bold mb-3 text-sm">Leave a review</h4>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-2xl ${newReview.rating >= star ? 'text-warning' : 'text-base-content/20'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  className="textarea textarea-bordered w-full mb-3 bg-base-100"
                  placeholder="Share your thoughts about this course..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                ></textarea>
                <button
                  className={`btn btn-primary btn-sm rounded-lg ${submittingReview ? 'loading' : ''}`}
                  onClick={handleReviewSubmit}
                  disabled={submittingReview || !newReview.comment}
                >
                  Submit Review
                </button>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {course.reviews && course.reviews.length > 0 ? (
                  course.reviews.map((review, index) => (
                    <div key={index} className="bg-base-100 border border-base-200 p-4 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                              <span className="text-xs">{review.userName?.charAt(0) || "U"}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-bold">{review.userName}</p>
                            <div className="flex text-warning text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] opacity-40">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-base-content/80 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-base-200/50 rounded-xl border-2 border-dashed border-base-300">
                    <p className="text-base-content/50 italic">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== SIDEBAR (CONTENT + EXAM) ===== */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-base-100 shadow-xl rounded-2xl border border-base-200 overflow-hidden">
            <div className="p-4 bg-base-200 border-b border-base-300">
              <h4 className="font-bold flex items-center gap-2 text-base-content">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Course Content
              </h4>
            </div>

            <div className="max-h-[700px] overflow-y-auto bg-base-100">
              {course.sections && course.sections.length > 0 ? (
                <div className="divide-y divide-base-200">
                  {course.sections.map((section, sIdx) => (
                    <div key={sIdx} className="bg-base-100">
                      <div className="px-6 py-4 bg-base-200/50 flex items-center justify-between border-b border-base-200">
                        <span className="font-black text-[11px] uppercase tracking-widest text-primary">
                          {section.title}
                        </span>
                        <span className="badge badge-sm badge-ghost font-bold opacity-50">
                          {section.lessons?.length || 0} Lessons
                        </span>
                      </div>
                      <ul className="menu menu-sm w-full p-0">
                        {section.lessons?.map((lesson, lIdx) => {
                          const isActive = currentLesson?._id === lesson._id;
                          return (
                            <li key={lIdx} className="border-b border-base-200 last:border-0">
                              <button
                                className={`rounded-none py-5 px-6 gap-4 flex items-center w-full transition-all ${isActive ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-base-200/30 border-l-4 border-transparent'
                                  }`}
                                onClick={() => setCurrentLesson(lesson)}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 font-bold ${isActive ? 'border-primary bg-primary text-primary-content' : 'border-base-300 text-base-content/30'
                                  }`}>
                                  {isActive ? '▶' : lIdx + 1}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <p className={`text-sm font-bold truncate m-0 ${isActive ? 'text-primary' : 'text-base-content'}`}>
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter text-base-content">
                                      {lesson.duration || "10:00"}
                                    </span>
                                    {isActive && <span className="badge badge-primary badge-outline text-[8px] h-4 font-black uppercase">Playing</span>}
                                  </div>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-base-200 rounded-2xl flex items-center justify-center mx-auto text-4xl shadow-inner">🧩</div>
                  <div>
                    <h5 className="font-black text-base-content uppercase tracking-tight">Full Content Soon</h5>
                    <p className="text-xs text-base-content/50 mt-2 italic">This course currently features one intensive masterclass video.</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm btn-block rounded-xl font-bold mt-4"
                    onClick={() => setCurrentLesson({ title: "Masterclass", videoUrl: course.videoUrl, duration: course.duration })}
                  >
                    Start Learning Now
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-accent text-primary-content shadow-xl rounded-2xl p-8 text-center transform transition-transform duration-300 hover:scale-[1.02] border border-white/10">
            <div className="text-6xl mb-6 drop-shadow-lg">🏆</div>
            <h3 className="text-2xl font-black mb-3 leading-tight">Get Certified Today</h3>
            <p className="mb-8 opacity-80 text-sm font-medium leading-relaxed">
              Complete the course to unlock your professional certificate and boost your career.
            </p>

            <button
              className="btn bg-white text-primary hover:bg-base-200 border-none w-full font-black shadow-xl py-4 h-auto"
              onClick={() => {
                localStorage.setItem("courseName", course.title);
                navigate(`/final-exam/${course._id}`);
              }}
            >
              TAKE FINAL EXAM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePlayer;
