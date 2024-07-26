import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuPage from './pages/MenuPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import ImageCarousel from './components/Carousel';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CartPage from './components/CartPage';
import ServiceHours from './components/ServiceHours';
import AdminInterface from './pages/AdminInterface';
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuthentication } from './components/authentication';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { user, login, logout } = useAuthentication();
  const [isLoginModalVisible, setLoginModalVisible] = React.useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = React.useState(false);
  
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/administrador');

  const toggleLoginModal = () => {
    setLoginModalVisible(!isLoginModalVisible);
    if (isRegisterModalVisible) {
      setRegisterModalVisible(false);
    }
  };

  const toggleRegisterModal = () => {
    setRegisterModalVisible(!isRegisterModalVisible);
    if (isLoginModalVisible) {
      setLoginModalVisible(false);
    }
  };

  const handleSuccessfulLogin = (userData) => {
    login(userData);
    setLoginModalVisible(false);
  };

  return (
    <div className={`App ${isAdminRoute ? 'admin-mode' : ''}`}>
      {!isAdminRoute && (
        <Header
          toggleLoginModal={toggleLoginModal}
          user={user}
          handleLogout={logout}
        />
      )}
      
      {!isAdminRoute && (
        <>
          {isLoginModalVisible && (
            <LoginModal
              toggleLoginModal={toggleLoginModal}
              openRegisterModal={toggleRegisterModal}
              onLoginSuccess={handleSuccessfulLogin}
            />
          )}
          {isRegisterModalVisible && (
            <RegisterModal
              toggleRegisterModal={toggleRegisterModal}
              openLoginModal={toggleLoginModal}
            />
          )}
        </>
      )}

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <section id="home" className="home">
                <h1>Bienvenidos a Giovannis Pizza</h1>
                <ImageCarousel /> {/* Carrusel aquí */}
                <p>¡Las mejores pizzas!</p>
                <ServiceHours />
              </section>
            </>
          } />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage toggleLoginModal={toggleLoginModal} />} />
          <Route path="/administrador/*" element={<AdminInterface />} />
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;

