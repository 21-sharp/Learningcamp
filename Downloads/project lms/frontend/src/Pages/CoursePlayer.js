import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);

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
              <p className="font-semibold">No video available</p>
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
              </div>
              <h1 className="text-3xl font-extrabold mb-2">{course.title}</h1>
              <p className="text-base-content/70">By <span className="font-semibold">{course.instructor || "Expert Instructor"}</span> • {course.duration}</p>
            </div>
          </div>

          <div className="bg-base-100 shadow-xl rounded-2xl p-6 border border-base-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              About this course
            </h3>
            <p className="text-base-content/80 whitespace-pre-line leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        {/* ===== SIDEBAR (CONTENT + EXAM) ===== */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-base-100 shadow-xl rounded-2xl border border-base-200 overflow-hidden">
            <div className="p-4 bg-base-200 border-b border-base-300">
              <h4 className="font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Course Content
              </h4>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {course.sections && course.sections.length > 0 ? (
                course.sections.map((section, sIdx) => (
                  <div key={sIdx} className="collapse collapse-arrow join-item border-b border-base-200 rounded-none">
                    <input type="checkbox" defaultChecked={sIdx === 0} />
                    <div className="collapse-title text-sm font-bold bg-base-100/50">
                      {section.title}
                    </div>
                    <div className="collapse-content p-0">
                      <ul className="menu menu-sm w-full p-0">
                        {section.lessons?.map((lesson, lIdx) => (
                          <li key={lIdx}>
                            <button
                              className={`rounded-none border-l-4 py-3 px-6 ${currentLesson?._id === lesson._id ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-transparent'}`}
                              onClick={() => setCurrentLesson(lesson)}
                            >
                              <div className="flex items-center gap-3">
                                <span className="opacity-40">{lIdx + 1}</span>
                                <span>{lesson.title}</span>
                                <span className="ml-auto text-[10px] opacity-40">{lesson.duration}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4">
                  <ul className="menu menu-sm w-full p-0">
                    <li>
                      <button
                        className="rounded border-l-4 border-primary bg-primary/5 text-primary font-bold py-3 px-6"
                      >
                        <div className="flex items-center gap-3">
                          <span className="opacity-40">1</span>
                          <span>{currentLesson?.title || "Main Course Video"}</span>
                          <span className="ml-auto text-[10px] opacity-40">{course.duration}</span>
                        </div>
                      </button>
                    </li>
                  </ul>
                  <p className="text-[10px] text-base-content/40 mt-4 text-center px-4 italic">Full course content coming soon.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-accent text-primary-content shadow-xl rounded-2xl p-6 text-center transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold mb-2">Ready for Certification?</h3>
            <p className="mb-6 opacity-90 text-sm">Validate your skills and earn your diploma.</p>

            <button
              className="btn btn-sm bg-white text-primary hover:bg-base-200 border-none w-full font-bold shadow-md"
              onClick={() => {
                localStorage.setItem("courseName", course.title);
                navigate(`/final-exam/${course._id}`);
              }}
            >
              Take Final Test Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePlayer;
