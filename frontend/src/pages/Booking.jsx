import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Booking.css";

// Format today's date as "DD Month YYYY" in Indonesian
const todayDisplay = new Date().toLocaleDateString("id-ID", {
  day: "numeric", month: "long", year: "numeric",
});

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user }  = useAuth();

  const product = location.state?.product;

  const [quantity, setQuantity]     = useState(1);
  const [error, setError]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  if (!product) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="card booking__not-found">
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2>Produk tidak ditemukan</h2>
            <p>Silakan kembali ke halaman produk dan pilih produk yang ingin dipesan.</p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/products")}>
              Kembali ke Produk
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = product.price * quantity;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/bookings", {
        userId:      user?._id,
        productId:   product._id,
        bookingDate: new Date(),
        quantity,
        totalAmount,
      });
      setSuccess(true);
    } catch {
      setError("Gagal membuat booking. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="card booking__success">
            <div className="booking__success-icon">✅</div>
            <h2>Booking Berhasil!</h2>
            <p>Pesanan Anda untuk <strong>{product.name}</strong> ({quantity} item) telah berhasil dibuat.</p>
            <div className="booking__success-actions">
              <button className="btn btn-outline" onClick={() => navigate("/products")}>
                Belanja Lagi
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/my-orders")}>
                Lihat Pesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>📦 Booking Produk</h1>
          <p>Konfirmasi pesanan Anda</p>
        </div>

        <div className="booking__layout">
          {/* Product summary */}
          <div className="card booking__product-card">
            <h2 className="booking__section-title">Detail Produk</h2>
            <div className="booking__product-info">
              {product.imgUrl && (
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="booking__product-img"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <h3>{product.name}</h3>
              <div className="booking__product-meta">
                <span className="badge badge-green">{product.category}</span>
              </div>
              <p className="booking__product-desc">{product.description}</p>
              <hr className="divider" />
              <div className="booking__price-row">
                <span>Harga Satuan</span>
                <span className="booking__price">Rp {product.price.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card booking__form-card">
            <h2 className="booking__section-title">Detail Pemesanan</h2>
            <form onSubmit={handleSubmit}>

              {/* Tanggal — read-only, sysdate */}
              <div className="form-group">
                <label>Tanggal Pemesanan</label>
                <div className="booking__date-display">
                  📅 {todayDisplay}
                </div>
              </div>

              {/* Quantity stepper */}
              <div className="form-group">
                <label htmlFor="quantity">Jumlah</label>
                <div className="booking__qty-wrap">
                  <button
                    type="button"
                    className="booking__qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >−</button>
                  <input
                    id="quantity"
                    type="number"
                    className="form-control booking__qty-input"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  />
                  <button
                    type="button"
                    className="booking__qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >+</button>
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="booking__total-summary">
                <span>Total yang dibayar</span>
                <span className="booking__total-val">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={submitting}
              >
                {submitting ? "Memproses..." : "Konfirmasi Pesanan"}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => navigate("/products")}
              >
                Kembali
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
