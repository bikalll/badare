import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useProductStore } from './store/useProductStore';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { OrderTracking } from './pages/OrderTracking';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminFAQs } from './pages/admin/AdminFAQs';
import { AdminHero } from './pages/admin/AdminHero';
import { AdminTrending } from './pages/admin/AdminTrending';
import { Layout } from './components/Layout';
import { Preloader } from './components/Preloader';

const FrontendLayout = () => (
    <Layout>
        <Outlet />
    </Layout>
);

function App() {
    const { fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <Router>
            <Preloader />
            <Routes>
                <Route element={<FrontendLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/track" element={<OrderTracking />} />
                    <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="faqs" element={<AdminFAQs />} />
                    <Route path="hero" element={<AdminHero />} />
                    <Route path="trending" element={<AdminTrending />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
