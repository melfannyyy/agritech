import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./MyOrders.css";

function MyOrders() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!user?._id) return;
    const getBookings = async () => {
      try {
        // Filter bookings by the logged-in user's ID
        const response = await api.get(`/getbookings/${user._id}`);
        setBookings(response.data.data || response.data);
      } catch {
        setError("Gagal mengambil data pesanan.");
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, [user]);

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>📦 My Orders</h1>
          <p>Riwayat seluruh pesanan yang telah Anda buat</p>
        </div>

        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <span>Memuat pesanan...</span>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="card orders__empty">
            <div className="orders__empty-icon">📭</div>
            <h3>Belum ada pesanan</h3>
            <p>Pesanan Anda akan muncul di sini setelah melakukan pembelian.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
              Mulai Belanja →
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <>
            {/* Summary bar */}
            <div className="orders__summary">
              <div className="orders__summary-item">
                <span className="orders__summary-icon">📦</span>
                <div>
                  <div className="orders__summary-val">{bookings.length}</div>
                  <div className="orders__summary-label">Total Pesanan</div>
                </div>
              </div>
              <div className="orders__summary-divider" />
              <div className="orders__summary-item">
                <span className="orders__summary-icon">💰</span>
                <div>
                  <div className="orders__summary-val orders__summary-val--green">
                    Rp {totalSpent.toLocaleString("id-ID")}
                  </div>
                  <div className="orders__summary-label">Total Pembelian</div>
                </div>
              </div>
              <div className="orders__summary-divider" />
              <div className="orders__summary-item">
                <span className="orders__summary-icon">✅</span>
                <div>
                  <div className="orders__summary-val">{bookings.length}</div>
                  <div className="orders__summary-label">Confirmed</div>
                </div>
              </div>
            </div>

            {/* Order list */}
            <div className="orders__list">
              {bookings.map((booking, idx) => (
                <div key={booking._id} className="card orders__card">
                  <div className="orders__card-num">#{idx + 1}</div>

                  {/* Product image */}
                  {booking.productId?.imgUrl && (
                    <div className="orders__card-img-wrap">
                      <img
                        src={booking.productId.imgUrl}
                        alt={booking.productId?.name}
                        className="orders__card-img"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}

                  <div className="orders__card-body">
                    <div className="orders__card-top">
                      <div>
                        <h3>{booking.productId?.name || "Produk"}</h3>
                        {booking.productId?.category && (
                          <span className="badge badge-green" style={{ marginTop: 4, display: "inline-block" }}>
                            {booking.productId.category}
                          </span>
                        )}
                      </div>
                      <span className="badge badge-green orders__status">✓ Confirmed</span>
                    </div>

                    <div className="orders__card-meta">
                      <div className="orders__meta-item">
                        <span className="orders__meta-label">📅 Tanggal Pesan</span>
                        <span className="orders__meta-value">{fmtDate(booking.bookingDate)}</span>
                      </div>
                      <div className="orders__meta-item">
                        <span className="orders__meta-label">💰 Total Bayar</span>
                        <span className="orders__meta-value orders__total">
                          Rp {booking.totalAmount.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
