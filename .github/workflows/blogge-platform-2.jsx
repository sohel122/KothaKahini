import { useState, useEffect, useRef } from "react";

// ── Palette & tokens ──────────────────────────────────────────────
// Dark-first editorial palette: deep slate canvas, crisp white text,
// electric violet accent (#7C3AED), warm amber for engagement cues.
// Light mode inverts to soft white + deep slate text.
// Signature: the animated "ink-drop" post-publish ripple effect.

const THEMES = {
  dark: {
    bg: "#0F0F14",
    surface: "#17171F",
    surfaceHover: "#1E1E28",
    border: "#2A2A38",
    text: "#F1F0F5",
    textMuted: "#8B8AA0",
    accent: "#7C3AED",
    accentLight: "#9F67FF",
    accentBg: "#1E1635",
    amber: "#F59E0B",
    green: "#10B981",
    red: "#EF4444",
    cardShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  light: {
    bg: "#F8F7FC",
    surface: "#FFFFFF",
    surfaceHover: "#F3F2F8",
    border: "#E4E3EF",
    text: "#1A1928",
    textMuted: "#6B6A80",
    accent: "#7C3AED",
    accentLight: "#9F67FF",
    accentBg: "#EDE9FE",
    amber: "#D97706",
    green: "#059669",
    red: "#DC2626",
    cardShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
};

const SAMPLE_POSTS = [
  { id: 1, title: "React 19-এর নতুন ফিচার: একটি সম্পূর্ণ গাইড", slug: "react-19-features-guide", category: "Technology", tags: ["React","JavaScript","Frontend"], views: 12840, likes: 384, comments: 47, date: "2025-06-10", status: "published", featured: true, excerpt: "React 19 এনেছে অনেক নতুন সুবিধা যা আপনার ডেভেলপমেন্ট অভিজ্ঞতাকে সম্পূর্ণ বদলে দেবে।", readTime: "8 মিনিট" },
  { id: 2, title: "AI দিয়ে ব্লগ লেখার সেরা কৌশল", slug: "ai-blog-writing-tips", category: "AI & Tools", tags: ["AI","Content","Writing"], views: 9210, likes: 271, comments: 33, date: "2025-06-08", status: "published", featured: false, excerpt: "কৃত্রিম বুদ্ধিমত্তা ব্যবহার করে কীভাবে আপনার ব্লগের মান উন্নত করবেন তা জানুন।", readTime: "6 মিনিট" },
  { id: 3, title: "MongoDB Aggregation Pipeline: Advanced Techniques", slug: "mongodb-aggregation-advanced", category: "Backend", tags: ["MongoDB","Node.js","Database"], views: 7650, likes: 198, comments: 29, date: "2025-06-05", status: "published", featured: false, excerpt: "Aggregation pipeline-এর শক্তিশালী ব্যবহার শিখুন এবং আপনার queries আরও দ্রুত করুন।", readTime: "10 মিনিট" },
  { id: 4, title: "Tailwind CSS 4.0: What Changed Everything", slug: "tailwind-css-4-changes", category: "CSS", tags: ["Tailwind","CSS","Design"], views: 6340, likes: 156, comments: 21, date: "2025-06-02", status: "draft", featured: false, excerpt: "Tailwind CSS 4.0 আনে সম্পূর্ণ নতুন আর্কিটেকচার যা পুরো স্টাইলিং প্রক্রিয়া পাল্টে দেয়।", readTime: "7 মিনিট" },
  { id: 5, title: "Socket.io দিয়ে রিয়েল-টাইম চ্যাট অ্যাপ তৈরি", slug: "socketio-realtime-chat", category: "Backend", tags: ["Socket.io","Node.js","Realtime"], views: 11200, likes: 342, comments: 58, date: "2025-05-28", status: "published", featured: true, excerpt: "Socket.io ব্যবহার করে কীভাবে একটি পূর্ণাঙ্গ রিয়েল-টাইম চ্যাট সিস্টেম বানাবেন।", readTime: "12 মিনিট" },
];

const STATS = {
  totalVisitors: 284920,
  liveVisitors: 47,
  totalPosts: 124,
  totalComments: 1847,
  totalEarnings: 12480,
  monthlyGrowth: 18.4,
};

const CATEGORIES = ["Technology","AI & Tools","Backend","CSS","Design","Mobile","DevOps","Career"];
const COLORS = { Technology:"#7C3AED", "AI & Tools":"#F59E0B", Backend:"#10B981", CSS:"#3B82F6", Design:"#EC4899", Mobile:"#F97316", DevOps:"#06B6D4", Career:"#84CC16" };

// ── Top-level App ─────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("dark");
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [liveCount, setLiveCount] = useState(47);
  const t = THEMES[mode];

  useEffect(() => {
    const iv = setInterval(() => setLiveCount(n => Math.max(30, n + (Math.random() > 0.5 ? 1 : -1))), 3000);
    return () => clearInterval(iv);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const nav = (p) => { setPage(p); setSideOpen(true); };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
    body { font-family: 'Inter', sans-serif; }
    ::-webkit-scrollbar { width:6px; height:6px; }
    ::-webkit-scrollbar-track { background:${t.bg}; }
    ::-webkit-scrollbar-thumb { background:${t.border}; border-radius:3px; }
    .fade-in { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
    .ripple { animation: rippleAnim 0.6s ease-out; }
    @keyframes rippleAnim { 0%{transform:scale(0);opacity:0.8} 100%{transform:scale(4);opacity:0} }
    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .skeleton { background: linear-gradient(90deg, ${t.surface} 25%, ${t.border} 50%, ${t.surface} 75%); background-size:200% 100%; animation: shimmer 1.4s infinite; }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    .btn { cursor:pointer; border:none; outline:none; transition: all 0.15s; }
    .btn:hover { transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }
    input,textarea,select { outline:none; font-family:inherit; }
    a { text-decoration:none; }
  `;

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{css}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:9999,
          background: toast.type === "success" ? t.green : toast.type === "error" ? t.red : t.amber,
          color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:500,
          boxShadow:"0 8px 32px rgba(0,0,0,0.3)", display:"flex", alignItems:"center", gap:8
        }} className="fade-in">
          <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}</span>
          {toast.msg}
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && <SearchOverlay t={t} onClose={() => setSearchOpen(false)} posts={SAMPLE_POSTS} />}

      <div style={{ display:"flex", minHeight:"100vh" }}>
        {/* Sidebar */}
        {sideOpen && <Sidebar t={t} page={page} nav={nav} onClose={() => setSideOpen(false)} />}

        {/* Main */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Topbar */}
          <Topbar
            t={t} mode={mode} setMode={setMode}
            sideOpen={sideOpen} setSideOpen={setSideOpen}
            notifOpen={notifOpen} setNotifOpen={setNotifOpen}
            userMenuOpen={userMenuOpen} setUserMenuOpen={setUserMenuOpen}
            searchOpen={searchOpen} setSearchOpen={setSearchOpen}
            liveCount={liveCount} page={page} nav={nav}
          />

          {/* Page content */}
          <main style={{ flex:1, overflow:"auto", padding:"24px" }} className="fade-in" key={page}>
            {page === "dashboard" && <DashboardPage t={t} stats={STATS} posts={SAMPLE_POSTS} liveCount={liveCount} nav={nav} />}
            {page === "posts" && <PostsPage t={t} posts={SAMPLE_POSTS} showToast={showToast} nav={nav} />}
            {page === "new-post" && <NewPostPage t={t} showToast={showToast} nav={nav} />}
            {page === "stats" && <StatsPage t={t} stats={STATS} posts={SAMPLE_POSTS} liveCount={liveCount} />}
            {page === "comments" && <CommentsPage t={t} showToast={showToast} />}
            {page === "earnings" && <EarningsPage t={t} showToast={showToast} />}
            {page === "pages" && <PagesPage t={t} showToast={showToast} />}
            {page === "media" && <MediaPage t={t} showToast={showToast} />}
            {page === "theme" && <ThemePage t={t} showToast={showToast} />}
            {page === "layout" && <LayoutPage t={t} />}
            {page === "settings" && <SettingsPage t={t} showToast={showToast} />}
            {page === "ai-tools" && <AIToolsPage t={t} showToast={showToast} />}
            {page === "admin" && <AdminPage t={t} showToast={showToast} />}
            {page === "seo" && <SEOPage t={t} showToast={showToast} />}
            {page === "preview" && <PreviewPage t={t} posts={SAMPLE_POSTS} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ t, page, nav }) {
  const items = [
    { id:"dashboard", icon:"⊞", label:"ড্যাশবোর্ড", en:"Dashboard" },
    { id:"posts", icon:"✍", label:"পোস্টসমূহ", en:"Posts" },
    { id:"new-post", icon:"＋", label:"নতুন পোস্ট", en:"New Post", accent:true },
    { id:"stats", icon:"📊", label:"পরিসংখ্যান", en:"Stats" },
    { id:"comments", icon:"💬", label:"মন্তব্য", en:"Comments", badge:23 },
    { id:"earnings", icon:"💰", label:"আয়", en:"Earnings" },
    { id:"pages", icon:"📄", label:"পেজসমূহ", en:"Pages" },
    { id:"media", icon:"🖼", label:"মিডিয়া", en:"Media" },
    { id:"layout", icon:"⊡", label:"লেআউট", en:"Layout" },
    { id:"theme", icon:"🎨", label:"থিম", en:"Theme" },
    { id:"seo", icon:"🔍", label:"SEO টুলস", en:"SEO Tools" },
    { id:"ai-tools", icon:"🤖", label:"AI টুলস", en:"AI Tools" },
    { id:"settings", icon:"⚙", label:"সেটিংস", en:"Settings" },
    { id:"admin", icon:"🛡", label:"অ্যাডমিন", en:"Admin" },
    { id:"preview", icon:"👁", label:"প্রিভিউ", en:"Preview" },
  ];

  return (
    <div style={{
      width:240, background:t.surface, borderRight:`1px solid ${t.border}`,
      display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0,
      overflow:"auto", flexShrink:0
    }}>
      {/* Logo */}
      <div style={{ padding:"20px 20px 16px", borderBottom:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg,${t.accent},${t.accentLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>✍</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontWeight:800, fontSize:17, color:t.text, letterSpacing:"-0.3px" }}>Blogge</div>
            <div style={{ fontSize:10, color:t.textMuted, marginTop:1 }}>Premium Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"12px 10px", display:"flex", flexDirection:"column", gap:2 }}>
        {items.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => nav(item.id)} className="btn" style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
              borderRadius:8, width:"100%", textAlign:"left",
              background: active ? t.accentBg : "transparent",
              color: active ? t.accentLight : item.accent ? t.accent : t.textMuted,
              fontSize:13, fontWeight: active ? 600 : 400,
              border: active ? `1px solid ${t.accent}30` : "1px solid transparent",
              transition:"all 0.15s", cursor:"pointer",
              position:"relative"
            }}>
              <span style={{ fontSize:15, width:18, textAlign:"center" }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ background:t.accent, color:"#fff", fontSize:10, fontWeight:700, borderRadius:20, padding:"1px 6px" }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${t.accent},${t.amber})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>রা</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>রাহেলা আক্তার</div>
            <div style={{ fontSize:10, color:t.green }}>● অ্যাডমিন</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Topbar ────────────────────────────────────────────────────────
function Topbar({ t, mode, setMode, sideOpen, setSideOpen, notifOpen, setNotifOpen, searchOpen, setSearchOpen, liveCount, page, nav }) {
  const pageLabels = { dashboard:"ড্যাশবোর্ড", posts:"পোস্টসমূহ", "new-post":"নতুন পোস্ট", stats:"পরিসংখ্যান", comments:"মন্তব্য", earnings:"আয়", pages:"পেজসমূহ", media:"মিডিয়া", layout:"লেআউট", theme:"থিম", seo:"SEO টুলস", "ai-tools":"AI টুলস", settings:"সেটিংস", admin:"অ্যাডমিন", preview:"প্রিভিউ" };

  const notifs = [
    { icon:"💬", msg:"নতুন মন্তব্য: 'দারুণ লেখা!'", time:"2 মিনিট আগে", unread:true },
    { icon:"👍", msg:"আপনার পোস্টে 50টি লাইক", time:"15 মিনিট আগে", unread:true },
    { icon:"👤", msg:"নতুন সাবস্ক্রাইবার: ahmed.dev", time:"1 ঘন্টা আগে", unread:false },
    { icon:"📊", msg:"মাসিক রিপোর্ট প্রস্তুত", time:"3 ঘন্টা আগে", unread:false },
  ];

  return (
    <div style={{ height:56, background:t.surface, borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:12, position:"sticky", top:0, zIndex:100 }}>
      <button onClick={() => setSideOpen(s => !s)} className="btn" style={{ background:"transparent", color:t.textMuted, fontSize:18, padding:"4px 8px", borderRadius:6 }}>☰</button>
      
      <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:13, color:t.textMuted }}>Blogge</span>
        <span style={{ color:t.border }}>›</span>
        <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{pageLabels[page] || page}</span>
      </div>

      {/* Live visitors */}
      <div style={{ display:"flex", alignItems:"center", gap:6, background:t.accentBg, border:`1px solid ${t.accent}40`, borderRadius:20, padding:"4px 12px" }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:t.green, display:"inline-block" }} className="pulse"></span>
        <span style={{ fontSize:12, color:t.green, fontWeight:600 }}>{liveCount} লাইভ</span>
      </div>

      {/* Search */}
      <button onClick={() => setSearchOpen(true)} className="btn" style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.textMuted, borderRadius:8, padding:"6px 12px", fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
        <span>🔍</span> <span style={{ color:t.textMuted }}>অনুসন্ধান...</span>
        <kbd style={{ background:t.border, borderRadius:4, padding:"1px 5px", fontSize:10, color:t.textMuted }}>⌘K</kbd>
      </button>

      {/* Dark mode toggle */}
      <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} className="btn" style={{
        width:36, height:36, borderRadius:8, background:t.surfaceHover, border:`1px solid ${t.border}`,
        color:t.textMuted, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center"
      }}>
        {mode === "dark" ? "☀" : "🌙"}
      </button>

      {/* Notifications */}
      <div style={{ position:"relative" }}>
        <button onClick={() => setNotifOpen(n => !n)} className="btn" style={{
          width:36, height:36, borderRadius:8, background:t.surfaceHover, border:`1px solid ${t.border}`,
          color:t.textMuted, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", position:"relative"
        }}>
          🔔
          <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:t.red, border:`2px solid ${t.surface}` }}></span>
        </button>
        {notifOpen && (
          <div style={{ position:"absolute", top:44, right:0, width:300, background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, boxShadow:t.cardShadow, zIndex:200 }} className="fade-in">
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, fontWeight:600, fontSize:13, color:t.text }}>বিজ্ঞপ্তি</div>
            {notifs.map((n, i) => (
              <div key={i} style={{ padding:"10px 16px", display:"flex", gap:10, alignItems:"flex-start", background: n.unread ? t.accentBg : "transparent", borderBottom:`1px solid ${t.border}20` }}>
                <span style={{ fontSize:18 }}>{n.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:t.text, lineHeight:1.4 }}>{n.msg}</div>
                  <div style={{ fontSize:10, color:t.textMuted, marginTop:2 }}>{n.time}</div>
                </div>
                {n.unread && <span style={{ width:7, height:7, borderRadius:"50%", background:t.accent, flexShrink:0, marginTop:4 }}></span>}
              </div>
            ))}
            <div style={{ padding:"10px 16px" }}>
              <button className="btn" style={{ width:"100%", background:t.accentBg, color:t.accentLight, borderRadius:8, padding:"7px", fontSize:12, fontWeight:600, border:`1px solid ${t.accent}40` }}>সব দেখুন</button>
            </div>
          </div>
        )}
      </div>

      {/* User avatar */}
      <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${t.accent},${t.amber})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>রা</div>
    </div>
  );
}

// ── Search overlay ────────────────────────────────────────────────
function SearchOverlay({ t, onClose, posts }) {
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); }, []);
  const results = q.length > 1 ? posts.filter(p => p.title.toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", zIndex:9000, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:80 }}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:560, background:t.surface, borderRadius:14, border:`1px solid ${t.border}`, boxShadow:t.cardShadow, overflow:"hidden" }} className="fade-in">
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px", borderBottom:`1px solid ${t.border}` }}>
          <span style={{ fontSize:16, color:t.textMuted }}>🔍</span>
          <input ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="পোস্ট, পেজ বা সেটিংস খুঁজুন..." style={{ flex:1, background:"transparent", border:"none", color:t.text, fontSize:15 }} />
          <kbd onClick={onClose} style={{ background:t.border, borderRadius:4, padding:"2px 7px", fontSize:11, color:t.textMuted, cursor:"pointer" }}>ESC</kbd>
        </div>
        {results.length > 0 ? results.map(p => (
          <div key={p.id} onClick={onClose} style={{ padding:"12px 16px", display:"flex", gap:12, alignItems:"center", cursor:"pointer", borderBottom:`1px solid ${t.border}20` }}
            onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize:20 }}>✍</span>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color:t.text }}>{p.title}</div>
              <div style={{ fontSize:11, color:t.textMuted }}>{p.category} · {p.date}</div>
            </div>
          </div>
        )) : q.length > 1 ? (
          <div style={{ padding:"24px 16px", textAlign:"center", color:t.textMuted, fontSize:13 }}>কোনো ফলাফল পাওয়া যায়নি</div>
        ) : (
          <div style={{ padding:"16px" }}>
            <div style={{ fontSize:11, fontWeight:600, color:t.textMuted, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>সাম্প্রতিক পোস্ট</div>
            {posts.slice(0,3).map(p => (
              <div key={p.id} style={{ padding:"8px 0", display:"flex", gap:10, cursor:"pointer" }}>
                <span style={{ fontSize:14 }}>📝</span>
                <span style={{ fontSize:13, color:t.text }}>{p.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────
function DashboardPage({ t, stats, posts, liveCount, nav }) {
  const statCards = [
    { label:"মোট দর্শক", value: stats.totalVisitors.toLocaleString(), icon:"👥", color:t.accent, change:"+18.4%" },
    { label:"লাইভ দর্শক", value:liveCount, icon:"●", color:t.green, change:"রিয়েল-টাইম" },
    { label:"মোট পোস্ট", value:stats.totalPosts, icon:"✍", color:t.amber, change:"+3 এই মাসে" },
    { label:"মোট আয়", value:`৳${stats.totalEarnings.toLocaleString()}`, icon:"💰", color:"#10B981", change:"+৳2,140 এই মাসে" },
  ];

  return (
    <div style={{ maxWidth:1100, margin:"0 auto" }}>
      {/* Welcome */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:22, fontFamily:"'Playfair Display', serif", fontWeight:700, color:t.text }}>স্বাগতম, রাহেলা! 👋</div>
        <div style={{ fontSize:13, color:t.textMuted, marginTop:4 }}>আজ আপনার ব্লগের সব কিছু এক নজরে দেখুন</div>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, marginBottom:24 }}>
        {statCards.map((s,i) => (
          <div key={i} style={{ background:t.surface, borderRadius:12, padding:"20px", border:`1px solid ${t.border}`, boxShadow:t.cardShadow }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:12, color:t.textMuted, marginBottom:6 }}>{s.label}</div>
                <div style={{ fontSize:26, fontWeight:700, color:t.text, letterSpacing:"-0.5px" }}>{s.value}</div>
              </div>
              <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
            </div>
            <div style={{ fontSize:11, color: i === 1 ? t.green : t.accent }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
        {/* Recent posts */}
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontWeight:600, fontSize:14, color:t.text }}>সাম্প্রতিক পোস্ট</span>
            <button onClick={() => nav("posts")} className="btn" style={{ background:"transparent", color:t.accent, fontSize:12, padding:"4px 10px", borderRadius:6, border:`1px solid ${t.accent}40` }}>সব দেখুন</button>
          </div>
          {posts.slice(0,4).map(p => (
            <div key={p.id} style={{ padding:"14px 20px", borderBottom:`1px solid ${t.border}20`, display:"flex", gap:14, alignItems:"center" }}
              onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width:44, height:44, borderRadius:8, background:`linear-gradient(135deg,${t.accent}60,${t.amber}60)`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✍</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:3 }}>{p.title}</div>
                <div style={{ display:"flex", gap:12, fontSize:11, color:t.textMuted }}>
                  <span>👁 {p.views.toLocaleString()}</span>
                  <span>👍 {p.likes}</span>
                  <span>💬 {p.comments}</span>
                </div>
              </div>
              <StatusBadge t={t} status={p.status} />
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Quick actions */}
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:12 }}>দ্রুত কাজ</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                {label:"নতুন পোস্ট", icon:"✍", page:"new-post"},
                {label:"মিডিয়া", icon:"🖼", page:"media"},
                {label:"AI লেখক", icon:"🤖", page:"ai-tools"},
                {label:"সেটিংস", icon:"⚙", page:"settings"},
              ].map(a => (
                <button key={a.page} onClick={() => nav(a.page)} className="btn" style={{
                  background:t.surfaceHover, border:`1px solid ${t.border}`, borderRadius:8, padding:"10px 8px",
                  color:t.text, fontSize:12, display:"flex", alignItems:"center", gap:6, cursor:"pointer"
                }}>
                  <span>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top posts */}
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:12 }}>শীর্ষ পোস্ট</div>
            {posts.sort((a,b) => b.views - a.views).slice(0,4).map((p,i) => (
              <div key={p.id} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:11, color:t.textMuted, width:16, fontWeight:600 }}>#{i+1}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</div>
                  <div style={{ fontSize:10, color:t.textMuted }}>{p.views.toLocaleString()} দর্শন</div>
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:12 }}>ক্যাটাগরি</div>
            {CATEGORIES.slice(0,5).map(c => (
              <div key={c} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:COLORS[c] || t.accent, flexShrink:0 }}></span>
                <span style={{ flex:1, fontSize:12, color:t.text }}>{c}</span>
                <span style={{ fontSize:11, color:t.textMuted }}>{Math.floor(Math.random()*20+5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Posts Page ────────────────────────────────────────────────────
function PostsPage({ t, posts, showToast, nav }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = posts.filter(p => (filter === "all" || p.status === filter) && p.title.includes(search));

  return (
    <div style={{ maxWidth:1000, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif" }}>পোস্টসমূহ</h1>
          <p style={{ fontSize:12, color:t.textMuted, marginTop:2 }}>{posts.length}টি পোস্ট পাওয়া গেছে</p>
        </div>
        <button onClick={() => nav("new-post")} className="btn" style={{ background:`linear-gradient(135deg,${t.accent},${t.accentLight})`, color:"#fff", padding:"9px 18px", borderRadius:9, fontSize:13, fontWeight:600, boxShadow:`0 4px 12px ${t.accent}40` }}>
          + নতুন পোস্ট
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {["all","published","draft"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn" style={{
            padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:500,
            background: filter === f ? t.accent : t.surface,
            color: filter === f ? "#fff" : t.textMuted,
            border:`1px solid ${filter === f ? t.accent : t.border}`
          }}>
            {f === "all" ? "সব" : f === "published" ? "প্রকাশিত" : "খসড়া"}
          </button>
        ))}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="পোস্ট খুঁজুন..." style={{
          marginLeft:"auto", background:t.surface, border:`1px solid ${t.border}`, color:t.text,
          borderRadius:8, padding:"6px 12px", fontSize:12, width:200
        }} />
      </div>

      {/* Posts list */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px 20px", display:"flex", gap:16, alignItems:"center", boxShadow:t.cardShadow }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.accent + "60"}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
            {/* Thumbnail */}
            <div style={{ width:60, height:60, borderRadius:8, background:`linear-gradient(135deg,${t.accent}50,${t.amber}50)`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
              {p.featured ? "⭐" : "✍"}
            </div>
            {/* Info */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:14, fontWeight:600, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</span>
                {p.featured && <span style={{ fontSize:10, background:t.amber+"20", color:t.amber, padding:"1px 6px", borderRadius:4, fontWeight:600, flexShrink:0 }}>ফিচার্ড</span>}
              </div>
              <div style={{ fontSize:11, color:t.textMuted, display:"flex", gap:14, flexWrap:"wrap" }}>
                <span>📂 {p.category}</span>
                <span>👁 {p.views.toLocaleString()}</span>
                <span>👍 {p.likes}</span>
                <span>💬 {p.comments}</span>
                <span>🕐 {p.readTime}</span>
                <span>📅 {p.date}</span>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
              <StatusBadge t={t} status={p.status} />
              <button onClick={() => nav("new-post")} className="btn" style={{ background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:6, padding:"5px 12px", fontSize:11, fontWeight:600 }}>সম্পাদনা</button>
              <button onClick={() => showToast("পোস্ট মুছে ফেলা হয়েছে", "error")} className="btn" style={{ background:t.red+"15", color:t.red, border:`1px solid ${t.red}40`, borderRadius:6, padding:"5px 8px", fontSize:11 }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── New Post Page ─────────────────────────────────────────────────
function NewPostPage({ t, showToast, nav }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("React, JavaScript");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [slug, setSlug] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    setSlug(title.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,"").slice(0,60));
  }, [title]);

  const handleSave = (status) => {
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast(status === "published" ? "পোস্ট সফলভাবে প্রকাশিত হয়েছে! 🎉" : "খসড়া সংরক্ষিত হয়েছে"); }, 1200);
  };

  const generateWithAI = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{ role:"user", content:`Write a detailed blog post in Bengali about: "${aiPrompt}". Include an intro, 3-4 subheadings with content, and a conclusion. Format it as clean paragraphs.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text||"").join("");
      if (text) { setContent(text); setTitle(aiPrompt); showToast("AI দিয়ে কন্টেন্ট তৈরি হয়েছে!"); }
    } catch { showToast("AI সংযোগে সমস্যা হয়েছে", "error"); }
    setAiLoading(false);
  };

  const toolbar = ["B","I","U","H1","H2","🔗","🖼","📹","—","❝","📋"];

  return (
    <div style={{ maxWidth:1050, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif" }}>নতুন পোস্ট লিখুন</h1>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => handleSave("draft")} className="btn" style={{ background:t.surface, border:`1px solid ${t.border}`, color:t.textMuted, padding:"8px 16px", borderRadius:8, fontSize:13 }}>
            {saving ? "সংরক্ষণ..." : "খসড়া সংরক্ষণ"}
          </button>
          <button onClick={() => handleSave("published")} className="btn" style={{ background:`linear-gradient(135deg,${t.accent},${t.accentLight})`, color:"#fff", padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, boxShadow:`0 4px 12px ${t.accent}40` }}>
            প্রকাশ করুন
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20 }}>
        {/* Editor */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Title */}
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="পোস্টের শিরোনাম লিখুন..." style={{
            background:t.surface, border:`1px solid ${t.border}`, color:t.text,
            borderRadius:10, padding:"14px 16px", fontSize:20, fontFamily:"'Playfair Display', serif", fontWeight:700,
            width:"100%", transition:"border-color 0.2s"
          }} onFocus={e => e.target.style.borderColor = t.accent}
             onBlur={e => e.target.style.borderColor = t.border} />

          {/* AI Writer */}
          <div style={{ background:t.accentBg, border:`1px solid ${t.accent}40`, borderRadius:10, padding:"12px 14px" }}>
            <div style={{ fontSize:12, fontWeight:600, color:t.accentLight, marginBottom:8 }}>🤖 AI কন্টেন্ট রাইটার</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="টপিক দিন (যেমন: React Hooks কী এবং কীভাবে ব্যবহার করবেন)" style={{
                flex:1, background:t.surface, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"7px 12px", fontSize:12
              }} />
              <button onClick={generateWithAI} disabled={aiLoading} className="btn" style={{ background:t.accent, color:"#fff", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:600, opacity: aiLoading ? 0.7 : 1 }}>
                {aiLoading ? "⏳" : "✨ তৈরি"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
            <div style={{ display:"flex", borderBottom:`1px solid ${t.border}` }}>
              {["write","preview"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="btn" style={{
                  flex:1, padding:"10px", fontSize:13, fontWeight:500,
                  background: activeTab === tab ? t.accentBg : "transparent",
                  color: activeTab === tab ? t.accentLight : t.textMuted,
                  borderBottom: activeTab === tab ? `2px solid ${t.accent}` : "2px solid transparent"
                }}>
                  {tab === "write" ? "✍ লিখুন" : "👁 প্রিভিউ"}
                </button>
              ))}
            </div>

            {activeTab === "write" ? (
              <>
                {/* Toolbar */}
                <div style={{ display:"flex", gap:2, padding:"8px 10px", borderBottom:`1px solid ${t.border}`, flexWrap:"wrap" }}>
                  {toolbar.map(btn => (
                    <button key={btn} className="btn" style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.textMuted, borderRadius:5, padding:"4px 8px", fontSize:12, minWidth:30 }}>{btn}</button>
                  ))}
                </div>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="এখানে আপনার পোস্ট লিখুন... Markdown সমর্থিত।

## শিরোনাম লিখুন
কন্টেন্ট লিখুন এখানে। **Bold**, *Italic*, [Link](url) সমর্থিত।" style={{
                  width:"100%", minHeight:320, background:"transparent", border:"none", color:t.text,
                  padding:"16px", fontSize:14, lineHeight:1.8, resize:"vertical"
                }} />
              </>
            ) : (
              <div style={{ padding:"16px", minHeight:320, fontSize:14, lineHeight:1.8, color:t.text }}>
                {content || <span style={{ color:t.textMuted }}>লেখা শুরু করুন প্রিভিউ দেখতে...</span>}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar settings */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Publish settings */}
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:12 }}>প্রকাশনা সেটিংস</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <label style={{ fontSize:12, color:t.textMuted }}>ক্যাটাগরি</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"7px 10px", fontSize:12, width:"100%" }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <label style={{ fontSize:12, color:t.textMuted }}>ট্যাগ (কমা দিয়ে)</label>
              <input value={tags} onChange={e => setTags(e.target.value)} style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"7px 10px", fontSize:12 }} />
              <label style={{ fontSize:12, color:t.textMuted }}>কাস্টম URL</label>
              <div style={{ display:"flex", alignItems:"center", background:t.surfaceHover, border:`1px solid ${t.border}`, borderRadius:7, overflow:"hidden" }}>
                <span style={{ padding:"7px 8px", fontSize:10, color:t.textMuted, borderRight:`1px solid ${t.border}`, background:t.surface }}>blogge.com/</span>
                <input value={slug} onChange={e => setSlug(e.target.value)} style={{ flex:1, background:"transparent", border:"none", color:t.text, padding:"7px 8px", fontSize:12 }} />
              </div>
              <label style={{ fontSize:12, color:t.textMuted }}>শিডিউল তারিখ (ঐচ্ছিক)</label>
              <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"7px 10px", fontSize:12 }} />
            </div>
          </div>

          {/* Featured image */}
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:10 }}>ফিচার্ড ইমেজ</div>
            <div style={{ border:`2px dashed ${t.border}`, borderRadius:8, padding:"24px 16px", textAlign:"center", cursor:"pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
              <div style={{ fontSize:28, marginBottom:8 }}>🖼</div>
              <div style={{ fontSize:12, color:t.textMuted, marginBottom:8 }}>ছবি টেনে আনুন বা ক্লিক করুন</div>
              <button className="btn" style={{ background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:6, padding:"5px 12px", fontSize:11 }}>ছবি বেছে নিন</button>
            </div>
            <button className="btn" style={{ width:"100%", marginTop:8, background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.textMuted, borderRadius:7, padding:"7px", fontSize:11 }}>
              ✨ AI দিয়ে ছবি তৈরি করুন
            </button>
          </div>

          {/* SEO */}
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px" }}>
            <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:10 }}>SEO সেটিংস</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ fontSize:11, color:t.textMuted }}>Meta Title ({metaTitle.length}/60)</label>
              <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} maxLength={60} placeholder="SEO শিরোনাম..." style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"7px 10px", fontSize:12 }} />
              <div style={{ height:3, borderRadius:2, background:t.border, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(metaTitle.length/60)*100}%`, background: metaTitle.length > 50 ? t.red : t.green, transition:"width 0.2s" }}></div>
              </div>
              <label style={{ fontSize:11, color:t.textMuted }}>Meta Description ({metaDesc.length}/160)</label>
              <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} maxLength={160} placeholder="SEO বিবরণ..." rows={3} style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"7px 10px", fontSize:12, resize:"none" }} />
              <button className="btn" style={{ background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:7, padding:"7px", fontSize:11, fontWeight:600 }}>
                🤖 AI SEO সুপারিশ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Page ────────────────────────────────────────────────────
function StatsPage({ t, stats, posts, liveCount }) {
  const [period, setPeriod] = useState("7d");
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const chartData = Array.from({length:days}, (_,i) => ({
    label: new Date(Date.now() - (days-1-i)*86400000).toLocaleDateString("bn-BD",{month:"short",day:"numeric"}),
    views: Math.floor(Math.random()*800 + 200),
    visitors: Math.floor(Math.random()*400 + 100),
  }));
  const maxV = Math.max(...chartData.map(d => d.views));

  const devices = [
    { label:"মোবাইল", pct:58, color:t.accent },
    { label:"ডেস্কটপ", pct:35, color:t.amber },
    { label:"ট্যাবলেট", pct:7, color:t.green },
  ];
  const countries = [
    { name:"বাংলাদেশ", flag:"🇧🇩", pct:64, visits:182350 },
    { name:"ভারত", flag:"🇮🇳", pct:18, visits:51260 },
    { name:"যুক্তরাষ্ট্র", flag:"🇺🇸", pct:8, visits:22800 },
    { name:"যুক্তরাজ্য", flag:"🇬🇧", pct:5, visits:14240 },
    { name:"কানাডা", flag:"🇨🇦", pct:5, visits:14270 },
  ];

  return (
    <div style={{ maxWidth:1050, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif" }}>পরিসংখ্যান</h1>
        <div style={{ display:"flex", gap:6 }}>
          {["7d","30d","90d"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className="btn" style={{
              padding:"6px 12px", borderRadius:7, fontSize:12,
              background: period === p ? t.accent : t.surface,
              color: period === p ? "#fff" : t.textMuted,
              border:`1px solid ${period === p ? t.accent : t.border}`
            }}>{p === "7d" ? "৭ দিন" : p === "30d" ? "৩০ দিন" : "৯০ দিন"}</button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:20 }}>
        {[
          {label:"মোট পেজভিউ", value:"2,84,920", change:"+12.3%"},
          {label:"অনন্য দর্শক", value:"1,42,350", change:"+8.7%"},
          {label:"গড় সময়", value:"3:42", change:"+0:18"},
          {label:"বাউন্স রেট", value:"38.4%", change:"-2.1%"},
          {label:"লাইভ দর্শক", value:liveCount, change:"রিয়েল-টাইম"},
        ].map((s,i) => (
          <div key={i} style={{ background:t.surface, borderRadius:10, padding:"14px 16px", border:`1px solid ${t.border}` }}>
            <div style={{ fontSize:11, color:t.textMuted, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:22, fontWeight:700, color:t.text }}>{s.value}</div>
            <div style={{ fontSize:11, color: i === 4 ? t.green : s.change.startsWith("+") ? t.green : t.red, marginTop:4 }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"20px", marginBottom:20 }}>
        <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:16 }}>পেজভিউ ট্রেন্ড</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:140 }}>
          {chartData.slice(-Math.min(days,24)).map((d,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer" }}
              title={`${d.label}: ${d.views} views`}>
              <div style={{ width:"100%", background:`${t.accent}30`, borderRadius:"3px 3px 0 0", flex:1, display:"flex", alignItems:"flex-end" }}>
                <div style={{ width:"100%", background:`linear-gradient(0deg,${t.accent},${t.accentLight})`, borderRadius:"3px 3px 0 0", height:`${(d.views/maxV)*100}%`, minHeight:4, transition:"height 0.3s" }}></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:10, color:t.textMuted }}>
          <span>{chartData[0]?.label}</span>
          <span>{chartData[Math.floor(chartData.length/2)]?.label}</span>
          <span>{chartData[chartData.length-1]?.label}</span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Devices */}
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"20px" }}>
          <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:16 }}>ডিভাইস পরিসংখ্যান</div>
          {devices.map(d => (
            <div key={d.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:12 }}>
                <span style={{ color:t.text }}>{d.label}</span>
                <span style={{ color:t.textMuted }}>{d.pct}%</span>
              </div>
              <div style={{ height:8, borderRadius:4, background:t.border, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${d.pct}%`, background:d.color, borderRadius:4, transition:"width 0.6s" }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Countries */}
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"20px" }}>
          <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:16 }}>দেশ অনুযায়ী দর্শক</div>
          {countries.map(c => (
            <div key={c.name} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:18 }}>{c.flag}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:12, color:t.text }}>{c.name}</span>
                  <span style={{ fontSize:11, color:t.textMuted }}>{c.visits.toLocaleString()}</span>
                </div>
                <div style={{ height:5, borderRadius:3, background:t.border, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${c.pct}%`, background:t.accent, borderRadius:3 }}></div>
                </div>
              </div>
              <span style={{ fontSize:11, color:t.textMuted, width:30, textAlign:"right" }}>{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Comments Page ─────────────────────────────────────────────────
function CommentsPage({ t, showToast }) {
  const comments = [
    { id:1, author:"আহমেদ হোসেন", avatar:"আহ", post:"React 19-এর নতুন ফিচার", content:"অসাধারণ লেখা! অনেক কিছু শিখলাম। ধন্যবাদ।", time:"৫ মিনিট আগে", status:"pending", likes:3 },
    { id:2, author:"নাফিসা খানম", avatar:"না", post:"AI দিয়ে ব্লগ লেখার কৌশল", content:"এই পোস্টটি অনেক helpful। আরও এরকম লেখা চাই।", time:"৩০ মিনিট আগে", status:"approved", likes:7 },
    { id:3, author:"রফিকুল ইসলাম", avatar:"র", post:"MongoDB Aggregation", content:"কোডের উদাহরণগুলো আরও বিস্তারিত হলে ভালো হতো।", time:"২ ঘন্টা আগে", status:"approved", likes:2 },
    { id:4, author:"স্প্যাম বট", avatar:"স্", post:"কোনো পোস্ট", content:"Click here to win $1000! Visit our website...", time:"১ ঘন্টা আগে", status:"spam", likes:0 },
  ];

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif" }}>মন্তব্য পরিচালনা</h1>
        <div style={{ fontSize:12, color:t.textMuted }}>{comments.filter(c => c.status==="pending").length} অপেক্ষামাণ</div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {comments.map(c => (
          <div key={c.id} style={{
            background:t.surface, borderRadius:12, border:`1px solid ${c.status === "spam" ? t.red+"40" : c.status === "pending" ? t.amber+"40" : t.border}`,
            padding:"16px 20px"
          }}>
            <div style={{ display:"flex", gap:12, marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${t.accent},${t.amber})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>{c.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{c.author}</span>
                  <span style={{ fontSize:10, color:t.textMuted }}>→</span>
                  <span style={{ fontSize:11, color:t.accentLight }}>{c.post}</span>
                  <span style={{ marginLeft:"auto", fontSize:11, color:t.textMuted }}>{c.time}</span>
                </div>
                <p style={{ fontSize:13, color: c.status === "spam" ? t.red : t.text, lineHeight:1.5 }}>{c.content}</p>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:`1px solid ${t.border}40` }}>
              <div style={{ display:"flex", gap:6 }}>
                {c.status === "pending" && (
                  <button onClick={() => showToast("মন্তব্য অনুমোদিত হয়েছে")} className="btn" style={{ background:t.green+"20", color:t.green, border:`1px solid ${t.green}40`, borderRadius:6, padding:"4px 12px", fontSize:11 }}>✓ অনুমোদন</button>
                )}
                <button onClick={() => showToast("মন্তব্য মুছে ফেলা হয়েছে", "error")} className="btn" style={{ background:t.red+"15", color:t.red, border:`1px solid ${t.red}40`, borderRadius:6, padding:"4px 12px", fontSize:11 }}>🗑 মুছুন</button>
                <button className="btn" style={{ background:t.surface, border:`1px solid ${t.border}`, color:t.textMuted, borderRadius:6, padding:"4px 12px", fontSize:11 }}>↩ উত্তর</button>
              </div>
              <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:4,
                background: c.status === "spam" ? t.red+"20" : c.status === "pending" ? t.amber+"20" : t.green+"20",
                color: c.status === "spam" ? t.red : c.status === "pending" ? t.amber : t.green
              }}>{c.status === "spam" ? "স্প্যাম" : c.status === "pending" ? "অপেক্ষামাণ" : "অনুমোদিত"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Earnings Page ─────────────────────────────────────────────────
function EarningsPage({ t, showToast }) {
  const months = ["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন"];
  const earnings = [3200, 4100, 3800, 5200, 4800, 6100];
  const maxE = Math.max(...earnings);

  return (
    <div style={{ maxWidth:950, margin:"0 auto" }}>
      <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", marginBottom:20 }}>আয় ও মনিটাইজেশন</h1>

      {/* Earning summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14, marginBottom:20 }}>
        {[
          {label:"মোট আয়", value:"৳12,480", change:"+৳2,140"},
          {label:"এই মাসে", value:"৳6,100", change:"+৳1,300"},
          {label:"AdSense", value:"৳4,280", icon:"🎯"},
          {label:"প্রিমিয়াম সদস্য", value:"47 জন", icon:"👑"},
          {label:"অ্যাফিলিয়েট", value:"৳1,820", icon:"🔗"},
        ].map((s,i) => (
          <div key={i} style={{ background:t.surface, borderRadius:10, padding:"16px", border:`1px solid ${t.border}` }}>
            <div style={{ fontSize:11, color:t.textMuted, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:22, fontWeight:700, color:t.text }}>{s.value}</div>
            {s.change && <div style={{ fontSize:11, color:t.green, marginTop:4 }}>{s.change} এই মাসে</div>}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"20px", marginBottom:20 }}>
        <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:16 }}>মাসিক আয় চার্ট (৳)</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:16, height:120 }}>
          {months.map((m, i) => (
            <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{ fontSize:10, color:t.textMuted }}>৳{(earnings[i]/100).toFixed(1)}k</div>
              <div style={{ width:"100%", borderRadius:"4px 4px 0 0", background:`linear-gradient(0deg,${t.amber},${t.accent})`, height:`${(earnings[i]/maxE)*90}%`, minHeight:8 }}></div>
              <div style={{ fontSize:10, color:t.textMuted }}>{m}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* AdSense settings */}
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"18px" }}>
          <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:14 }}>Google AdSense সেটিং</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {["হেডার বিজ্ঞাপন", "সাইডবার বিজ্ঞাপন", "পোস্টের ভেতরে", "ফুটার বিজ্ঞাপন"].map(slot => (
              <div key={slot} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", background:t.surfaceHover, borderRadius:8 }}>
                <span style={{ fontSize:13, color:t.text }}>{slot}</span>
                <Toggle t={t} />
              </div>
            ))}
            <textarea rows={3} placeholder="AdSense কোড এখানে পেস্ট করুন..." style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:8, padding:"10px", fontSize:12, resize:"none" }} />
            <button onClick={() => showToast("AdSense কোড সংরক্ষিত হয়েছে")} className="btn" style={{ background:t.accent, color:"#fff", borderRadius:8, padding:"8px", fontSize:12, fontWeight:600 }}>সংরক্ষণ করুন</button>
          </div>
        </div>

        {/* Premium membership */}
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"18px" }}>
          <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:14 }}>প্রিমিয়াম সদস্যতা</div>
          {[
            {plan:"ফ্রি", price:"৳0/মাস", features:["৫টি পোস্ট","২ জিবি স্টোরেজ","বেসিক এনালিটিক্স"], active:false},
            {plan:"প্রো", price:"৳৪৯৯/মাস", features:["সীমাহীন পোস্ট","৫০ জিবি স্টোরেজ","AI টুলস","কাস্টম ডোমেইন"], active:true},
          ].map(plan => (
            <div key={plan.plan} style={{ marginBottom:12, padding:"12px", borderRadius:8, border:`2px solid ${plan.active ? t.accent : t.border}`, background: plan.active ? t.accentBg : "transparent" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontWeight:600, fontSize:13, color:t.text }}>{plan.plan}</span>
                <span style={{ fontWeight:700, fontSize:13, color: plan.active ? t.accentLight : t.textMuted }}>{plan.price}</span>
              </div>
              {plan.features.map(f => <div key={f} style={{ fontSize:11, color:t.textMuted, marginBottom:3 }}>✓ {f}</div>)}
              {plan.active && <span style={{ fontSize:10, color:t.accentLight, fontWeight:700 }}>● সক্রিয়</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pages Page ────────────────────────────────────────────────────
function PagesPage({ t, showToast }) {
  const pages = [
    {title:"আমাদের সম্পর্কে", slug:"about", type:"default", updated:"২০২৫-০৬-০১"},
    {title:"যোগাযোগ", slug:"contact", type:"default", updated:"২০২৫-০৫-২০"},
    {title:"গোপনীয়তা নীতি", slug:"privacy-policy", type:"default", updated:"২০২৫-০৪-১৫"},
    {title:"ব্যবহারের শর্তাবলী", slug:"terms", type:"default", updated:"২০২৫-০৪-১৫"},
    {title:"আমাদের টিম", slug:"team", type:"custom", updated:"২০২৫-০৬-০৮"},
    {title:"বিজ্ঞাপন নীতি", slug:"advertise", type:"custom", updated:"২০২৫-০৬-০৫"},
  ];
  return (
    <div style={{ maxWidth:800, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif" }}>পেজসমূহ</h1>
        <button onClick={() => showToast("নতুন পেজ তৈরি হচ্ছে...")} className="btn" style={{ background:`linear-gradient(135deg,${t.accent},${t.accentLight})`, color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600 }}>+ নতুন পেজ</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {pages.map(p => (
          <div key={p.slug} style={{ background:t.surface, borderRadius:10, border:`1px solid ${t.border}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:8, background: p.type === "default" ? t.accentBg : t.amber+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              {p.type === "default" ? "📄" : "📃"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500, color:t.text }}>{p.title}</div>
              <div style={{ fontSize:11, color:t.textMuted }}>/{p.slug} · সর্বশেষ আপডেট: {p.updated}</div>
            </div>
            <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, fontWeight:600,
              background: p.type === "default" ? t.accentBg : t.amber+"20",
              color: p.type === "default" ? t.accentLight : t.amber
            }}>{p.type === "default" ? "ডিফল্ট" : "কাস্টম"}</span>
            <button className="btn" style={{ background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:6, padding:"5px 12px", fontSize:11 }}>সম্পাদনা</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Media Page ────────────────────────────────────────────────────
