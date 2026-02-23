import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";

function FinalExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [pointsRewarded, setPointsRewarded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    async function loadExam() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/exams/${id}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error("Invalid exam data:", data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    loadExam();
  }, [id]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  /* ================= REWARD POINTS ================= */
  useEffect(() => {
    if (showResult && !pointsRewarded) {
      const passMark = Math.ceil(questions.length * 0.6);
      if (score >= passMark) {
        const rewardPoints = 100; // Standard reward
        const token = localStorage.getItem("token");

        axios.post("http://localhost:5000/api/auth/points", {
          points: rewardPoints,
          badge: "Course Master"
        }, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          if (res.data.success) {
            setPointsRewarded(true);
            // Optionally update user in local storage
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.points = res.data.points;
            user.badges = res.data.badges;
            localStorage.setItem("user", JSON.stringify(user));
          }
        }).catch(err => console.error("Points reward error:", err));
      }
    }
  }, [showResult, score, questions.length, pointsRewarded]);

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-base-200">
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="loading loading-ring loading-lg text-primary text-6xl"></span>
          <h2 className="text-2xl font-bold animate-pulse text-base-content">Preparing your exam...</h2>
        </div>
      </div>
    );
  }

  /* ================= ANSWER ================= */
  const handleAnswer = (selected) => {
    if (selected === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    const next = currentQuestion + 1;

    if (next < questions.length) {
      setCurrentQuestion(next);
    } else {
      setShowResult(true);
    }
  };

  /* ================= CERTIFICATE ================= */
  const generateCertificate = () => {
    const passMark = Math.ceil(questions.length * 0.6);
    if (score < passMark) return;

    const doc = new jsPDF("landscape");

    let studentName = "Student";
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.fullName) studentName = parsed.fullName;
    }

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });

    // === OUTER BORDER ===
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(3);
    doc.rect(8, 8, 281, 194);

    // === INNER BORDER ===
    doc.setDrawColor(168, 85, 247);
    doc.setLineWidth(1);
    doc.rect(13, 13, 271, 184);

    // === DECORATIVE CORNERS ===
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    // Top-left corner
    doc.line(13, 20, 20, 13);
    doc.line(13, 25, 25, 13);
    // Top-right corner
    doc.line(284, 20, 277, 13);
    doc.line(284, 25, 272, 13);
    // Bottom-left corner
    doc.line(13, 190, 20, 197);
    doc.line(13, 185, 25, 197);
    // Bottom-right corner
    doc.line(284, 190, 277, 197);
    doc.line(284, 185, 272, 197);

    // === HEADER ===
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text("LearningCamp", 148, 33, { align: "center" });

    // === TITLE ===
    doc.setFontSize(34);
    doc.setTextColor(15, 23, 42);
    doc.text("Certificate of Completion", 148, 60, { align: "center" });

    // === DECORATIVE LINE ===
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.8);
    doc.line(80, 65, 216, 65);

    // === BODY ===
    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text("This is to certify that", 148, 80, { align: "center" });

    doc.setFont("times", "bolditalic");
    doc.setFontSize(28);
    doc.setTextColor(15, 23, 42);
    doc.text(studentName, 148, 95, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text("has successfully completed the course", 148, 110, { align: "center" });

    const courseName = localStorage.getItem("courseName") || "Professional Certification";
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text(courseName, 148, 125, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Final Score: ${score}/${questions.length}`, 148, 140, { align: "center" });

    // === BADGE / SEAL ===
    // Draw a gold badge circle on the right
    doc.setDrawColor(218, 165, 32); // Gold
    doc.setFillColor(255, 215, 0);
    doc.setLineWidth(2);
    doc.circle(240, 165, 14, "FD");
    // Inner circle
    doc.setFillColor(255, 235, 100);
    doc.circle(240, 165, 10, "FD");
    // Star/Badge text
    doc.setFont("times", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 80, 0);
    doc.text("CERTIFIED", 240, 163, { align: "center" });
    doc.setFontSize(6);
    doc.text("COURSE MASTER", 240, 168, { align: "center" });

    // Badge label
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(168, 85, 247);
    doc.text("Badge: Course Master", 240, 183, { align: "center" });

    // === DATE ===
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${today}`, 148, 155, { align: "center" });

    // === DIRECTOR SIGNATURE ===
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(40, 175, 120, 175);

    // Signature-style name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Dr. Sandeep Kumar", 80, 172, { align: "center" });

    // Title
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Director, LearningCamp", 80, 182, { align: "center" });

    doc.save(`${studentName}-Certificate.pdf`);

    // Save to localStorage for certificates page
    const certs = JSON.parse(localStorage.getItem("certificates")) || [];
    certs.push({
      studentName,
      course: courseName,
      score: `${score}/${questions.length}`,
      date: today,
      badge: "Course Master"
    });
    localStorage.setItem("certificates", JSON.stringify(certs));
  };

  /* ================= RESULT ================= */
  if (showResult) {
    const passMark = Math.ceil(questions.length * 0.6);
    const passed = score >= passMark;

    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-base-200 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 text-center transform transition-all duration-500 scale-100">
          <div className="card-body">
            <div className="text-6xl mb-4 animate-bounce">
              {passed ? '🎉' : '😔'}
            </div>

            <h2 className="text-3xl font-bold mb-6 text-base-content">
              Exam Completed!
            </h2>

            <div className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center text-4xl font-extrabold shadow-inner ${passed ? 'bg-success/10 text-success ring-4 ring-success' : 'bg-error/10 text-error ring-4 ring-error'}`}>
              {score}/{questions.length}
            </div>

            <div className={`mt-6 text-xl font-bold tracking-tight ${passed ? 'text-success' : 'text-error'}`}>
              {passed ? "🎓 Congratulations! You Passed!" : `You need ${passMark}/${questions.length} to pass. Try again!`}
            </div>

            <div className="card-actions flex-col gap-3 justify-center mt-8">
              {passed && (
                <button className="btn btn-primary w-full shadow-md" onClick={generateCertificate}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Download Certificate
                </button>
              )}
              <button
                className="btn btn-outline btn-secondary w-full"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= PROGRESS ================= */
  const progress = ((currentQuestion) / questions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-base-200 py-12 px-4 flex justify-center">
      <div className="w-full max-w-3xl">

        {/* HEADER & TIMER */}
        <div className="flex justify-between items-center mb-6 bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300">
          <div className="flex flex-col">
            <span className="text-sm text-base-content/60 font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-xl font-bold text-primary">Question {currentQuestion + 1} of {questions.length}</span>
          </div>

          <div className="flex items-center gap-2 bg-error/10 text-error px-4 py-2 rounded-xl font-mono text-xl font-bold border border-error/20">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-2 bg-base-300 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* QUESTION CARD */}
        <div className="card bg-base-100 shadow-xl border border-base-300 mb-8 transform transition-all duration-300">
          <div className="card-body p-8 lg:p-10">
            <h3 className="text-2xl md:text-3xl font-bold leading-tight text-base-content mb-8">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className="w-full text-left p-4 rounded-xl border-2 border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-200 group flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  onClick={() => handleAnswer(option)}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-base-200 text-base-content/70 font-semibold group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg font-medium text-base-content/90 group-hover:text-base-content transition-colors">
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FinalExam;