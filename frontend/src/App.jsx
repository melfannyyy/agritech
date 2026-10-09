import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Farms from "./pages/Farms.jsx";
import Crops from "./pages/Crops.jsx";
import CropInfo from "./pages/CropInfo.jsx";
import CropDetail from "./pages/CropDetail.jsx";
import Weather from "./pages/Weather.jsx";
import Products from "./pages/Products.jsx";
import Booking from "./pages/Booking.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import PestAlerts from "./pages/PestAlerts.jsx";
import Forum from "./pages/Forum.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminAddProduct from "./pages/admin/AdminAddProduct.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminFarms from "./pages/admin/AdminFarms.jsx";

// Hanya bisa diakses jika sudah login (role: farmer atau admin)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // tunggu rehydrate dari localStorage
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Hanya bisa diakses jika role = admin
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

// Redirect ke dashboard jika sudah login (untuk /login dan /register)
function GuestRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Farmer — harus login */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/farms"       element={<ProtectedRoute><Farms /></ProtectedRoute>} />
        <Route path="/crops"       element={<ProtectedRoute><Crops /></ProtectedRoute>} />
        <Route path="/crop-info"          element={<ProtectedRoute><CropInfo /></ProtectedRoute>} />
        <Route path="/crop-info/:slug"    element={<ProtectedRoute><CropDetail /></ProtectedRoute>} />
        <Route path="/weather"     element={<ProtectedRoute><Weather /></ProtectedRoute>} />
        <Route path="/products"    element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/booking"     element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/my-orders"   element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/pest-alerts" element={<ProtectedRoute><PestAlerts /></ProtectedRoute>} />
        <Route path="/forum"       element={<ProtectedRoute><Forum /></ProtectedRoute>} />

        {/* Admin — harus login + role admin */}
        <Route path="/admin"                element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users"          element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/products"       element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/add"   element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
        <Route path="/admin/bookings"       element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin/farms"          element={<AdminRoute><AdminFarms /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
