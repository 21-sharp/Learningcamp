import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "../Styles/Certificates.css";

function Certificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("certificates")) || [];
    setCertificates(stored);
  }, []);

  // Generate PDF Certificate
  const generateCertificate = (cert) => {
    const doc = new jsPDF("landscape");

    const { studentName, course, score, date, badge } = cert;

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
    doc.line(13, 20, 20, 13);
    doc.line(13, 25, 25, 13);
    doc.line(284, 20, 277, 13);
    doc.line(284, 25, 272, 13);
    doc.line(13, 190, 20, 197);
    doc.line(13, 185, 25, 197);
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

    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241);
    doc.text(course, 148, 125, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text(`Final Score: ${score}`, 148, 140, { align: "center" });

    // === BADGE / SEAL ===
    doc.setDrawColor(218, 165, 32);
    doc.setFillColor(255, 215, 0);
    doc.setLineWidth(2);
    doc.circle(240, 165, 14, "FD");
    doc.setFillColor(255, 235, 100);
    doc.circle(240, 165, 10, "FD");
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
    doc.text(`Badge: ${badge || "Course Master"}`, 240, 183, { align: "center" });

    // === DATE ===
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${date}`, 148, 155, { align: "center" });

    // === DIRECTOR SIGNATURE ===
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(40, 175, 120, 175);

    doc.setFont("times", "bolditalic");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Dr. Sandeep Kumar", 80, 172, { align: "center" });

    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Director, LearningCamp", 80, 182, { align: "center" });

    doc.save(`${studentName}-${course}-Certificate.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight mb-4 flex items-center justify-center gap-3">
          <span className="text-secondary">🏆</span> Your Certificates
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          View and download your earned certificates for completing our premium courses.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-base-100 rounded-3xl shadow-sm border border-base-200">
          <div className="text-7xl mb-6 opacity-80">📜</div>
          <h3 className="text-2xl font-bold mb-2 text-base-content">
            No Certificates Yet
          </h3>
          <p className="text-base-content/60 text-center max-w-md">
            Complete a course exam to earn your first certificate! Your achievements will be displayed securely here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert, index) => (
            <div key={index} className="card bg-base-100 shadow-xl border border-secondary/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="card-body">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-3xl mb-4">
                  🎓
                </div>
                <h3 className="card-title text-xl font-bold mb-1">{cert.course}</h3>

                {cert.badge && (
                  <div className="badge badge-warning gap-1 mb-2">
                    🏅 {cert.badge}
                  </div>
                )}

                <div className="space-y-2 text-sm text-base-content/70 mt-4 mb-6 bg-base-200 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <span className="font-semibold">Student:</span>
                    <span>{cert.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Score:</span>
                    <span className="font-bold text-success">{cert.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Date Earned:</span>
                    <span>{cert.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Signed by:</span>
                    <span className="font-medium">Dr. Sandeep Kumar</span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-auto">
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() => generateCertificate(cert)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Certificates;