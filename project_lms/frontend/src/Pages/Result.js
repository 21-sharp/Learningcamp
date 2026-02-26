import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/FinalExam.css";

function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="exam-container">
        <div className="exam-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
          <h2 style={{ color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: 12 }}>
            No Result Available
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Complete an exam to see your results here.
          </p>
          <button className="btn-primary" onClick={() => navigate("/courses")}>
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const passed = state.status === "Passed" || state.status === "Pass";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 text-center transform transition-all duration-500 scale-100">
        <div className="card-body">
          <div className="text-6xl mb-4 animate-bounce">
            {passed ? '🎉' : '😔'}
          </div>

          <h2 className="text-3xl font-bold mb-6 text-base-content">
            Exam Result
          </h2>

          <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center text-4xl font-extrabold shadow-inner ${passed ? 'bg-success/10 text-success ring-4 ring-success' : 'bg-error/10 text-error ring-4 ring-error'}`}>
            {state.score}
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between p-3 bg-base-200 rounded-lg">
              <span className="text-base-content/70 font-medium">Percentage</span>
              <span className="font-bold text-base-content">{state.percentage}%</span>
            </div>
            <div className="flex justify-between p-3 bg-base-200 rounded-lg">
              <span className="text-base-content/70 font-medium">Grade</span>
              <span className="font-bold text-base-content">{state.grade}</span>
            </div>
          </div>

          <div className={`mt-6 text-xl font-bold tracking-tight ${passed ? 'text-success' : 'text-error'}`}>
            {passed ? "🎓 Congratulations! You Passed!" : "❌ Better luck next time!"}
          </div>

          <div className="card-actions justify-center mt-8">
            <button className="btn btn-primary w-full shadow-md" onClick={() => navigate("/courses")}>
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
