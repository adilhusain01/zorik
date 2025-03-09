const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-md z-50">
      <div className="relative">
        {/* Gradient blur effect */}
        <div className="absolute -inset-8 bg-gradient-to-r from-primary/30 to-purple-400/30 rounded-full blur-xl opacity-70 animate-pulse"></div>

        {/* Glass container */}
        <div className="relative glass-card rounded-2xl p-10 shadow-2xl border border-white/10">
          {/* Spinning circles */}
          <div className="flex items-center justify-center">
            <div className="absolute animate-spin">
              <div className="h-20 w-20 rounded-full border-4 border-t-primary border-r-purple-400 border-b-blue-400 border-l-transparent"></div>
            </div>
            <div className="absolute animate-spin animate-delay-150">
              <div className="h-14 w-14 rounded-full border-4 border-t-purple-400 border-r-blue-400 border-b-primary border-l-transparent"></div>
            </div>
            <div className="absolute animate-spin animate-delay-300">
              <div className="h-8 w-8 rounded-full border-4 border-t-blue-400 border-r-primary border-b-purple-400 border-l-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
