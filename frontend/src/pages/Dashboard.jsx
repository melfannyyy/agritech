import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

const QUICK_LINKS = [
  { icon: "🏡", label: "Farm Management", to: "/farms",        color: "green",  desc: "Kelola lahan & catat aktivitas" },
  { icon: "🌾", label: "Crop Management", to: "/crops",        color: "yellow", desc: "Pantau pertumbuhan & kesehatan tanah" },
  { icon: "🌤️", label: "Weather",          to: "/weather",      color: "blue",   desc: "Cek kondisi cuaca hari ini" },
  { icon: "🛒", label: "Marketplace",      to: "/products",     color: "green",  desc: "Beli kebutuhan pertanian" },
  { icon: "📋", label: "Crop Info",         to: "/crop-info",   color: "yellow", desc: "Panduan & info budidaya tanaman" },
  { icon: "🐛", label: "Pest Alerts",      to: "/pest-alerts",  color: "red",    desc: "Alert hama & penyakit terkini" },
  { icon: "📦", label: "My Orders",        to: "/my-orders",    color: "blue",   desc: "Lihat riwayat pesanan" },
  { icon: "💬", label: "Community Forum",  to: "/forum",        color: "purple", desc: "Diskusi & berbagi dengan petani lain" },
];

function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Petani";

  const [stats, setStats]     = useState({ farms: null, crops: null, orders: null });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    setStatsLoading(true);
    const fetchStats = async () => {
      try {
        const [farmsRes, cropsRes, ordersRes] = await Promise.all([
          api.get(`/getfarms/${user._id}`),
          api.get(`/getcrops/${user._id}`),
          api.get(`/getbookings/${user._id}`),
        ]);
        setStats({
          farms:  (farmsRes.data.data  ?? farmsRes.data).length,
          crops:  (cropsRes.data.data  ?? cropsRes.data).length,
          orders: (ordersRes.data.data ?? ordersRes.data).length,
        });
      } catch {
        // silent fail — stats just show "—"
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [user?._id]);

  const greetHour = new Date().getHours();
  const greeting = greetHour < 12 ? "Selamat Pagi" : greetHour < 17 ? "Selamat Siang" : "Selamat Sore";

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Header */}
        <div className="dash__header">
          <div>
            <div className="dash__greeting">{greeting} 👋</div>
            <h1 className="dash__title">{firstName}!</h1>
            <p className="dash__sub">Kelola aktivitas pertanian Anda dari satu dashboard terintegrasi</p>
          </div>
          <div className="dash__date">
            <span className="dash__date-day">
              {new Date().toLocaleDateString("id-ID", { weekday: "long" })}
            </span>
            <span className="dash__date-full">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Live stats */}
        <div className="dash__live-stats">
          {[
            { label: "Total Farm", value: stats.farms, icon: "🏡", to: "/farms",     color: "green" },
            { label: "Total Crop", value: stats.crops, icon: "🌾", to: "/crops",     color: "yellow" },
            { label: "Total Order",value: stats.orders,icon: "📦", to: "/my-orders", color: "blue" },
          ].map((s) => (
            <Link key={s.label} to={s.to} className={`dash__live-stat dash__live-stat--${s.color}`}>
              <span className="dash__live-stat-icon">{s.icon}</span>
              <span className="dash__live-stat-val">
                {statsLoading ? <span className="dash__stat-skeleton" /> : s.value ?? "—"}
              </span>
              <span className="dash__live-stat-label">{s.label}</span>
            </Link>
          ))}
        </div>

        {/* Welcome banner */}
        <div className="dash__banner">
          <div className="dash__banner-text">
            <h2>Apa yang ingin Anda kelola hari ini?</h2>
            <p>Pilih salah satu fitur di bawah untuk memulai aktivitas pertanian Anda.</p>
          </div>
          <div className="dash__banner-icon" aria-hidden="true">🌱</div>
        </div>

        {/* Quick links grid */}
        <div className="dash__grid">
          {QUICK_LINKS.map((item) => (
            <Link key={item.to} to={item.to} className={`dash__card dash__card--${item.color}`}>
              <div className="dash__card-icon">{item.icon}</div>
              <div className="dash__card-body">
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </div>
              <span className="dash__card-arrow">→</span>
            </Link>
          ))}
        </div>

        {/* Tips */}
        <div className="dash__tips">
          <div className="dash__tips-head">
            <h3>💡 Tips Pertanian Hari Ini</h3>
          </div>
          <div className="grid-2 dash__tips-grid">
            {[
              { title: "Musim Tanam Padi",    body: "Periode tanam optimal padi adalah awal musim hujan (Oktober–November) atau akhir musim hujan (Maret–April)." },
              { title: "Pentingnya pH Tanah", body: "Tanah ideal untuk kebanyakan tanaman pangan memiliki pH antara 6.0–7.0. Lakukan uji tanah secara berkala." },
              { title: "Irigasi Efisien",     body: "Gunakan sistem tetes (drip irrigation) untuk menghemat air hingga 50% dibanding irigasi konvensional." },
              { title: "Rotasi Tanaman",      body: "Rotasi tanaman setiap musim membantu menjaga kesuburan tanah dan mengurangi risiko hama penyakit." },
            ].map((tip) => (
              <div key={tip.title} className="card dash__tip-card">
                <h4>{tip.title}</h4>
                <p>{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
