import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import { CartProvider } from './context/CartContext';

// Admin imports
import { AuthProvider } from './admin/context/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import ProductForm from './admin/pages/ProductForm';
import Orders from './admin/pages/Orders';
import OrderDetail from './admin/pages/OrderDetail';
import Customers from './admin/pages/Customers';
import ContentManager from './admin/pages/ContentManager';
import Payments from './admin/pages/Payments';
import Settings from './admin/pages/Settings';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={
            <div className="app-container">
              <Navbar />
              <main><Home /></main>
              <Footer />
            </div>
          } />
          <Route path="/shop" element={
            <div className="app-container">
              <Navbar />
              <main><Shop /></main>
              <Footer />
            </div>
          } />
          <Route path="/product/:id" element={
            <div className="app-container">
              <Navbar />
              <main><ProductDetail /></main>
              <Footer />
            </div>
          } />
          <Route path="/cart" element={
            <div className="app-container">
              <Navbar />
              <main><Cart /></main>
              <Footer />
            </div>
          } />
          <Route path="/checkout" element={
            <div className="app-container">
              <Navbar />
              <main><Checkout /></main>
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="app-container">
              <Navbar />
              <main><About /></main>
              <Footer />
            </div>
          } />
          <Route path="/blog" element={
            <div className="app-container">
              <Navbar />
              <main><Blog /></main>
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="app-container">
              <Navbar />
              <main><Contact /></main>
              <Footer />
            </div>
          } />
          <Route path="/faq" element={
            <div className="app-container">
              <Navbar />
              <main><FAQ /></main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <AuthProvider>
              <AdminLogin />
            </AuthProvider>
          } />
          <Route path="/admin/*" element={
            <AuthProvider>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </AuthProvider>
          }>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="customers" element={<Customers />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
