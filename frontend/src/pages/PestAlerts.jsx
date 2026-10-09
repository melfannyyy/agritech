import { useState } from "react";
import "./PestAlerts.css";

const ALERTS = [
  {
    id: 1,
    type: "pest",
    severity: "high",
    title: "Wereng Coklat (Brown Planthopper)",
    crop: "Padi",
    region: "Jawa Tengah, Jawa Timur",
    description: "Serangan wereng coklat terdeteksi di beberapa wilayah sentra padi. Populasi meningkat akibat curah hujan tinggi.",
    symptoms: ["Daun menguning dan mengering (hopperburn)", "Tanaman rebah di area tertentu", "Telur dan nimfa pada pangkal batang"],
    prevention: ["Gunakan varietas tahan wereng (IR-64, Ciherang)", "Semprot insektisida berbahan aktif imidakloprid atau BPMC", "Jaga keseimbangan ekosistem sawah dengan tidak menyemprot secara berlebihan"],
    date: "2025-01-10",
  },
  {
    id: 2,
    type: "disease",
    severity: "medium",
    title: "Blast Padi (Pyricularia oryzae)",
    crop: "Padi",
    region: "Nasional",
    description: "Penyakit blast aktif pada musim hujan. Jamur berkembang pesat pada kondisi kelembaban tinggi dan suhu 20–28°C.",
    symptoms: ["Bercak coklat keabuan berbentuk belah ketupat pada daun", "Leher malai berwarna kecoklatan dan patah", "Bulir padi hampa"],
    prevention: ["Gunakan fungisida berbahan trisiklazol atau azoksistrobin", "Hindari pemupukan N berlebihan", "Tanam varietas tahan blast"],
    date: "2025-01-08",
  },
  {
    id: 3,
    type: "pest",
    severity: "medium",
    title: "Ulat Grayak (Spodoptera frugiperda)",
    crop: "Jagung",
    region: "Lampung, Sulawesi Selatan",
    description: "Fall armyworm menyerang tanaman jagung fase vegetatif. Kerusakan terjadi pada titik tumbuh dan daun muda.",
    symptoms: ["Bekas gigitan pada daun dengan sisa feces (kotoran)", "Lubang tidak teratur pada daun muda", "Larva ditemukan di dalam gulungan daun"],
    prevention: ["Semprotkan Bacillus thuringiensis (Bt) pada fase awal", "Gunakan insektisida klorantraniliprol", "Lakukan monitoring rutin setiap 3 hari"],
    date: "2025-01-07",
  },
  {
    id: 4,
    type: "disease",
    severity: "low",
    title: "Layu Fusarium",
    crop: "Cabai, Tomat",
    region: "Jawa Barat",
    description: "Penyakit layu akibat jamur tanah Fusarium oxysporum. Menyerang tanaman di segala umur terutama saat tanah tergenang.",
    symptoms: ["Daun menguning dari bawah ke atas", "Tanaman layu di siang hari meski tanah lembab", "Pembuluh batang berwarna coklat saat dibelah"],
    prevention: ["Gunakan fungisida benomil atau karbendazim", "Hindari genangan air di sekitar tanaman", "Rotasi tanaman dengan tanaman bukan inang"],
    date: "2025-01-05",
  },
  {
    id: 5,
    type: "pest",
    severity: "high",
    title: "Penggerek Batang Padi",
    crop: "Padi",
    region: "Sumatera Selatan, Kalimantan",
    description: "Serangan penggerek batang padi kuning aktif pada fase bunting. Ditemukan hamparan luas dengan gejala sundep dan beluk.",
    symptoms: ["Anakan muda layu dan mati (sundep)", "Malai kosong tidak berisi (beluk)", "Bekas lubang kecil pada pangkal batang"],
    prevention: ["Pasang lampu perangkap ngengat di malam hari", "Gunakan insektisida karbofuran pada fase vegetatif", "Kumpulkan dan musnahkan telur penggerek"],
    date: "2025-01-03",
  },
];

