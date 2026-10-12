"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Grid, Settings, Megaphone, FileText, Image as ImageIcon, Video, Calendar, Mail, 
  ChevronDown, ChevronRight, Menu, LogOut
} from "lucide-react";
import "./admin.css";
import { ToastContainer } from "./components/Toast";

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [masterSetupOpen, setMasterSetupOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Don't render sidebar/topbar for login page
  if (pathname === "/admin/login") {
    return children;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const navItems = [
    { href: "/admin/settings", label: "Website Settings", exact: true },
    { href: "/admin/news", label: "Manage News", exact: true },
    { href: "/admin/blog", label: "Manage Blog", exact: true },
    { href: "/admin/photo-gallery", label: "Photo Gallery", exact: true },
    { href: "/admin/video-gallery", label: "Video Gallery", exact: true },
    { href: "/admin/appointments", label: "Appointments", exact: true },
    { href: "/admin/enquiries", label: "Contact Messages", exact: true },
  ];

  return (
    <div className="ad-root ad-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="ad-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`ad-sidebar-light ${sidebarOpen ? "ad-sidebar-open" : ""}`}>
        <div className="ad-sidebar-light-header">
          Main Menu
        </div>
        <nav className="ad-sidebar-light-nav">
          <Link href="/admin" className={`ad-nav-light-item ${pathname === "/admin" ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
            <div className={`ad-nav-light-icon ${pathname === "/admin" ? "bg-blue" : "bg-gray"}`}>
              <Home size={18} color="#fff" />
            </div>
            <span>Dashboard</span>
          </Link>

          <div className="ad-nav-light-group">
            <button className="ad-nav-light-item" onClick={() => setMasterSetupOpen(!masterSetupOpen)}>
              <div className="ad-nav-light-icon bg-red">
                <Grid size={18} color="#fff" />
              </div>
              <span>Master Setup</span>
              <div style={{ marginLeft: "auto" }}>
                {masterSetupOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>
            
            {masterSetupOpen && (
              <div className="ad-nav-light-sub">
                {navItems.map((item) => {
                  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href} className={`ad-nav-light-subitem ${isActive ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                      <ChevronRight size={14} className="ad-sub-icon" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="ad-nav-light-item" style={{ marginTop: 'auto', borderTop: '1px solid #f3f4f6', paddingTop: '15px' }}>
            <div className="ad-nav-light-icon bg-gray">
              <LogOut size={18} color="#fff" />
            </div>
            <span>Log out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="ad-main-area">
        {/* Topbar */}
        <header className="ad-topbar-light">
          <div className="ad-topbar-left">
            <button className="ad-menu-toggle-light" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          <div className="ad-topbar-right">
            <div className="ad-user-menu">
              <button className="ad-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="ad-avatar">A</div>
                <span className="hidden-mobile">Administrator</span>
                <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="ad-dropdown">
                  <div className="ad-dropdown-item">Profile</div>
                  <div className="ad-dropdown-item">Change Password</div>
                  <div className="ad-dropdown-divider"></div>
                  <button className="ad-dropdown-item ad-text-danger" onClick={handleLogout}>Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="ad-content">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
