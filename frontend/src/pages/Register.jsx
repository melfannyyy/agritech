import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Register() {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", address: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);   // pending approval screen

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/users/register", { ...form, role: "farmer" });
      setDone(true);   // show pending screen
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // ── Pending approval screen ──
  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="auth-brand-icon">🌿</span>
            <span className="auth-brand-name">Agri<span>Tech</span></span>
          </div>
          <div className="auth-pending">
            <div className="auth-pending-icon">⏳</div>
            <h2 className="auth-title">Menunggu Persetujuan</h2>
            <p className="auth-sub">
              Akun <strong>{form.name}</strong> berhasil didaftarkan.<br />
              Admin akan memverifikasi dan menyetujui akun Anda.
            </p>
            <p className="auth-pending-note">
              Silakan coba login setelah mendapat konfirmasi dari admin.
            </p>
            <Link to="/login" className="btn btn-primary auth-submit">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-brand">
          <span className="auth-brand-icon">🌿</span>
          <span className="auth-brand-name">Agri<span>Tech</span></span>
        </div>

        <h2 className="auth-title">Buat Akun Baru</h2>
        <p className="auth-sub">Daftar sebagai petani di platform AgriTech</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-grid">
            <div className="form-group">
              <label htmlFor="name">Nama Lengkap</label>
              <input
                id="name" name="name" type="text" className="form-control"
                value={form.name} onChange={handleChange}
                placeholder="Nama Anda" required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email" name="email" type="email" className="form-control"
                value={form.email} onChange={handleChange}
                placeholder="email@contoh.com" required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon</label>
              <input
                id="phone" name="phone" type="text" className="form-control"
                value={form.phone} onChange={handleChange}
                placeholder="08xxxxxxxxxx" required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password" className="form-control"
                value={form.password} onChange={handleChange}
                placeholder="Minimal 6 karakter" minLength={6} required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="address">Alamat</label>
            <input
              id="address" name="address" type="text" className="form-control"
              value={form.address} onChange={handleChange}
              placeholder="Kota, Provinsi" required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
