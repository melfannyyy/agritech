import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Admin.css";

const CHART_H = 150;

const COLORS = [
  "var(--green-600)",
  "var(--sky-600)",
  "var(--earth-600)",
];

function BarChartSVG({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) =>
    Math.round(max * f)
  );

  return (
    <div className="adm__chart">

      {/* Y-axis */}
      <div
        className="adm__chart-y"
        style={{ height: CHART_H }}
      >
        {[...ticks].reverse().map((v, index) => (
          <span key={`${v}-${index}`}>
            {v}
          </span>
        ))}
      </div>

      {/* Bars */}
      <div
        className="adm__chart-bars"
        style={{ height: CHART_H }}
      >
        {data.map((d, i) => {
          const barPx =
            max > 0
              ? Math.round((d.value / max) * CHART_H)
              : 0;

          return (
            <div
              key={d.label}
              className="adm__chart-col"
            >
              {/* Value */}
              <span className="adm__chart-val">
                {d.value}
              </span>

              {/* Bar */}
              <div
                className="adm__chart-bar"
                style={{
                  height: `${barPx}px`,
                  background:
                    COLORS[i % COLORS.length],
                }}
                title={`${d.label}: ${d.value}`}
              />

              {/* Label */}
              <span className="adm__chart-label">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: null,
    farms: null,
    products: null,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          usersRes,
          farmsRes,
          productsRes,
        ] = await Promise.all([
          api.get("/users"),
          api.get("/farms"),
          api.get("/products"),
        ]);

        const users =
          usersRes.data.data ??
          usersRes.data ??
          [];

        const farms =
          farmsRes.data.data ??
          farmsRes.data ??
          [];

        const products =
          productsRes.data.data ??
          productsRes.data ??
          [];

        setStats({
          users: users.length,
          farms: farms.length,
          products: products.length,
        });

        // =========================
        // RECENT USERS
        // =========================
        setRecentUsers(
          [...users]
            .sort(
              (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            )
            .slice(0, 5)
        );

        // =========================
        // RECENT PRODUCTS
        // =========================
        setRecentProducts(
          [...products]
            .sort(
              (a, b) =>
                new Date(b.createdAt || b._id) -
                new Date(a.createdAt || a._id)
            )
            .slice(0, 5)
        );
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // =========================
  // STAT CARDS
  // =========================
  const STAT_CARDS = [
    {
      icon: "👥",
      label: "Total Users",
      value: stats.users,
      color: "green",
      to: "/admin/users",
    },
    {
      icon: "🏡",
      label: "Total Farms",
      value: stats.farms,
      color: "blue",
      to: "/admin/farms",
    },
    {
      icon: "🛒",
      label: "Total Products",
      value: stats.products,
      color: "yellow",
      to: "/admin/products",
    },
  ];

  // =========================
  // CHART DATA
  // =========================
  const chartData = [
    {
      label: "Users",
      value: stats.users ?? 0,
    },
    {
      label: "Farms",
      value: stats.farms ?? 0,
    },
    {
      label: "Products",
      value: stats.products ?? 0,
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* =========================
            HEADER
        ========================= */}
        <div className="page-header">
          <h1>⚙️ Admin Dashboard</h1>

          <p>
            Overview of your agricultural
            management system
          </p>
        </div>

        {/* =========================
            STAT CARDS
        ========================= */}
        <div className="adm__stat-row">
          {STAT_CARDS.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className={`card adm__stat-card adm__stat-card--${s.color}`}
            >
              <div
                className={`adm__stat-icon-wrap adm__stat-icon-wrap--${s.color}`}
              >
                {s.icon}
              </div>

              <div className="adm__stat-body">
                <div className="adm__stat-label">
                  {s.label}
                </div>

                <div className="adm__stat-val">
                  {loading ? (
                    <span className="adm__skeleton" />
                  ) : (
                    s.value ?? "—"
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* =========================
            SYSTEM OVERVIEW
        ========================= */}
        <div className="card adm__overview-card">

          <div className="adm__section-head">
            <h2>
              📊 System Overview
            </h2>

            <p>
              Jumlah data terdaftar di seluruh
              platform
            </p>
          </div>

          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
            </div>
          ) : (
            <BarChartSVG data={chartData} />
          )}
        </div>

        {/* =========================
            RECENT USERS + PRODUCTS
        ========================= */}
        <div className="adm__recent-row">

          {/* =========================
              RECENT USERS
          ========================= */}
          <div className="card adm__recent-card">

            <div className="adm__recent-head">
              <h3>
                👥 Recent Users
              </h3>

              <Link
                to="/admin/users"
                className="adm__recent-link"
              >
                Lihat semua →
              </Link>
            </div>

            <div className="adm__recent-list">

              {loading ? (
                <div
                  className="loading-wrap"
                  style={{
                    padding: "24px 0",
                  }}
                >
                  <div className="spinner" />
                </div>
              ) : recentUsers.length === 0 ? (
                <p className="adm__recent-empty">
                  Belum ada user.
                </p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="adm__recent-item"
                  >

                    <div className="adm__recent-avatar">
                      {u.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <div className="adm__recent-info">

                      <div className="adm__recent-name">
                        {u.name || "—"}
                      </div>

                      <div className="adm__recent-sub">
                        {u.email}
                      </div>

                    </div>

                    <span
                      className={`badge ${
                        u.role === "admin"
                          ? "badge-yellow"
                          : "badge-green"
                      }`}
                    >
                      {u.role}
                    </span>

                  </div>
                ))
              )}

            </div>
          </div>

          {/* =========================
              RECENT PRODUCTS
          ========================= */}
          <div className="card adm__recent-card">

            <div className="adm__recent-head">
              <h3>
                🛒 Recent Products
              </h3>

              <Link
                to="/admin/products"
                className="adm__recent-link"
              >
                Lihat semua →
              </Link>
            </div>

            <div className="adm__recent-list">

              {loading ? (
                <div
                  className="loading-wrap"
                  style={{
                    padding: "24px 0",
                  }}
                >
                  <div className="spinner" />
                </div>
              ) : recentProducts.length === 0 ? (
                <p className="adm__recent-empty">
                  Belum ada produk.
                </p>
              ) : (
                recentProducts.map((p) => (
                  <div
                    key={p._id}
                    className="adm__recent-item"
                  >

                    <div className="adm__recent-img-wrap">
                      <img
                        src={p.imgUrl}
                        alt={p.name}
                        className="adm__recent-img"
                        onError={(e) => {
                          e.target.style.display =
                            "none";
                        }}
                      />
                    </div>

                    <div className="adm__recent-info">

                      <div className="adm__recent-name">
                        {p.name}
                      </div>

                      <div className="adm__recent-sub">
                        {p.category}
                      </div>

                    </div>

                    <span className="adm__recent-price">
                      Rp{" "}
                      {Number(
                        p.price || 0
                      ).toLocaleString("id-ID")}
                    </span>

                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;