import { useState, useEffect, useRef } from "react";
import { Container, Logo, LogoutBtn } from "../index.js";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth.js";
import { logout } from "../../store/authSlice.js";

// Get initials from a full name string
function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Consistent hue from a string
function uidColor(uid = "") {
  const hues = [262, 221, 142, 38, 328, 190, 0];
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  return hues[Math.abs(hash) % hues.length];
}

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      setProfileOpen(false);
      navigate("/");
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Always show when near the top
      if (currentY < 10) {
        setVisible(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling UP → show
        setVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        // Scrolling DOWN (with 5px threshold) → hide
        setVisible(false);
        setMenuOpen(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home",      slug: "/",          active: true },
    { name: "Login",     slug: "/login",     active: !authStatus },
    { name: "Signup",    slug: "/signup",    active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post",  slug: "/add-post",  active: authStatus },
  ];

  const visibleItems = navItems.filter((i) => i.active);

  const isActive = (slug) =>
    slug === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(slug);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-lg border-b border-slate-800/60 shadow-xl shadow-slate-950/40
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <Container>
        <nav className="flex items-center h-16">

          {/* Logo */}
          <Link to="/" className="shrink-0 mr-8" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1 flex-1">
            {visibleItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.slug}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      isActive(item.slug)
                        ? "text-white bg-violet-600/20 border border-violet-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                    }`}
                >
                  {item.name}
                  {/* Active indicator dot */}
                  {isActive(item.slug) && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: user avatar dropdown */}
          {authStatus && (
            <div className="hidden md:flex items-center ml-auto" ref={profileRef}>
              <div className="relative">
                {/* Clickable avatar + name trigger */}
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-800/70 transition-all duration-200 focus:outline-none"
                >
                  {userData && (
                    <>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-slate-700/60"
                        style={{ backgroundColor: `hsl(${uidColor(userData.$id)}, 60%, 42%)` }}
                      >
                        {getInitials(userData.name || userData.email || "U")}
                      </div>
                      <span className="text-sm text-slate-300 font-medium max-w-30 truncate">
                        {userData.name?.split(" ")[0] || "User"}
                      </span>
                    </>
                  )}
                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl shadow-slate-950/60 overflow-hidden z-50">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ backgroundColor: `hsl(${uidColor(userData?.$id || "")}, 60%, 42%)` }}
                        >
                          {getInitials(userData?.name || userData?.email || "U")}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-slate-100 truncate">{userData?.name || "User"}</span>
                          <span className="text-xs text-slate-500 truncate">{userData?.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-800/60 py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile: hamburger */}
          <button
            className="md:hidden ml-auto p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              /* X icon */
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-800/60 mt-0">
            {/* Mobile user info */}
            {authStatus && userData && (
              <div className="flex items-center gap-3 px-4 pt-4 pb-3 mb-1 border-b border-slate-800/40">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ring-2 ring-slate-700/60"
                  style={{ backgroundColor: `hsl(${uidColor(userData.$id)}, 60%, 42%)` }}
                >
                  {getInitials(userData.name || userData.email || "U")}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-semibold text-slate-200">{userData.name || "User"}</span>
                  <span className="text-xs text-slate-500 mt-0.5 truncate max-w-50">{userData.email}</span>
                </div>
              </div>
            )}
            <ul className="flex flex-col gap-1 pt-2">
              {visibleItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.slug}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${
                        isActive(item.slug)
                          ? "text-white bg-violet-600/20 border border-violet-500/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {authStatus && (
                <li className="pt-1 border-t border-slate-800/40">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                    Sign out
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}

export default Header;
