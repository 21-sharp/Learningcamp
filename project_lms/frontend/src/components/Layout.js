const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100 font-sans selection:bg-primary/30">
      {children}
    </div>
  );
};

export default Layout;