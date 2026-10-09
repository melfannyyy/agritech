import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Products.css";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const getProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data || response.data);
    } catch {
      setError("Gagal mengambil data product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getProducts(); }, []);

  const handleBuyNow = (product) => {
    navigate("/booking", { state: { product } });
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>🛒 Agri Marketplace</h1>
          <p>Beli kebutuhan pertanian berkualitas — pupuk, benih, dan peralatan terbaik</p>
        </div>

        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <span>Memuat produk...</span>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && products.length === 0 && (
          <div className="card products__empty">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
            <h3>Belum ada produk</h3>
            <p>Produk akan segera tersedia.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid-3 products__grid">
            {products.map((product) => (
              <div key={product._id} className="card products__card">
                <div className="products__img-wrap">
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="products__img"
                    onError={(e) => { e.target.src = "https://placehold.co/400x220/dcfce7/166534?text=No+Image"; }}
                  />
                  <span className="badge badge-green products__category">{product.category}</span>
                </div>
                <div className="products__body">
                  <h3 className="products__name">{product.name}</h3>
                  <p className="products__desc">{product.description}</p>
                  <div className="products__footer">
                    <span className="products__price">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleBuyNow(product)}
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
