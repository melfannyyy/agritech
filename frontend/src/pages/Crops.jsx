import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Crops.css";

const EMPTY_FORM = { cropName: "", variety: "", quantity: "", plantedDate: "", estimatedHarvestDate: "" };

function Crops() {
  const { user } = useAuth();
  const [crops, setCrops]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // modal state
  const [showModal, setShowModal]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState("");
  const [deleting, setDeleting]       = useState(null);

  const fetchCrops = async () => {
    try {
      const res = user?._id
        ? await api.get(`/getcrops/${user._id}`)
        : await api.get("/crops");
      setCrops(res.data.data ?? res.data);
    } catch {
      setError("Gagal mengambil data crop.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCrops(); }, [user?._id]);

  // ── Modal helpers ──
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (crop) => {
    setEditTarget(crop);
    setForm({
      cropName:             crop.cropName,
      variety:              crop.variety,
      quantity:             String(crop.quantity),
      plantedDate:          crop.plantedDate?.slice(0, 10) ?? "",
      estimatedHarvestDate: crop.estimatedHarvestDate?.slice(0, 10) ?? "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setFormError(""); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    const payload = { ...form, quantity: Number(form.quantity) };
    try {
      if (editTarget) {
        await api.put(`/editcrop/${editTarget._id}`, payload);
      } else {
        await api.post("/addcrop", { ...payload, userId: user?._id });
      }
      closeModal();
      await fetchCrops();
    } catch {
      setFormError(editTarget ? "Gagal mengupdate tanaman." : "Gagal menambahkan tanaman.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus tanaman "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/deletecrop/${id}`);
      setCrops(prev => prev.filter(c => c._id !== id));
    } catch {
      alert("Gagal menghapus tanaman.");
    } finally {
      setDeleting(null);
    }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // highlight planted date if approaching harvest
  const isUrgent = (estDate) => {
    const diff = new Date(estDate) - new Date();
    return diff >= 0 && diff <= 14 * 86400000;
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>🌾 Crop Management</h1>
          <p>Monitor pertumbuhan dan jadwal tanam–panen tanaman Anda</p>
        </div>

        {/* Top bar */}
        <div className="tbl__topbar">
          <span className="tbl__count">{crops.length} Tanaman Terdaftar</span>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Crop</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && <div className="loading-wrap"><div className="spinner" /><span>Memuat data...</span></div>}

        {!loading && (
          <div className="card tbl__card">
            <div className="tbl__wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>NAME</th>
                    <th>VARIETY</th>
                    <th>QUANTITY</th>
                    <th>PLANTED DATE</th>
                    <th>ESTIMATED HARVEST DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="tbl__empty">Belum ada tanaman. Klik "Add Crop" untuk menambahkan.</td>
                    </tr>
                  ) : crops.map((crop, idx) => (
                    <tr key={crop._id}>
                      <td className="tbl__sno">{idx + 1}</td>
                      <td className="tbl__name">{crop.cropName}</td>
                      <td>{crop.variety}</td>
                      <td>{crop.quantity}</td>
                      <td className={isUrgent(crop.estimatedHarvestDate) ? "tbl__date--urgent" : ""}>
                        {fmtDate(crop.plantedDate)}
                      </td>
                      <td>{fmtDate(crop.estimatedHarvestDate)}</td>
                      <td>
                        <div className="tbl__actions">
                          <button className="btn tbl__btn-edit" onClick={() => openEdit(crop)}>Edit</button>
                          <button
                            className="btn tbl__btn-delete"
                            onClick={() => handleDelete(crop._id, crop.cropName)}
                            disabled={deleting === crop._id}
                          >
                            {deleting === crop._id ? "..." : "Delete"}
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
              <h2>{editTarget ? "Edit Crop" : "Add Crop"}</h2>
              <button className="modal__close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal__form">
              <div className="form-group">
                <label>Crop Name</label>
                <input name="cropName" type="text" className="form-control"
                  value={form.cropName} onChange={handleChange}
                  placeholder="Contoh: Rice" required />
              </div>
              <div className="form-group">
                <label>Variety</label>
                <input name="variety" type="text" className="form-control"
                  value={form.variety} onChange={handleChange}
                  placeholder="Contoh: Basmathi" required />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input name="quantity" type="number" className="form-control"
                  value={form.quantity} onChange={handleChange}
                  placeholder="Contoh: 100" min="0" required />
              </div>
              <div className="form-group">
                <label>Planted Date</label>
                <input name="plantedDate" type="date" className="form-control"
                  value={form.plantedDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Estimated Harvest Date</label>
                <input name="estimatedHarvestDate" type="date" className="form-control"
                  value={form.estimatedHarvestDate} onChange={handleChange} required />
              </div>

              {formError && <div className="alert alert-error">{formError}</div>}

              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Menyimpan..." : editTarget ? "Update Crop" : "Tambah Crop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Crops;
