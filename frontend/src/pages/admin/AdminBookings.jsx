import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Admin.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [deleting, setDeleting] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data);
    } catch {
      setError("Gagal memuat data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pesanan ini?")) return;
    setDeleting(id);
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch {
      alert("Gagal menghapus pesanan.");
    } finally {
      setDeleting(null);
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const fmtDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>📦 Service & Order Management</h1>
          <p>Pantau dan kelola seluruh pesanan layanan dari pengguna</p>
        </div>

        {/* Summary */}
        <div className="grid-3 admin__booking-stats">
          <div className="card admin__bstat">
            <div className="admin__bstat-icon">📦</div>
            <div className="admin__bstat-val">{loading ? "—" : bookings.length}</div>
            <div className="admin__bstat-label">Total Pesanan</div>
          </div>
          <div className="card admin__bstat">
            <div className="admin__bstat-icon">💰</div>
            <div className="admin__bstat-val">
              {loading ? "—" : `Rp ${totalRevenue.toLocaleString("id-ID")}`}
            </div>
            <div className="admin__bstat-label">Total Pendapatan</div>
          </div>
          <div className="card admin__bstat">
            <div className="admin__bstat-icon">✅</div>
            <div className="admin__bstat-val">{loading ? "—" : bookings.length}</div>
            <div className="admin__bstat-label">Pesanan Confirmed</div>
          </div>
        </div>

        {loading && (
          <div className="loading-wrap"><div className="spinner" /><span>Memuat pesanan...</span></div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          <div className="card admin__table-card">
            <div className="admin__table-header">
              <span>{bookings.length} Total Pesanan</span>
            </div>
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Produk</th>
                    <th>Pengguna</th>
                    <th>Tanggal Pesan</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                        Belum ada pesanan
                      </td>
                    </tr>
                  )}
                  {bookings.map((booking, idx) => (
                    <tr key={booking._id}>
                      <td className="admin__td-num">{idx + 1}</td>
                      <td className="admin__td-name">
                        {booking.productId?.name || <span style={{ color: "var(--text-muted)" }}>—</span>}
                        {booking.productId?.category && (
                          <div><span className="badge badge-green" style={{ fontSize: 11 }}>{booking.productId.category}</span></div>
                        )}
                      </td>
                      <td>
                        {booking.userId?.name || <span style={{ color: "var(--text-muted)" }}>—</span>}
                        {booking.userId?.email && (
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{booking.userId.email}</div>
                        )}
                      </td>
                      <td className="admin__td-date">{fmtDate(booking.bookingDate)}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: "var(--primary-dark)" }}>
                          Rp {booking.totalAmount.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-green">Confirmed</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(booking._id)}
                          disabled={deleting === booking._id}
                        >
                          {deleting === booking._id ? "..." : "Hapus"}
                        </button>
                      </td>
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

export default AdminBookings;
