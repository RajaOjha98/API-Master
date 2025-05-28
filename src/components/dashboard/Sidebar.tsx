import React, { useState, useEffect } from "react";
import { FaCubes, FaUser, FaRedditAlien, FaBell, FaHeadset, FaSignOutAlt, FaChevronLeft, FaBars, FaTimes, FaPlayCircle, FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAnalytics } from "@/context/AnalyticsContext";

interface SidebarProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { refreshAnalytics } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  // Initialize sidebar state - collapsed on desktop, expanded on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed]);

  // Handle navigation with loading state
  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      setIsLoading(true);
      setLoadingPath(path);
      
      // Refresh analytics when navigating
      refreshAnalytics();
      
      // Simulate navigation delay for better UX - increased to 800ms
      setTimeout(() => {
        router.push(path);
        // Keep loading state until content actually renders
        // setTimeout is removed here - we'll handle this in the onLoad event
      }, 800);
    }
  };

  // Check if a link is active
  const isActive = (path: string) => {
    return pathname === path || loadingPath === path;
  };

  // Listen for page load completion and remove loading state
  useEffect(() => {
    if (isLoading) {
      const handleLoad = () => {
        // Add a small delay to ensure content is fully rendered
        setTimeout(() => {
          setIsLoading(false);
          setLoadingPath(null);
        }, 200);
      };

      window.addEventListener('load', handleLoad);
      
      // Also add a backup timeout in case the load event doesn't fire
      const backupTimer = setTimeout(() => {
        setIsLoading(false);
        setLoadingPath(null);
      }, 2000);

      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(backupTimer);
      };
    }
  }, [isLoading]);

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <p className="mt-3 text-blue-600 font-medium">Loading...</p>
          </div>
        </div>
      )}

      {/* Sidebar container with fixed width */}
      <div className="relative z-10">
        {/* Actual sidebar with hover effect */}
        <aside 
          className={`fixed md:sticky top-0 left-0 h-full ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r flex flex-col p-4 md:p-6 gap-2 text-sm text-gray-800 shadow-lg md:min-h-screen transition-all duration-150 ease-in-out`}
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
        >
          {/* Sidebar header with mobile toggle */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} mb-4 md:mb-8`}>
            <div className={`flex items-center gap-2 font-extrabold text-xl md:text-2xl tracking-tight text-blue-700 drop-shadow ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <FaCubes size={24} className="md:w-8 md:h-8 flex-shrink-0" color="#3b82f6" />
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>API-Master</span>
            </div>
            {!sidebarCollapsed && (
              <>
                <button 
                  className="hidden md:block text-gray-500 hover:text-gray-700 p-2 touch-manipulation" 
                  onClick={() => setSidebarCollapsed(true)}
                  aria-label="Collapse sidebar"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button 
                  className="md:hidden text-gray-500 hover:text-gray-700 p-2 touch-manipulation" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                  {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
              </>
            )}
          </div>

          {/* Navigation links - collapsible on mobile */}
          <nav className={`flex flex-col gap-1 ${mobileMenuOpen || !sidebarCollapsed ? 'flex' : !sidebarCollapsed ? 'hidden md:flex' : ''}`}>
            <a 
              className={`py-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3'} flex items-center gap-2 rounded-lg font-semibold transition-all ${isActive('/dashboard') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'hover:bg-gray-100'}`} 
              href="/dashboard"
              onClick={(e) => {
                e.preventDefault(); 
                handleNavigation('/dashboard');
              }}
            >
              <FaTachometerAlt size={18} className="flex-shrink-0 min-w-[18px]" color={isActive('/dashboard') ? "#2563eb" : "#64748b"} /> 
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>Dashboard</span>
            </a>
            <a 
              className={`py-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3'} flex items-center gap-2 rounded-lg font-semibold transition-all ${isActive('/playground') ? 'bg-blue-50 text-blue-700 shadow-sm' : 'hover:bg-gray-100'}`} 
              href="/playground"
              onClick={(e) => {
                e.preventDefault(); 
                handleNavigation('/playground');
              }}
            >
              <FaPlayCircle size={18} className="flex-shrink-0 min-w-[18px]" color={isActive('/playground') ? "#2563eb" : "#64748b"} /> 
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>Playground</span>
            </a>
            <Link className={`py-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3'} flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-all`} href="#">
              <FaUser size={18} className="flex-shrink-0 min-w-[18px]" color="#64748b" /> 
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>Account</span>
            </Link>
            <Link className={`py-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3'} flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-all`} href="#">
              <FaRedditAlien size={18} className="flex-shrink-0 min-w-[18px]" color="#f87171" /> 
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>Reddit community</span>
            </Link>
            <Link className={`py-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3'} flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-all`} href="#">
              <FaBell size={18} className="flex-shrink-0 min-w-[18px]" color="#facc15" /> 
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>Latest updates</span>
            </Link>
            <Link className={`py-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3'} flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-all`} href="#">
              <FaHeadset size={18} className="flex-shrink-0 min-w-[18px]" color="#38bdf8" /> 
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>Support</span>
            </Link>
            <Link className={`py-2 ${sidebarCollapsed ? 'px-0 justify-center' : 'px-3'} flex items-center gap-2 rounded-lg hover:bg-gray-100 transition-all`} href="#">
              <FaSignOutAlt size={18} className="flex-shrink-0 min-w-[18px]" color="#64748b" /> 
              <span className={`${sidebarCollapsed ? 'hidden' : 'block'} whitespace-nowrap overflow-hidden transition-all duration-150`}>Sign out</span>
            </Link>
          </nav>

          <div className={`mt-auto pt-8 text-xs text-gray-600 ${sidebarCollapsed ? 'hidden' : mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="mb-2 font-semibold text-gray-700">Expert plan</div>
            <div className="mb-1 flex justify-between"><span>Queries</span><span>1,000 / 1,200</span></div>
            <div className="w-full h-2 bg-gray-200 rounded mb-2"><div className="h-2 bg-blue-400 rounded" style={{width: '83%'}}></div></div>
            <div className="mb-1 flex justify-between"><span>CSV exports</span><span>98 / 120</span></div>
            <div className="w-full h-2 bg-gray-200 rounded"><div className="h-2 bg-blue-400 rounded" style={{width: '82%'}}></div></div>
          </div>
        </aside>
      </div>
    </>
  );
}; 