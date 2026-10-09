import { useParams, useNavigate } from "react-router-dom";
import { CROPS_INFO } from "./CropInfo";
import "./CropDetail.css";

function CropDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const crop = CROPS_INFO.find((c) => c.slug === slug);

  if (!crop) {
    return (
      <div className="cd__not-found">
        <h2>Tanaman tidak ditemukan</h2>
        <button className="cd__back-btn" onClick={() => navigate("/crop-info")}>
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="cd__page">
      <div className="cd__inner">
        {/* ── Hero image ── */}
        <div className="cd__hero">
          <img src={crop.imgUrl} alt={crop.name} className="cd__hero-img" />
          <div className="cd__hero-overlay" />
          <h1 className="cd__hero-title">{crop.name}</h1>
          <button className="cd__back-hero" onClick={() => navigate("/crop-info")}>
            ← Back
          </button>
        </div>

        {/* ── Crop Details ── */}
        <div className="cd__section">
          <h2 className="cd__section-title">Crop Details</h2>
          <hr className="cd__divider" />
          <div className="cd__details-grid">
            {[
              { icon: "🗄️",  label: "Scientific Name", value: crop.scientificName },
              { icon: "📅",  label: "Growth Period",    value: crop.growthPeriod   },
              { icon: "🕐",  label: "Season",           value: crop.season         },
              { icon: "📈",  label: "Sowing Time",      value: crop.sowingTime     },
              { icon: "☁️",  label: "Climate",          value: crop.climate        },
              { icon: "🛡️",  label: "Harvest Time",     value: crop.harvestTime    },
              { icon: "🖼️",  label: "Soil Type",        value: crop.soilType       },
            ].map((item) => (
              <div key={item.label} className="cd__detail-item">
                <div className="cd__detail-icon">{item.icon}</div>
                <div>
                  <div className="cd__detail-label">{item.label}</div>
                  <div className="cd__detail-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pesticides & Fertilizers ── */}
        <div className="cd__rec-grid">
          <div className="cd__rec-card cd__rec-card--red">
            <div className="cd__rec-head">
              <span className="cd__rec-icon">🗑️</span>
              <h3 className="cd__rec-title cd__rec-title--red">Recommended Pesticides</h3>
            </div>
            <div className="cd__tags">
              {crop.pesticides.map((p) => (
                <span key={p} className="cd__tag cd__tag--red">{p}</span>
              ))}
            </div>
          </div>

          <div className="cd__rec-card cd__rec-card--blue">
            <div className="cd__rec-head">
              <span className="cd__rec-icon">📈</span>
              <h3 className="cd__rec-title cd__rec-title--blue">Recommended Fertilizers</h3>
            </div>
            <div className="cd__tags">
              {crop.fertilizers.map((f) => (
                <span key={f} className="cd__tag cd__tag--blue">{f}</span>
              ))}
            </div>
          </div>
        </div>

      </div>{/* end .cd__inner */}
    </div>
  );
}

export default CropDetail;
