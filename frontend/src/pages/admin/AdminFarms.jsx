import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Admin.css";

function AdminFarms() {
  const [farms, setFarms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await api.get("/farms");
        setFarms(res.data.data ?? res.data ?? []);
      } catch {
        setError("Gagal memuat data farm.");
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>🏡 Farm Management</h1>
          <p>Daftar semua lahan pertanian yang terdaftar oleh seluruh petani</p>
        </div>

        {loading && (
          <div className="loading-wrap"><div className="spinner" /><span>Memuat data farm...</span></div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          <div className="card admin__table-card">
            <div className="admin__table-header">
              <span>{farms.length} Farm Terdaftar</span>
            </div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Farm Name</th>
                    <th>Location</th>
                    <th>Area Size</th>
                    <th>Crop Type</th>
                    <th>Owner</th>
                    <th>Terdaftar</th>
                  </tr>
                </thead>
                <tbody>
                  {farms.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                        Belum ada farm terdaftar
                      </td>
                    </tr>
                  )}
                  {farms.map((farm, idx) => (
                    <tr key={farm._id}>
                      <td className="admin__td-num">{idx + 1}</td>
                      <td className="admin__td-name">{farm.name}</td>
                      <td>{farm.location}</td>
                      <td>{farm.areaSize}</td>
                      <td>{farm.cropType}</td>
                      <td>
                        {farm.userId?.name
                          ? <span>{farm.userId.name}<br /><span style={{ fontSize: 12, color: "var(--text-muted)" }}>{farm.userId.email}</span></span>
                          : <span style={{ color: "var(--text-muted)" }}>—</span>
                        }
                      </td>
                      <td className="admin__td-date">{fmtDate(farm.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminFarms;