function MediaPage({ t, showToast }) {
  const [view, setView] = useState("grid");
  const files = [
    {name:"hero-banner.jpg", size:"1.2 MB", type:"image", color:"#7C3AED"},
    {name:"tutorial-video.mp4", size:"24.8 MB", type:"video", color:"#EF4444"},
    {name:"ebook-2025.pdf", size:"3.4 MB", type:"pdf", color:"#F59E0B"},
    {name:"profile-photo.png", size:"0.8 MB", type:"image", color:"#10B981"},
    {name:"intro.mp4", size:"15.2 MB", type:"video", color:"#3B82F6"},
    {name:"guide.pdf", size:"2.1 MB", type:"pdf", color:"#EC4899"},
    {name:"thumbnail-1.jpg", size:"0.6 MB", type:"image", color:"#06B6D4"},
    {name:"thumbnail-2.jpg", size:"0.7 MB", type:"image", color:"#84CC16"},
  ];

  return (
    <div style={{ maxWidth:1000, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif" }}>মিডিয়া ম্যানেজার</h1>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn" style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.textMuted, padding:"6px 10px", borderRadius:7 }} onClick={() => setView("grid")}>⊞</button>
          <button className="btn" style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.textMuted, padding:"6px 10px", borderRadius:7 }} onClick={() => setView("list")}>≡</button>
          <button onClick={() => showToast("ফাইল আপলোড হচ্ছে...")} className="btn" style={{ background:`linear-gradient(135deg,${t.accent},${t.accentLight})`, color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600 }}>↑ আপলোড</button>
        </div>
      </div>

      {/* Storage bar */}
      <div style={{ background:t.surface, borderRadius:10, border:`1px solid ${t.border}`, padding:"14px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12 }}>
            <span style={{ color:t.text, fontWeight:500 }}>ক্লাউড স্টোরেজ</span>
            <span style={{ color:t.textMuted }}>12.4 GB / 50 GB ব্যবহৃত</span>
          </div>
          <div style={{ height:8, borderRadius:4, background:t.border }}>
            <div style={{ height:"100%", width:"24.8%", background:`linear-gradient(90deg,${t.accent},${t.amber})`, borderRadius:4 }}></div>
          </div>
        </div>
        <span style={{ fontSize:12, color:t.textMuted }}>24.8%</span>
      </div>

      {/* Drop zone */}
      <div style={{ border:`2px dashed ${t.border}`, borderRadius:10, padding:"24px", textAlign:"center", marginBottom:18, cursor:"pointer" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
        onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
        <div style={{ fontSize:32, marginBottom:8 }}>☁</div>
        <div style={{ fontSize:13, color:t.textMuted }}>ফাইল টেনে আনুন বা <span style={{ color:t.accentLight, cursor:"pointer" }}>এখানে ক্লিক করুন</span></div>
        <div style={{ fontSize:11, color:t.textMuted, marginTop:4 }}>JPG, PNG, MP4, PDF — সর্বোচ্চ 100MB</div>
      </div>

      {/* Files grid */}
      <div style={{ display:view === "grid" ? "grid" : "flex", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:12, flexDirection:"column" }}>
        {files.map(f => view === "grid" ? (
          <div key={f.name} style={{ background:t.surface, borderRadius:10, border:`1px solid ${t.border}`, overflow:"hidden", cursor:"pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
            <div style={{ height:80, background:`${f.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
              {f.type === "image" ? "🖼" : f.type === "video" ? "🎬" : "📄"}
            </div>
            <div style={{ padding:"8px 10px" }}>
              <div style={{ fontSize:11, fontWeight:500, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
              <div style={{ fontSize:10, color:t.textMuted, marginTop:2 }}>{f.size}</div>
            </div>
          </div>
        ) : (
          <div key={f.name} style={{ background:t.surface, borderRadius:8, border:`1px solid ${t.border}`, padding:"10px 14px", display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ fontSize:20 }}>{f.type === "image" ? "🖼" : f.type === "video" ? "🎬" : "📄"}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:t.text }}>{f.name}</div>
              <div style={{ fontSize:11, color:t.textMuted }}>{f.size}</div>
            </div>
            <button onClick={() => showToast("লিংক কপি হয়েছে!")} className="btn" style={{ background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:6, padding:"4px 10px", fontSize:11 }}>URL কপি</button>
            <button onClick={() => showToast("মুছে ফেলা হয়েছে", "error")} className="btn" style={{ color:t.red, fontSize:14, background:"transparent" }}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Theme Page ────────────────────────────────────────────────────
function ThemePage({ t, showToast }) {
  const [active, setActive] = useState(0);
  const themes = [
    { name:"Editorial Dark", tag:"বর্তমান", preview:["#0F0F14","#7C3AED","#F1F0F5"] },
    { name:"Morning Light", tag:"জনপ্রিয়", preview:["#FFFEF7","#D97706","#1A1928"] },
    { name:"Ocean Breeze", tag:"নতুন", preview:["#0A1628","#3B82F6","#E0F2FE"] },
    { name:"Forest Calm", tag:"", preview:["#0A1A0E","#10B981","#D1FAE5"] },
    { name:"Sunset Glow", tag:"", preview:["#1A0A0A","#EC4899","#FEE2E2"] },
    { name:"Minimal White", tag:"", preview:["#FFFFFF","#1A1928","#F3F4F6"] },
  ];

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", marginBottom:6 }}>থিম স্টোর</h1>
      <p style={{ fontSize:12, color:t.textMuted, marginBottom:20 }}>আপনার ব্লগের জন্য পারফেক্ট থিম বেছে নিন</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16, marginBottom:28 }}>
        {themes.map((th, i) => (
          <div key={i} style={{ background:t.surface, borderRadius:12, border:`2px solid ${active === i ? t.accent : t.border}`, overflow:"hidden", cursor:"pointer", transition:"border-color 0.2s" }}
            onClick={() => setActive(i)}>
            <div style={{ height:100, background:th.preview[0], display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:12 }}>
              {th.preview.map((c,j) => <div key={j} style={{ width:j===0?40:28, height:j===0?40:28, borderRadius:"50%", background:c, border:"2px solid rgba(255,255,255,0.2)" }}></div>)}
            </div>
            <div style={{ padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{th.name}</span>
              {th.tag && <span style={{ fontSize:10, background:t.accent+"20", color:t.accentLight, padding:"1px 7px", borderRadius:4, fontWeight:600 }}>{th.tag}</span>}
            </div>
            {active === i && (
              <div style={{ padding:"0 14px 12px" }}>
                <button onClick={() => showToast(`${th.name} থিম সক্রিয় হয়েছে!`)} className="btn" style={{ width:"100%", background:t.accent, color:"#fff", borderRadius:7, padding:"7px", fontSize:12, fontWeight:600 }}>সক্রিয় করুন</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom CSS editor */}
      <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}`, fontWeight:600, fontSize:14, color:t.text }}>কাস্টম CSS</div>
        <textarea rows={8} defaultValue={`/* আপনার কাস্টম CSS এখানে লিখুন */\n.post-title {\n  font-family: 'Playfair Display', serif;\n  font-size: 2rem;\n  color: var(--accent);\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.2);\n}`}
          style={{ width:"100%", background:t.bg, border:"none", color:t.text, padding:"14px 18px", fontSize:12, fontFamily:"monospace", lineHeight:1.7, resize:"none" }} />
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${t.border}`, display:"flex", justifyContent:"flex-end" }}>
          <button onClick={() => showToast("CSS সংরক্ষিত হয়েছে")} className="btn" style={{ background:t.accent, color:"#fff", borderRadius:8, padding:"7px 18px", fontSize:12, fontWeight:600 }}>সংরক্ষণ করুন</button>
        </div>
      </div>
    </div>
  );
}

// ── Layout Page ───────────────────────────────────────────────────
function LayoutPage({ t }) {
  const [widgets] = useState(["লোগো & নেভিগেশন", "ফিচার্ড পোস্ট স্লাইডার", "সাম্প্রতিক পোস্ট গ্রিড", "সাইডবার: সার্চ বার", "সাইডবার: ক্যাটাগরি", "সাইডবার: জনপ্রিয় পোস্ট", "নিউজলেটার সাবস্ক্রাইব", "ফুটার লিংক"]);

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", marginBottom:6 }}>লেআউট বিল্ডার</h1>
      <p style={{ fontSize:12, color:t.textMuted, marginBottom:20 }}>ড্র্যাগ ও ড্রপ করে আপনার লেআউট সাজান</p>

      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:16 }}>
        {/* Widget list */}
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"14px" }}>
          <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:12 }}>উইজেট লাইব্রেরি</div>
          {["সার্চ বার","বিজ্ঞাপন স্লট","সোশ্যাল লিংক","ট্যাগ ক্লাউড","লেখক বায়ো","RSS ফিড","সাম্প্রতিক মন্তব্য"].map(w => (
            <div key={w} style={{ padding:"8px 10px", background:t.surfaceHover, borderRadius:7, marginBottom:6, fontSize:12, color:t.textMuted, cursor:"grab", border:`1px solid ${t.border}`, display:"flex", alignItems:"center", gap:6 }}>
              <span>⠿</span> {w}
            </div>
          ))}
        </div>

        {/* Layout canvas */}
        <div>
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"14px", marginBottom:12, fontWeight:600, fontSize:13, color:t.text }}>
            পেজ লেআউট ক্যানভাস
          </div>
          {widgets.map((w, i) => (
            <div key={i} style={{ background:t.surface, borderRadius:9, border:`1px dashed ${t.border}`, padding:"11px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10, cursor:"grab" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
              <span style={{ color:t.textMuted, fontSize:16 }}>⠿</span>
              <span style={{ flex:1, fontSize:13, color:t.text }}>{w}</span>
              <button className="btn" style={{ background:t.red+"15", color:t.red, borderRadius:5, padding:"3px 8px", fontSize:11, border:"none" }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SEO Page ──────────────────────────────────────────────────────
function SEOPage({ t, showToast }) {
  return (
    <div style={{ maxWidth:800, margin:"0 auto" }}>
      <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", marginBottom:20 }}>SEO টুলস</h1>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {[
          { title:"XML Sitemap", desc:"স্বয়ংক্রিয়ভাবে sitemap.xml তৈরি", url:"/sitemap.xml", active:true },
          { title:"Robots.txt সম্পাদক", desc:"সার্চ ইঞ্জিন ক্রলার নির্দেশিকা", url:"/robots.txt", active:true },
          { title:"Google Search Console", desc:"ভেরিফিকেশন মেটা ট্যাগ যোগ করুন", url:"", active:false },
        ].map(item => (
          <div key={item.title} style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:t.text, marginBottom:4 }}>{item.title}</div>
              <div style={{ fontSize:12, color:t.textMuted }}>{item.desc}</div>
              {item.url && <div style={{ fontSize:11, color:t.accentLight, marginTop:4 }}>{item.url}</div>}
            </div>
            <Toggle t={t} initial={item.active} />
            <button onClick={() => showToast(`${item.title} আপডেট হয়েছে`)} className="btn" style={{ background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:7, padding:"6px 14px", fontSize:12 }}>কনফিগার</button>
          </div>
        ))}

        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"18px" }}>
          <div style={{ fontWeight:600, fontSize:14, color:t.text, marginBottom:14 }}>Robots.txt সম্পাদক</div>
          <textarea rows={8} defaultValue={`User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://yourblog.blogge.com/sitemap.xml`}
            style={{ width:"100%", background:t.bg, border:`1px solid ${t.border}`, color:t.text, borderRadius:8, padding:"12px", fontSize:12, fontFamily:"monospace", resize:"none" }} />
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
            <button onClick={() => showToast("Robots.txt সংরক্ষিত হয়েছে")} className="btn" style={{ background:t.accent, color:"#fff", borderRadius:8, padding:"7px 18px", fontSize:12, fontWeight:600 }}>সংরক্ষণ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AI Tools Page ─────────────────────────────────────────────────
function AIToolsPage({ t, showToast }) {
  const [tool, setTool] = useState("writer");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!prompt) return;
    setLoading(true);
    setOutput("");
    const prompts = {
      writer: `Write a complete, engaging blog post in Bengali about: "${prompt}". Include introduction, detailed sections with subheadings, and conclusion. Make it informative and well-structured.`,
      seo: `Generate SEO metadata in Bengali for a blog post about: "${prompt}". Provide: 1) Meta title (under 60 chars) 2) Meta description (under 160 chars) 3) 10 focus keywords 4) URL slug suggestion. Format as JSON-like structure.`,
      ideas: `Generate 10 creative blog post ideas in Bengali related to: "${prompt}". For each idea, provide title and a brief one-sentence description. Number them 1-10.`,
    };
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{ role:"user", content: prompts[tool] }] })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text||"").join("") || "কোনো আউটপুট পাওয়া যায়নি।";
      setOutput(text);
    } catch { setOutput("AI সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"); }
    setLoading(false);
  };

  const tools = [
    { id:"writer", label:"✍ AI ব্লগ রাইটার", desc:"টপিক দিলে সম্পূর্ণ পোস্ট লিখে দেবে" },
    { id:"seo", label:"🔍 SEO সুপারিশ", desc:"মেটা ট্যাগ ও কীওয়ার্ড সাজেশন" },
    { id:"ideas", label:"💡 আইডিয়া জেনারেটর", desc:"ব্লগ পোস্টের ধারণা তৈরি করুন" },
  ];

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", marginBottom:6 }}>AI টুলস</h1>
      <p style={{ fontSize:12, color:t.textMuted, marginBottom:20 }}>কৃত্রিম বুদ্ধিমত্তা দিয়ে আপনার ব্লগ আরও শক্তিশালী করুন</p>

      {/* Tool selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
        {tools.map(item => (
          <button key={item.id} onClick={() => setTool(item.id)} className="btn" style={{
            padding:"14px", borderRadius:10, textAlign:"left",
            background: tool === item.id ? t.accentBg : t.surface,
            border:`2px solid ${tool === item.id ? t.accent : t.border}`,
            color: tool === item.id ? t.accentLight : t.textMuted
          }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{item.label}</div>
            <div style={{ fontSize:11, opacity:0.8 }}>{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"20px", marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:600, color:t.textMuted, display:"block", marginBottom:8 }}>
          {tool === "writer" ? "📝 পোস্টের বিষয় বা শিরোনাম লিখুন" : tool === "seo" ? "🔑 পোস্টের বিষয় লিখুন" : "💡 যে বিষয়ে আইডিয়া চান"}
        </label>
        <div style={{ display:"flex", gap:8 }}>
          <input value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && run()} placeholder={tool === "writer" ? "যেমন: React 19 এর নতুন ফিচার সম্পর্কে বিস্তারিত গাইড" : tool === "seo" ? "যেমন: JavaScript Async Await Tutorial" : "যেমন: ওয়েব ডেভেলপমেন্ট"}
            style={{ flex:1, background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:9, padding:"10px 14px", fontSize:14 }} />
          <button onClick={run} disabled={loading || !prompt} className="btn" style={{
            background:`linear-gradient(135deg,${t.accent},${t.accentLight})`, color:"#fff",
            padding:"10px 22px", borderRadius:9, fontSize:13, fontWeight:600,
            opacity: loading || !prompt ? 0.6 : 1, boxShadow:`0 4px 14px ${t.accent}50`
          }}>
            {loading ? "⏳ তৈরি হচ্ছে..." : "✨ তৈরি করুন"}
          </button>
        </div>
      </div>

      {/* Output */}
      {(output || loading) && (
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"20px" }} className="fade-in">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontWeight:600, fontSize:13, color:t.text }}>AI আউটপুট</span>
            {output && <button onClick={() => { navigator.clipboard?.writeText(output); showToast("কপি হয়েছে!"); }} className="btn" style={{ background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:6, padding:"4px 12px", fontSize:11 }}>📋 কপি</button>}
          </div>
          {loading ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[100,85,92,78,88].map((w,i) => <div key={i} className="skeleton" style={{ height:16, borderRadius:4, width:`${w}%` }}></div>)}
            </div>
          ) : (
            <div style={{ fontSize:13, color:t.text, lineHeight:1.8, whiteSpace:"pre-wrap", maxHeight:400, overflow:"auto" }}>{output}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────
function SettingsPage({ t, showToast }) {
  const [tab, setTab] = useState("general");
  const tabs = [
    { id:"general", label:"সাধারণ" },
    { id:"profile", label:"প্রোফাইল" },
    { id:"security", label:"নিরাপত্তা" },
    { id:"notifications", label:"বিজ্ঞপ্তি" },
    { id:"integrations", label:"ইন্টিগ্রেশন" },
  ];

  return (
    <div style={{ maxWidth:800, margin:"0 auto" }}>
      <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", marginBottom:20 }}>সেটিংস</h1>

      {/* Tab nav */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:t.surface, borderRadius:10, padding:4, border:`1px solid ${t.border}`, width:"fit-content" }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} className="btn" style={{
            padding:"7px 14px", borderRadius:7, fontSize:12, fontWeight:500,
            background: tab === tb.id ? t.accentBg : "transparent",
            color: tab === tb.id ? t.accentLight : t.textMuted,
            border: tab === tb.id ? `1px solid ${t.accent}40` : "1px solid transparent"
          }}>{tb.label}</button>
        ))}
      </div>

      {tab === "general" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { label:"ব্লগের নাম", placeholder:"My Awesome Blog", type:"text" },
            { label:"ব্লগের বিবরণ", placeholder:"এটি একটি টেক ব্লগ...", type:"text" },
            { label:"ওয়েবসাইট URL", placeholder:"https://yourblog.com", type:"url" },
            { label:"টাইমজোন", placeholder:"Asia/Dhaka", type:"text" },
            { label:"ডিফল্ট ভাষা", placeholder:"বাংলা (bn)", type:"text" },
          ].map(f => (
            <div key={f.label} style={{ background:t.surface, borderRadius:10, border:`1px solid ${t.border}`, padding:"14px 16px" }}>
              <label style={{ fontSize:12, color:t.textMuted, display:"block", marginBottom:6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} style={{ width:"100%", background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"8px 12px", fontSize:13 }} />
            </div>
          ))}
          <button onClick={() => showToast("সেটিংস সংরক্ষিত হয়েছে")} className="btn" style={{ background:t.accent, color:"#fff", borderRadius:9, padding:"10px 22px", fontSize:13, fontWeight:600, alignSelf:"flex-start" }}>পরিবর্তন সংরক্ষণ করুন</button>
        </div>
      )}

      {tab === "security" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { title:"দুই-ধাপ যাচাইকরণ (2FA)", desc:"ইমেইল OTP দিয়ে অতিরিক্ত নিরাপত্তা", active:true },
            { title:"Google reCAPTCHA", desc:"ফর্মে স্প্যাম সুরক্ষা", active:true },
            { title:"অ্যাক্টিভিটি লগ", desc:"সব লগইন ও কার্যক্রম ট্র্যাক করুন", active:false },
            { title:"ডেটাবেস ব্যাকআপ", desc:"প্রতিদিন স্বয়ংক্রিয় ব্যাকআপ", active:true },
          ].map(s => (
            <div key={s.title} style={{ background:t.surface, borderRadius:10, border:`1px solid ${t.border}`, padding:"14px 16px", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:t.text }}>{s.title}</div>
                <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{s.desc}</div>
              </div>
              <Toggle t={t} initial={s.active} />
            </div>
          ))}
        </div>
      )}

      {tab === "profile" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"20px", display:"flex", gap:16, alignItems:"center" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:`linear-gradient(135deg,${t.accent},${t.amber})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700, color:"#fff" }}>রা</div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:t.text }}>রাহেলা আক্তার</div>
              <div style={{ fontSize:12, color:t.textMuted }}>rahela@example.com</div>
              <button className="btn" style={{ marginTop:8, background:t.accentBg, color:t.accentLight, border:`1px solid ${t.accent}40`, borderRadius:6, padding:"4px 12px", fontSize:11 }}>ছবি পরিবর্তন করুন</button>
            </div>
          </div>
          {[{ label:"পূর্ণ নাম", val:"রাহেলা আক্তার" },{ label:"পরিচিতি", val:"ফুলস্ট্যাক ডেভেলপার এবং টেক ব্লগার" },{ label:"ওয়েবসাইট", val:"https://rahela.dev" }].map(f => (
            <div key={f.label} style={{ background:t.surface, borderRadius:10, border:`1px solid ${t.border}`, padding:"14px 16px" }}>
              <label style={{ fontSize:12, color:t.textMuted, display:"block", marginBottom:6 }}>{f.label}</label>
              <input defaultValue={f.val} style={{ width:"100%", background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.text, borderRadius:7, padding:"8px 12px", fontSize:13 }} />
            </div>
          ))}
          <button onClick={() => showToast("প্রোফাইল আপডেট হয়েছে")} className="btn" style={{ background:t.accent, color:"#fff", borderRadius:9, padding:"10px 22px", fontSize:13, fontWeight:600, alignSelf:"flex-start" }}>প্রোফাইল আপডেট করুন</button>
        </div>
      )}

      {(tab === "notifications" || tab === "integrations") && (
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"24px", textAlign:"center", color:t.textMuted }}>
          <div style={{ fontSize:32, marginBottom:12 }}>{tab === "notifications" ? "🔔" : "🔌"}</div>
          <div style={{ fontSize:14, marginBottom:8 }}>{tab === "notifications" ? "বিজ্ঞপ্তি পছন্দ" : "তৃতীয় পক্ষ ইন্টিগ্রেশন"}</div>
          <div style={{ fontSize:12 }}>এই বিভাগটি শীঘ্রই আসছে</div>
        </div>
      )}
    </div>
  );
}

// ── Admin Page ────────────────────────────────────────────────────
function AdminPage({ t, showToast }) {
  const [tab, setTab] = useState("users");
  const users = [
    { name:"রাহেলা আক্তার", email:"rahela@example.com", role:"অ্যাডমিন", posts:47, joined:"২০২৪-০১", status:"active" },
    { name:"আহমেদ হোসেন", email:"ahmed@example.com", role:"এডিটর", posts:23, joined:"২০২৪-০৩", status:"active" },
    { name:"নাফিসা খানম", email:"nafisa@example.com", role:"ভিউয়ার", posts:0, joined:"২০২৪-০৬", status:"active" },
    { name:"রফিকুল ইসলাম", email:"rafiq@example.com", role:"এডিটর", posts:12, joined:"২০২৪-০৪", status:"banned" },
  ];

  return (
    <div style={{ maxWidth:1000, margin:"0 auto" }}>
      <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif", marginBottom:20 }}>অ্যাডমিন প্যানেল</h1>

      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {["users","content","reports","site"].map(tb => (
          <button key={tb} onClick={() => setTab(tb)} className="btn" style={{
            padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:500,
            background: tab === tb ? t.accent : t.surface,
            color: tab === tb ? "#fff" : t.textMuted,
            border:`1px solid ${tab === tb ? t.accent : t.border}`
          }}>{tb === "users" ? "ব্যবহারকারী" : tb === "content" ? "কন্টেন্ট" : tb === "reports" ? "রিপোর্ট" : "সাইট সেটিংস"}</button>
        ))}
      </div>

      {tab === "users" && (
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}`, fontWeight:600, fontSize:13, color:t.text }}>
            ব্যবহারকারী ব্যবস্থাপনা ({users.length} জন)
          </div>
          {users.map(u => (
            <div key={u.email} style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}20`, display:"flex", gap:14, alignItems:"center" }}
              onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${t.accent},${t.amber})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>{u.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:t.text }}>{u.name}</div>
                <div style={{ fontSize:11, color:t.textMuted }}>{u.email} · {u.posts} পোস্ট · যোগদান: {u.joined}</div>
              </div>
              <span style={{ fontSize:11, padding:"2px 8px", borderRadius:4, fontWeight:600, background:t.accentBg, color:t.accentLight }}>{u.role}</span>
              <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, fontWeight:600,
                background: u.status === "active" ? t.green+"20" : t.red+"20",
                color: u.status === "active" ? t.green : t.red
              }}>{u.status === "active" ? "সক্রিয়" : "নিষিদ্ধ"}</span>
              <div style={{ display:"flex", gap:6 }}>
                <button className="btn" style={{ background:t.surfaceHover, border:`1px solid ${t.border}`, color:t.textMuted, borderRadius:6, padding:"4px 10px", fontSize:11 }}>সম্পাদনা</button>
                <button onClick={() => showToast(`${u.name} ${u.status === "active" ? "নিষিদ্ধ" : "সক্রিয়"} করা হয়েছে`, u.status === "active" ? "error" : "success")} className="btn" style={{ background: u.status === "active" ? t.red+"15" : t.green+"15", color: u.status === "active" ? t.red : t.green, border:`1px solid ${u.status === "active" ? t.red : t.green}40`, borderRadius:6, padding:"4px 10px", fontSize:11 }}>
                  {u.status === "active" ? "নিষিদ্ধ" : "পুনরুদ্ধার"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "content" && (
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px" }}>
          <div style={{ fontWeight:600, fontSize:13, color:t.text, marginBottom:14 }}>সকল পোস্ট ও পেজ</div>
          {SAMPLE_POSTS.map(p => (
            <div key={p.id} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${t.border}20` }}>
              <span style={{ fontSize:18 }}>✍</span>
              <div style={{ flex:1 }}><div style={{ fontSize:13, color:t.text }}>{p.title}</div><div style={{ fontSize:11, color:t.textMuted }}>{p.category} · {p.date}</div></div>
              <StatusBadge t={t} status={p.status} />
              <button onClick={() => showToast("পোস্ট মুছে ফেলা হয়েছে", "error")} className="btn" style={{ color:t.red, background:"transparent", fontSize:14 }}>🗑</button>
            </div>
          ))}
        </div>
      )}

      {(tab === "reports" || tab === "site") && (
        <div style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, padding:"24px", textAlign:"center", color:t.textMuted }}>
          <div style={{ fontSize:32, marginBottom:12 }}>{tab === "reports" ? "🚩" : "🌐"}</div>
          <div style={{ fontSize:14 }}>এই বিভাগটি শীঘ্রই আসছে</div>
        </div>
      )}
    </div>
  );
}

