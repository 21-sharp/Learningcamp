import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Contact from "./Pages/Contact";
import { About } from "./Pages/About";
import Layout from "./components/Layout";

// Learning Pages
import Courses from "./Pages/Courses";
import CoursePlayer from "./Pages/CoursePlayer";
import FinalExam from "./Pages/FinalExam";
import Result from "./Pages/Result";

// User Pages
import AfterLoginHome from "./Pages/AfterLoginHome";
import Certificates from "./Pages/Certificates";
import Profile from "./Pages/Profile";

function AppLayout() {
  const location = useLocation();

  const hideNavbarOn = ["/dashboard"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-20" : ""}>
        <Layout>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />

            {/* PROTECTED */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AfterLoginHome />} />
              <Route path="/course/:id" element={<CoursePlayer />} />

              {/* ✅ QUIZ ROUTE */}
              <Route path="/final-exam/:id" element={<FinalExam />} />

              <Route path="/result" element={<Result />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </div>
    </>
  );
}

export default function App() {
  return <AppLayout />;
}