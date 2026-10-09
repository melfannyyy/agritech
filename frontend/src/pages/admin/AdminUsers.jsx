import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Admin.css";

const EMPTY_FORM = { name: "", email: "", phone: "", address: "", role: "farmer", password: "" };

const STATUS_TABS = [
  { key: "all",      label: "Semua" },
  { key: "pending",  label: "⏳ Pending" },
  { key: "approved", label: "✅ Approved" },
  { key: "rejected", label: "❌ Rejected" },
];

function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter]     = useState("all");
  const [actioning, setActioning] = useState(null); // userId being approved/rejected

  // Edit modal
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");

  // View modal
  const [viewTarget, setViewTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch {
      setError("Gagal memuat data users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Approve / Reject ──
  const handleStatus = async (id, status) => {
    setActioning(id);
    try {
      await api.put(`/users/${id}/status`, { status });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, status } : u));
    } catch {
      alert(`Gagal mengubah status user.`);
    } finally {
      setActioning(null);
    }
  };

  // ── Edit ──
  const openEdit = (user) => {
    setEditTarget(user);
    setForm({
      name:    user.name    || "",
      email:   user.email   || "",
      phone:   user.phone   || "",
      address: user.address || "",
      role:    user.role    || "farmer",
      password: "",
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
      const res = await api.put(`/useredit/${editTarget._id}`, form);
      setUsers((prev) => prev.map((u) => u._id === editTarget._id ? { ...u, ...res.data } : u));
      if (form.password) alert(`Password untuk "${form.name}" berhasil diganti.`);
      closeEdit();
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal mengupdate user.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus user "${name}"?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      alert("Gagal menghapus user.");
    } finally {
      setDeleting(null);
    }
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const filtered = filter === "all" ? users : users.filter((u) => u.status === filter);

  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>👥 User Management</h1>
          <p>Kelola pendaftaran dan akun pengguna platform AgriTech</p>
        </div>

        {/* Pending alert banner */}
        {!loading && pendingCount > 0 && (
          <div className="alert alert-warning adm__pending-banner">
            ⏳ Ada <strong>{pendingCount} akun</strong> yang menunggu persetujuan Anda.
          </div>
        )}

        {/* Filter tabs */}
        {!loading && (
          <div className="adm__filter-tabs">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                className={"adm__filter-tab" + (filter === t.key ? " adm__filter-tab--active" : "")}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
                <span className="adm__filter-count">
                  {t.key === "all" ? users.length : users.filter((u) => u.status === t.key).length}
                </span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="loading-wrap"><div className="spinner" /><span>Memuat users...</span></div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          <div className="card admin__table-card">
            <div className="admin__table-header">
              <span>{filtered.length} User</span>
            </div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Telepon</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Terdaftar</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                        Tidak ada user dengan status ini.
                      </td>
                    </tr>
                  )}
                  {filtered.map((user, idx) => (
                    <tr key={user._id}>
                      <td className="admin__td-num">{idx + 1}</td>
                      <td className="admin__td-name">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                      <td>
                        <span className={`badge ${user.role === "admin" ? "badge-yellow" : "badge-green"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge adm__status-badge adm__status-badge--${user.status ?? "pending"}`}>
                          {user.status === "approved" ? "✅ Approved"
                            : user.status === "rejected" ? "❌ Rejected"
                            : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="admin__td-date">{fmtDate(user.createdAt)}</td>
                      <td>
                        <div className="adm__action-col">
                          {/* Row 1 — Approve / Reject (only shown when relevant) */}
                          {user.role !== "admin" && user.status === "pending" && (
                            <div className="adm__action-row">
                              <button
                                className="btn adm__btn-approve"
                                onClick={() => handleStatus(user._id, "approved")}
                                disabled={actioning === user._id}
                                title="Setujui akun"
                              >
                                {actioning === user._id ? "..." : "✓ Approve"}
                              </button>
                              <button
                                className="btn adm__btn-reject"
                                onClick={() => handleStatus(user._id, "rejected")}
                                disabled={actioning === user._id}
                                title="Tolak akun"
                              >
                                {actioning === user._id ? "..." : "✕ Reject"}
                              </button>
                            </div>
                          )}
                          {user.role !== "admin" && user.status === "rejected" && (
                            <div className="adm__action-row">
                              <button
                                className="btn adm__btn-approve"
                                onClick={() => handleStatus(user._id, "approved")}
                                disabled={actioning === user._id}
                                title="Approve akun"
                              >
                                {actioning === user._id ? "..." : "✓ Approve"}
                              </button>
                            </div>
                          )}
                          {/* Row 2 — Edit / Delete / View */}
                          <div className="adm__action-row">
                            <button
                              className="btn tbl__btn-edit"
                              onClick={() => openEdit(user)}
                              title="Edit user"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn tbl__btn-delete"
                              onClick={() => handleDelete(user._id, user.name)}
                              disabled={deleting === user._id || user.role === "admin"}
                              title={user.role === "admin" ? "Admin tidak bisa dihapus" : "Hapus user"}
                            >
                              {deleting === user._id ? "..." : "🗑️"}
                            </button>
                            <button
                              className="btn adm__btn-view"
                              onClick={() => setViewTarget(user)}
                              title="Lihat detail"
                            >
                              👁️
                            </button>
                          </div>
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

      {/* ══ Edit Modal ══ */}
      {editTarget && (
        <div className="modal__overlay" onClick={closeEdit}>
          <div className="modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>✏️ Edit User</h2>
              <button className="modal__close" onClick={closeEdit}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal__form">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input name="name" type="text" className="form-control"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" className="form-control"
                  value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input name="phone" type="text" className="form-control"
                  value={form.phone} onChange={handleChange}
                  placeholder="08xxxxxxxxxx" />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <input name="address" type="text" className="form-control"
                  value={form.address} onChange={handleChange}
                  placeholder="Kota, Provinsi" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" className="form-control"
                  value={form.role} onChange={handleChange}>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Password Baru</label>
                <input name="password" type="password" className="form-control"
                  value={form.password} onChange={handleChange}
                  placeholder="Kosongkan jika tidak ingin mengganti"
                  minLength={6} autoComplete="new-password" />
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

      {/* ══ View Modal ══ */}
      {viewTarget && (
        <div className="modal__overlay" onClick={() => setViewTarget(null)}>
          <div className="modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>👁️ Detail User</h2>
              <button className="modal__close" onClick={() => setViewTarget(null)}>✕</button>
            </div>
            <div className="modal__form">
              <div className="adm__view-avatar">
                {viewTarget.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="adm__view-grid">
                {[
                  { label: "Nama",      value: viewTarget.name    || "—" },
                  { label: "Email",     value: viewTarget.email   || "—" },
                  { label: "Telepon",   value: viewTarget.phone   || "—" },
                  { label: "Alamat",    value: viewTarget.address || "—" },
                  { label: "Role",      value: viewTarget.role    || "—" },
                  { label: "Status",    value: viewTarget.status  || "pending" },
                  { label: "Terdaftar", value: fmtDate(viewTarget.createdAt) },
                ].map((item) => (
                  <div key={item.label} className="adm__view-row">
                    <span className="adm__view-label">{item.label}</span>
                    <span className="adm__view-value">
                      {item.label === "Role" ? (
                        <span className={`badge ${viewTarget.role === "admin" ? "badge-yellow" : "badge-green"}`}>
                          {viewTarget.role}
                        </span>
                      ) : item.label === "Status" ? (
                        <span className={`badge adm__status-badge adm__status-badge--${viewTarget.status ?? "pending"}`}>
                          {viewTarget.status === "approved" ? "✅ Approved"
                            : viewTarget.status === "rejected" ? "❌ Rejected"
                            : "⏳ Pending"}
                        </span>
                      ) : item.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="modal__footer" style={{ marginTop: 20 }}>
                <button className="btn btn-outline" onClick={() => setViewTarget(null)} style={{ width: "100%" }}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
