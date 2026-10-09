import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Admin.css";

const CATEGORIES = ["Pupuk", "Benih", "Pestisida", "Peralatan", "Lainnya"];
const EMPTY_FORM  = { name: "", category: "", price: "", description: "", imgUrl: "" };

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [deleting, setDeleting] = useState(null);

  // Edit modal state
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || res.data);
    } catch {
      setError("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Edit ──
  const openEdit = (product) => {
    setEditTarget(product);
    setForm({
      name:        product.name        || "",
      category:    product.category    || "",
      price:       String(product.price ?? ""),
      description: product.description || "",
      imgUrl:      product.imgUrl      || "",
    });
    setFormError("");
  };
  const closeEdit = () => { setEditTarget(null); setFormError(""); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const res = await api.put(`/products/${editTarget._id}`, {
        ...form,
        price: Number(form.price),
      });
      const updated = res.data.data ?? res.data;
      setProducts((prev) => prev.map((p) => p._id === editTarget._id ? { ...p, ...updated } : p));
      closeEdit();
    } catch {
      setFormError("Gagal mengupdate produk.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus produk "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/deleteproduct/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Gagal menghapus produk.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1>🛒 Product Management</h1>
            <p>Kelola produk yang tersedia di Agri Marketplace</p>
          </div>
          <Link to="/admin/products/add" className="btn btn-primary">
            + Tambah Produk
          </Link>
        </div>

        {loading && (
          <div className="loading-wrap"><div className="spinner" /><span>Memuat produk...</span></div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          <div className="grid-3 admin__product-grid">
            {products.length === 0 && (
              <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", padding: 48 }}>
                <p>Belum ada produk. <Link to="/admin/products/add">Tambah sekarang</Link></p>
              </div>
            )}
            {products.map((product) => (
              <div key={product._id} className="card admin__product-card">
                <div className="admin__product-img-wrap">
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="admin__product-img"
                    onError={(e) => { e.target.src = "https://placehold.co/300x160/dcfce7/166534?text=No+Image"; }}
                  />
                  <span className="badge badge-green admin__product-cat">{product.category}</span>
                </div>
                <div className="admin__product-body">
                  <h3>{product.name}</h3>
                  <p className="admin__product-desc">{product.description}</p>
                  <div className="admin__product-footer">
                    <span className="admin__product-price">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-sm tbl__btn-edit"
                        onClick={() => openEdit(product)}
                        title="Edit produk"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deleting === product._id}
                      >
                        {deleting === product._id ? "..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ Edit Modal ══ */}
      {editTarget && (
        <div className="modal__overlay" onClick={closeEdit}>
          <div className="modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>✏️ Edit Produk</h2>
              <button className="modal__close" onClick={closeEdit}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal__form">
              <div className="form-group">
                <label>Nama Produk</label>
                <input name="name" type="text" className="form-control"
                  value={form.name} onChange={handleChange}
                  placeholder="Contoh: Pupuk Urea 50kg" required />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <select name="category" className="form-control"
                  value={form.category} onChange={handleChange} required>
                  <option value="">Pilih kategori</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Harga (Rp)</label>
                <input name="price" type="number" className="form-control"
                  value={form.price} onChange={handleChange}
                  placeholder="Contoh: 150000" min="0" required />
              </div>
              <div className="form-group">
                <label>URL Gambar</label>
                <input name="imgUrl" type="url" className="form-control"
                  value={form.imgUrl} onChange={handleChange}
                  placeholder="https://..." required />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea name="description" className="form-control"
                  value={form.description} onChange={handleChange}
                  placeholder="Jelaskan produk ini..."
                  rows={3} style={{ resize: "vertical" }} required />
              </div>

              {formError && <div className="alert alert-error">{formError}</div>}

              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={closeEdit}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
