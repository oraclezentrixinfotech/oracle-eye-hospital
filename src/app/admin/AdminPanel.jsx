"use client";
import Link from "next/link";
import { Settings, Megaphone, Image as ImageIcon, Video, Mail, Calendar, Layout, Tv, Play, FileText } from "lucide-react";
import "./admin.css";

export default function AdminPanel({ counts }) {
  return (
    <div>
      <div className="ad-stats-grid">
        
        {/* Website Settings */}
        <Link href="/admin/settings" className="ad-stat-box" style={{ textDecoration: 'none' }}>
          <div className="ad-stat-box-float bg-blue">
            <Settings size={28} color="#fff" />
          </div>
          <div className="ad-stat-box-top">
            <div className="ad-stat-box-title text-blue">Website Settings</div>
            <div className="ad-stat-box-value">&nbsp;</div> {/* Empty value to keep alignment */}
          </div>
          <div className="ad-stat-box-bottom">
            <Layout size={14} /> Configuration
          </div>
        </Link>

        {/* Total News */}
        <Link href="/admin/news" className="ad-stat-box" style={{ textDecoration: 'none' }}>
          <div className="ad-stat-box-float bg-pink">
            <Megaphone size={28} color="#fff" />
          </div>
          <div className="ad-stat-box-top">
            <div className="ad-stat-box-title text-pink">Total News</div>
            <div className="ad-stat-box-value">{counts.news}</div>
          </div>
          <div className="ad-stat-box-bottom">
            <Tv size={14} color="#f06292" /> Published News
          </div>
        </Link>

        {/* Total Photos */}
        <Link href="/admin/photo-gallery" className="ad-stat-box" style={{ textDecoration: 'none' }}>
          <div className="ad-stat-box-float bg-green">
            <ImageIcon size={28} color="#fff" />
          </div>
          <div className="ad-stat-box-top">
            <div className="ad-stat-box-title text-green">Total Photos</div>
            <div className="ad-stat-box-value">{counts.photos}</div>
          </div>
          <div className="ad-stat-box-bottom">
            <ImageIcon size={14} color="#8bc34a" /> Gallery Items
          </div>
        </Link>

        {/* Total Videos */}
        <Link href="/admin/video-gallery" className="ad-stat-box" style={{ textDecoration: 'none' }}>
          <div className="ad-stat-box-float bg-orange">
            <Video size={28} color="#fff" />
          </div>
          <div className="ad-stat-box-top">
            <div className="ad-stat-box-title text-orange">Total Videos</div>
            <div className="ad-stat-box-value">{counts.videos}</div>
          </div>
          <div className="ad-stat-box-bottom">
            <Play size={14} color="#ff8a65" /> Video Library
          </div>
        </Link>

        {/* Total Contacts */}
        <Link href="/admin/enquiries" className="ad-stat-box" style={{ textDecoration: 'none' }}>
          <div className="ad-stat-box-float bg-blue">
            <Mail size={28} color="#fff" />
          </div>
          <div className="ad-stat-box-top">
            <div className="ad-stat-box-title text-blue">Total Contacts</div>
            <div className="ad-stat-box-value">{counts.enquiries}</div>
          </div>
          <div className="ad-stat-box-bottom">
            <Mail size={14} color="#4e7cff" /> Contact Messages
          </div>
        </Link>

        {/* Total Appointments */}
        <Link href="/admin/appointments" className="ad-stat-box" style={{ textDecoration: 'none' }}>
          <div className="ad-stat-box-float bg-green">
            <Calendar size={28} color="#fff" />
          </div>
          <div className="ad-stat-box-top">
            <div className="ad-stat-box-title text-green">Total Appointments</div>
            <div className="ad-stat-box-value">{counts.appointments}</div>
          </div>
          <div className="ad-stat-box-bottom">
            <Calendar size={14} color="#8bc34a" /> Doctor Appointments
          </div>
        </Link>

        {/* Total SEO Pages */}
        <Link href="/admin/seo-pages" className="ad-stat-box" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div className="ad-stat-box-float bg-teal">
            <FileText size={28} color="#fff" />
          </div>
          <div className="ad-stat-box-top">
            <div className="ad-stat-box-title text-teal">Total SEO Pages</div>
            <div className="ad-stat-box-value">{counts.seoPages ?? 0}</div>
          </div>
          <div className="ad-stat-box-bottom" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} color="#0d9488" /> Manage SEO Pages
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#0d9488', background: '#ccfbf1', padding: '2px 6px', borderRadius: 4 }}>
              {counts.seoPagesPublished ?? 0} Published
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
}