// ── Preview Page ──────────────────────────────────────────────────
function PreviewPage({ t, posts }) {
  return (
    <div style={{ maxWidth:1000, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:t.text, fontFamily:"'Playfair Display', serif" }}>ব্লগ প্রিভিউ</h1>
        <span style={{ fontSize:12, color:t.textMuted, background:t.amber+"20", color:t.amber, padding:"4px 12px", borderRadius:20, border:`1px solid ${t.amber}40` }}>📱 পাবলিক ভিউ</span>
      </div>

      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${t.accent}20,${t.amber}10)`, borderRadius:14, padding:"40px 32px", marginBottom:24, border:`1px solid ${t.accent}30`, textAlign:"center" }}>
        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:800, color:t.text, marginBottom:10 }}>Tech Insights বাংলা</div>
        <div style={{ fontSize:14, color:t.textMuted, marginBottom:20 }}>বাংলায় প্রযুক্তির সেরা গল্প ও টিউটোরিয়াল</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          {CATEGORIES.slice(0,6).map(c => (
            <span key={c} style={{ fontSize:12, padding:"4px 12px", borderRadius:20, background:`${COLORS[c] || t.accent}20`, color: COLORS[c] || t.accentLight, border:`1px solid ${COLORS[c] || t.accent}40` }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Featured post */}
      <div style={{ background:t.surface, borderRadius:14, border:`1px solid ${t.border}`, overflow:"hidden", marginBottom:20 }}>
        <div style={{ height:180, background:`linear-gradient(135deg,${t.accent}60,${t.amber}40)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>✍</div>
        <div style={{ padding:"20px" }}>
          <span style={{ fontSize:11, color:t.accent, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>ফিচার্ড পোস্ট</span>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:700, color:t.text, margin:"8px 0 10px" }}>{posts[0].title}</h2>
          <p style={{ fontSize:13, color:t.textMuted, lineHeight:1.6, marginBottom:14 }}>{posts[0].excerpt}</p>
          <div style={{ display:"flex", gap:16, fontSize:11, color:t.textMuted }}>
            <span>👁 {posts[0].views.toLocaleString()}</span>
            <span>👍 {posts[0].likes}</span>
            <span>⏱ {posts[0].readTime}</span>
          </div>
        </div>
      </div>

      {/* Post grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
        {posts.slice(1).map(p => (
          <div key={p.id} style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
            style={{ background:t.surface, borderRadius:12, border:`1px solid ${t.border}`, overflow:"hidden", transition:"transform 0.2s" }}>
            <div style={{ height:120, background:`linear-gradient(135deg,${COLORS[p.category]||t.accent}40,${t.amber}20)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>✍</div>
            <div style={{ padding:"14px" }}>
              <span style={{ fontSize:10, color: COLORS[p.category] || t.accentLight, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.04em" }}>{p.category}</span>
              <div style={{ fontSize:14, fontWeight:600, color:t.text, margin:"5px 0 6px", lineHeight:1.4 }}>{p.title}</div>
              <div style={{ fontSize:11, color:t.textMuted }}>{p.date} · {p.readTime}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reusable components ───────────────────────────────────────────
function StatusBadge({ t, status }) {
  const cfg = { published:{ bg:t.green+"20", color:t.green, label:"প্রকাশিত" }, draft:{ bg:t.amber+"20", color:t.amber, label:"খসড়া" }, scheduled:{ bg:t.accent+"20", color:t.accentLight, label:"নির্ধারিত" } };
  const c = cfg[status] || cfg.draft;
  return <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:4, background:c.bg, color:c.color }}>{c.label}</span>;
}

function Toggle({ t, initial = false }) {
  const [on, setOn] = useState(initial);
  return (
    <div onClick={() => setOn(v => !v)} style={{ width:38, height:22, borderRadius:11, background: on ? t.accent : t.border, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left: on ? 19 : 3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}></div>
    </div>
  );
}
