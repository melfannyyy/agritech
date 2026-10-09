import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const FEATURES = [
  {
    icon: "🏡",
    title: "Farm Management",
    desc: "Kelola lahan pertanian Anda secara digital — catat ukuran, lokasi, dan kondisi setiap farm.",
    to: "/farms",
    color: "green",
  },
  {
    icon: "🌾",
    title: "Crop Tracking",
    desc: "Monitor jadwal tanam dan panen. Pantau seluruh siklus tanaman dari satu tempat.",
    to: "/crops",
    color: "yellow",
  },
  {
    icon: "🌤️",
    title: "Weather Forecast",
    desc: "Informasi cuaca terkini untuk membantu pengambilan keputusan pertanian yang tepat.",
    to: "/weather",
    color: "blue",
  },
  {
    icon: "🛒",
    title: "Agri Marketplace",
    desc: "Beli pupuk, benih, dan peralatan pertanian berkualitas langsung dari platform kami.",
    to: "/products",
    color: "green",
  },
  {
    icon: "🐛",
    title: "Pest & Disease Alerts",
    desc: "Pantau ancaman hama dan penyakit terbaru untuk melindungi tanaman Anda.",
    to: "/pest-alerts",
    color: "red",
  },
  {
    icon: "💬",
    title: "Community Forum",
    desc: "Bergabung dengan komunitas petani. Diskusi, berbagi pengalaman, dan tumbuh bersama.",
    to: "/forum",
    color: "purple",
  },
];

const STEPS = [
  { num: "01", title: "Daftar Akun", desc: "Buat akun gratis dalam 1 menit sebagai petani." },
  { num: "02", title: "Tambah Farm",  desc: "Catat lahan dan tanaman Anda di sistem digital." },
  { num: "03", title: "Pantau & Kelola", desc: "Monitor cuaca, hama, dan aktivitas pertanian." },
  { num: "04", title: "Beli Kebutuhan", desc: "Beli pupuk dan benih berkualitas dari marketplace." },
];

function Home() {
  const { user, isAdmin } = useAuth();

  const primaryCTA = user
    ? { to: isAdmin ? "/admin" : "/dashboard", label: "Buka Dashboard" }
    : { to: "/register", label: "Mulai Gratis" };

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="home__hero">
        <div className="container home__hero-inner">
          <div className="home__hero-badge">
            <span>🌿</span> Smart Agriculture Platform
          </div>
          <h1 className="home__hero-title">
            Pertanian Modern,<br />
            <span className="home__hero-accent">Dimulai dari Sini</span>
          </h1>
          <p className="home__hero-subtitle">
            Kelola farm, pantau tanaman, beli kebutuhan pertanian, dan dapatkan
            informasi cuaca — semua dalam satu platform terintegrasi.
          </p>
          <div className="home__hero-actions">
            <Link to={primaryCTA.to} className="btn btn-primary btn-lg">
              {primaryCTA.label} →
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg">
              Lihat Produk
            </Link>
          </div>

        </div>

        {/* Decorative blobs */}
        <div className="home__hero-blob home__hero-blob--1" aria-hidden="true" />
        <div className="home__hero-blob home__hero-blob--2" aria-hidden="true" />
      </section>

      {/* ── Stats ── */}
      <section className="home__stats">
        <div className="container">
          <div className="home__stats-grid">
            {[
              { value: "1,200+", label: "Petani Aktif",    icon: "👨‍🌾" },
              { value: "350+",   label: "Farm Terdaftar",  icon: "🏡" },
              { value: "80+",    label: "Jenis Tanaman",   icon: "🌾" },
              { value: "99%",    label: "Uptime Platform", icon: "⚡" },
            ].map((s) => (
              <div key={s.label} className="home__stat-card">
                <span className="home__stat-icon">{s.icon}</span>
                <div className="home__stat-value">{s.value}</div>
                <div className="home__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="home__features">
        <div className="container">
          <div className="home__section-head">
            <span className="home__section-chip">🚀 Fitur Lengkap</span>
            <h2>Semua yang Anda Butuhkan</h2>
            <p>Dari manajemen farm hingga marketplace — kami hadir untuk mendukung petani modern Indonesia.</p>
          </div>
          <div className="home__features-grid">
            {FEATURES.map((f) => (
              <Link key={f.to} to={f.to} className={`home__feature-card home__feature-card--${f.color}`}>
                <div className="home__feature-icon">{f.icon}</div>
                <div className="home__feature-body">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
                <span className="home__feature-link">Buka →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="home__steps">
        <div className="container">
          <div className="home__section-head">
            <span className="home__section-chip">📖 Cara Kerja</span>
            <h2>Mulai dalam 4 Langkah</h2>
            <p>Bergabung mudah dan langsung bisa digunakan untuk mengelola pertanian Anda.</p>
          </div>
          <div className="home__steps-grid">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="home__step-card">
                <div className="home__step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {idx < STEPS.length - 1 && (
                  <div className="home__step-arrow" aria-hidden="true">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home__cta">
        <div className="container home__cta-inner">
          <div className="home__cta-badge">🌱 Bergabung Sekarang</div>
          <h2>Siap Memulai Pertanian Cerdas?</h2>
          <p>Bergabung dengan ribuan petani yang sudah menggunakan AgriTech untuk meningkatkan produktivitas mereka.</p>
          <div className="home__cta-actions">
            <Link to={primaryCTA.to} className="btn btn-lg home__cta-btn">
              {primaryCTA.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