const SEVERITY_CONFIG = {
  high:   { label: "Bahaya Tinggi",   cls: "alert-sev--high",   badge: "badge-red"    },
  medium: { label: "Bahaya Sedang",   cls: "alert-sev--medium", badge: "badge-yellow" },
  low:    { label: "Bahaya Rendah",   cls: "alert-sev--low",    badge: "badge-blue"   },
};

const TYPE_CONFIG = {
  pest:    { icon: "🐛", label: "Hama" },
  disease: { icon: "🦠", label: "Penyakit" },
};

function PestAlerts() {
  const [filter, setFilter] = useState("all"); // all | pest | disease
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "all" ? ALERTS : ALERTS.filter((a) => a.type === filter);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>🐛 Pest & Disease Alerts</h1>
          <p>Pantau ancaman hama dan penyakit terbaru untuk melindungi tanaman Anda</p>
        </div>

        {/* Summary banner */}
        <div className="pa__banner">
          <div className="pa__banner-stats">
            <div className="pa__banner-stat">
              <span className="pa__banner-num pa__banner-num--red">
                {ALERTS.filter(a => a.severity === "high").length}
              </span>
              <span>Bahaya Tinggi</span>
            </div>
            <div className="pa__banner-divider" />
            <div className="pa__banner-stat">
              <span className="pa__banner-num pa__banner-num--yellow">
                {ALERTS.filter(a => a.severity === "medium").length}
              </span>
              <span>Bahaya Sedang</span>
            </div>
            <div className="pa__banner-divider" />
            <div className="pa__banner-stat">
              <span className="pa__banner-num pa__banner-num--blue">
                {ALERTS.filter(a => a.severity === "low").length}
              </span>
              <span>Bahaya Rendah</span>
            </div>
          </div>
          <div className="pa__banner-note">
            ⚠️ Data diperbarui setiap hari dari laporan petani dan dinas pertanian setempat
          </div>
        </div>

        {/* Filter tabs */}
        <div className="pa__filters">
          {[
            { key: "all",     label: "Semua Alert" },
            { key: "pest",    label: "🐛 Hama" },
            { key: "disease", label: "🦠 Penyakit" },
          ].map((f) => (
            <button
              key={f.key}
              className={"pa__filter-btn" + (filter === f.key ? " pa__filter-btn--active" : "")}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert cards */}
        <div className="pa__list">
          {filtered.map((alert) => {
            const sev  = SEVERITY_CONFIG[alert.severity];
            const type = TYPE_CONFIG[alert.type];
            const isOpen = expanded === alert.id;
            return (
              <div key={alert.id} className={`card pa__card ${sev.cls}`}>
                <div className="pa__card-header" onClick={() => setExpanded(isOpen ? null : alert.id)}>
                  <div className="pa__card-title-row">
                    <span className="pa__type-icon">{type.icon}</span>
                    <div>
                      <h3 className="pa__card-title">{alert.title}</h3>
                      <div className="pa__card-meta">
                        <span className="badge badge-green">{alert.crop}</span>
                        <span className={`badge ${sev.badge}`}>{sev.label}</span>
                        <span className="badge badge-gray">{type.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pa__card-right">
                    <span className="pa__card-date">
                      {new Date(alert.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                    <span className="pa__card-chevron">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="pa__card-body">
                    <p className="pa__card-desc">{alert.description}</p>
                    <p className="pa__region">📍 Wilayah terdampak: <strong>{alert.region}</strong></p>

                    <div className="pa__detail-grid">
                      <div className="pa__detail-section">
                        <h4>⚠️ Gejala</h4>
                        <ul className="pa__detail-list">
                          {alert.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="pa__detail-section">
                        <h4>🛡️ Pencegahan & Penanganan</h4>
                        <ul className="pa__detail-list pa__detail-list--green">
                          {alert.prevention.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info note */}
        <div className="alert alert-info" style={{ marginTop: 24 }}>
          <strong>ℹ️ Catatan:</strong> Data alert ini bersifat informatif berdasarkan laporan dinas pertanian.
          Untuk penanganan spesifik, konsultasikan dengan penyuluh pertanian setempat.
        </div>
      </div>
    </div>
  );
}

export default PestAlerts;
