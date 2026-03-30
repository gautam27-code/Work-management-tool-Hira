// Displays the top navigation bar with app name and user section.

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#1e293b]/80 backdrop-blur-xl border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Name / Logo */}
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#818cf8] to-[#06b6d4] bg-clip-text text-transparent">
              Hira
            </h1>
            <span className="hidden sm:inline-block text-xs text-[#94a3b8] bg-[#334155] px-2 py-0.5 rounded-full">
              Work Manager
            </span>
          </div>

          {/* User Section (static for now) */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="p-2 rounded-lg hover:bg-[#334155] transition-colors text-[#94a3b8] hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User avatar and name */}
            <div className="flex items-center gap-2 bg-[#334155] rounded-full pl-1 pr-3 py-1 hover:bg-[#475569] transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#ec4899] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">G</span>
              </div>
              <span className="text-sm font-medium text-[#f1f5f9]">Gautam</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
