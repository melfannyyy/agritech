import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./Admin.css";

const CATEGORIES = ["Pupuk", "Benih", "Pestisida", "Peralatan", "Lainnya"];

function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", category: "", price: "", description: "", imgUrl: "",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
      });
      setSuccess("Produk berhasil ditambahkan!");
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambahkan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>➕ Tambah Produk</h1>
          <p>Tambahkan produk baru ke Agri Marketplace</p>
        </div>

        <div className="admin__form-wrap">
          <div className="card admin__form-card">
            <div className="admin__form-breadcrumb">
              <Link to="/admin/products">← Kembali ke Products</Link>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin__form-grid">
                <div className="form-group">
                  <label htmlFor="name">Nama Produk</label>
                  <input
                    id="name" name="name" type="text" className="form-control"
                    value={form.name} onChange={handleChange}
                    placeholder="Contoh: Pupuk Urea 50kg" required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Kategori</label>
                  <select
                    id="category" name="category" className="form-control"
                    value={form.category} onChange={handleChange} required
                  >
                    <option value="">Pilih kategori</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="price">Harga (Rp)</label>
                  <input
                    id="price" name="price" type="number" className="form-control"
                    value={form.price} onChange={handleChange}
                    placeholder="Contoh: 150000" min="0" required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="imgUrl">URL Gambar</label>
                  <input
                    id="imgUrl" name="imgUrl" type="url" className="form-control"
                    value={form.imgUrl} onChange={handleChange}
                    placeholder="https://..." required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Deskripsi Produk</label>
                <textarea
                  id="description" name="description" className="form-control"
                  value={form.description} onChange={handleChange}
                  placeholder="Jelaskan produk ini..."
                  rows={3} required
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Preview */}
              {form.imgUrl && (
                <div className="admin__img-preview">
                  <p className="admin__img-preview-label">Preview Gambar:</p>
                  <img
                    src={form.imgUrl} alt="preview"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}

              {error   && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => navigate("/admin/products")}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProduct;
