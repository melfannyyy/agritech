import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Farms.css";

const EMPTY_FORM = { name: "", location: "", areaSize: "", cropType: "" };

function Farms() {
  const { user } = useAuth();
  const [farms, setFarms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add mode
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");
  const [deleting, setDeleting]     = useState(null);

  const fetchFarms = async () => {
    try {
      const res = user?._id
        ? await api.get(`/getfarms/${user._id}`)
        : await api.get("/farms");
      setFarms(res.data.data ?? res.data);
    } catch {
      setError("Gagal mengambil data farm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFarms(); }, [user?._id]);

  // ── Open modal ──
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (farm) => {
    setEditTarget(farm);
    setForm({ name: farm.name, location: farm.location, areaSize: farm.areaSize, cropType: farm.cropType });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setFormError(""); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Submit (add or edit) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      if (editTarget) {
        await api.put(`/editfarm/${editTarget._id}`, form);
      } else {
        await api.post("/addfarm", { ...form, userId: user?._id });
      }
      closeModal();
      await fetchFarms();
    } catch {
      setFormError(editTarget ? "Gagal mengupdate farm." : "Gagal menambahkan farm.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus farm "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/deletefarm/${id}`);
      setFarms(prev => prev.filter(f => f._id !== id));
    } catch {
      alert("Gagal menghapus farm.");
    } finally {
      setDeleting(null);
    }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>🏡 Farm Management</h1>
          <p>Kelola dan pantau seluruh lahan pertanian Anda</p>
        </div>

        {/* Top bar */}
        <div className="tbl__topbar">
          <span className="tbl__count">{farms.length} Farm Terdaftar</span>
          <button className="btn btn-primary" onClick={openAdd}>+ Add New Farm</button>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading */}
        {loading && <div className="loading-wrap"><div className="spinner" /><span>Memuat data...</span></div>}

        {/* Table */}
        {!loading && (
          <div className="card tbl__card">
            <div className="tbl__wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>NAME</th>
                    <th>LOCATION</th>
                    <th>AREA SIZE</th>
                    <th>CROP TYPE</th>
                    <th>CREATED AT</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {farms.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="tbl__empty">Belum ada farm. Klik "Add New Farm" untuk menambahkan.</td>
                    </tr>
                  ) : farms.map((farm, idx) => (
                    <tr key={farm._id}>
                      <td className="tbl__sno">{idx + 1}</td>
                      <td className="tbl__name">{farm.name}</td>
                      <td>{farm.location}</td>
                      <td>{farm.areaSize}</td>
                      <td>{farm.cropType}</td>
                      <td className="tbl__date">{fmtDate(farm.createdAt)}</td>
                      <td>
                        <div className="tbl__actions">
                          <button className="btn tbl__btn-edit" onClick={() => openEdit(farm)}>Edit</button>
                          <button
                            className="btn tbl__btn-delete"
                            onClick={() => handleDelete(farm._id, farm.name)}
                            disabled={deleting === farm._id}
                          >
                            {deleting === farm._id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="modal__overlay" onClick={closeModal}>
          <div className="modal__box" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editTarget ? "Edit Farm" : "Add New Farm"}</h2>
              <button className="modal__close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal__form">
              <div className="form-group">
                <label>Farm Name</label>
                <input name="name" type="text" className="form-control"
                  value={form.name} onChange={handleChange}
                  placeholder="Contoh: Rice Farm" required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" type="text" className="form-control"
                  value={form.location} onChange={handleChange}
                  placeholder="Contoh: Hyderabad City Outskirt" required />
              </div>
              <div className="form-group">
                <label>Area Size</label>
                <input name="areaSize" type="text" className="form-control"
                  value={form.areaSize} onChange={handleChange}
                  placeholder="Contoh: 10 acres" required />
              </div>
              <div className="form-group">
                <label>Crop Type</label>
                <input name="cropType" type="text" className="form-control"
                  value={form.cropType} onChange={handleChange}
                  placeholder="Contoh: Basmathi Rice" required />
              </div>

              {formError && <div className="alert alert-error">{formError}</div>}

              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Menyimpan..." : editTarget ? "Update Farm" : "Tambah Farm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Farms;
