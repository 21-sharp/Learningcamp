import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-base-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-8 animate-fade-in border border-primary/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              The Future of Learning is Here
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-base-content mb-8 leading-[1.1] tracking-tight">
              Unlock Your <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  WebkitBackgroundClip: 'text',
                  display: 'inline-block'
                }}
              >
                Full Potential
              </span>
            </h1>

            <p className="text-lg md:text-xl text-base-content/60 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Join the world's most advanced learning platform. Master in-demand skills with expert-led courses designed for your success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="btn btn-primary btn-lg rounded-2xl px-12 shadow-2xl shadow-primary/30 hover:scale-105 transition-all text-lg font-bold group"
                onClick={() => navigate("/courses")}
              >
                Start Learning Now
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                className="btn btn-outline btn-lg rounded-2xl px-12 border-2 hover:bg-base-200 transition-all text-lg font-bold"
                onClick={() => navigate("/about")}
              >
                View Curricula
              </button>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="avatar border-4 border-base-100 shadow-xl">
                    <div className="w-12 h-12">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  </div>
                ))}
                <div className="avatar placeholder border-4 border-base-100 shadow-xl">
                  <div className="bg-neutral text-neutral-content w-12 h-12">
                    <span className="text-sm font-bold">+10k</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-warning">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Trusted by 10,000+ students</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end relative order-1 lg:order-2 w-full max-w-lg lg:max-w-none mx-auto">
            <div className="absolute -z-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="relative group w-full aspect-square max-w-[500px]">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-full h-full rounded-[40px] bg-base-100/50 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center text-[140px] md:text-[200px] overflow-hidden transform transition duration-500 hover:rotate-1 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5"></div>
                <span className="animate-float drop-shadow-2xl">🎓</span>

                {/* Floating Elements */}
                <div className="absolute top-10 right-10 w-16 h-16 bg-base-100 border border-base-200 shadow-xl rounded-2xl flex items-center justify-center text-3xl animate-bounce" style={{ animationDelay: '1s' }}>💻</div>
                <div className="absolute bottom-20 left-10 w-14 h-14 bg-base-100 border border-base-200 shadow-xl rounded-2xl flex items-center justify-center text-2xl animate-float-slow">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-base-200 py-16 border-y border-base-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Courses", value: "200+" },
              { label: "Expert Instructors", value: "50+" },
              { label: "Students Worldwide", value: "10k+" },
              { label: "Satisfaction Rate", value: "99%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-primary mb-1">{stat.value}</div>
                <div className="text-sm font-semibold uppercase tracking-wider text-base-content/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;