import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuPage from './pages/MenuPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import ImageCarousel from './components/Carousel';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CartPage from './components/CartPage'; // Asegúrate de que la ruta es correcta
import ServiceHours from './components/ServiceHours';
import AdminInterface from './pages/AdminInterface';
import ProfileUser from './components/ProfileUser'; // Asegúrate de que la ruta es correcta
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuthentication } from './components/authContext';
import ProtectedRoute from './components/ProtectedRoute';
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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/administrador');
  
  // Estado para controlar la visibilidad de los modales
  const [isLoginModalVisible, setLoginModalVisible] = React.useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = React.useState(false);

  // Hook de autenticación
  const { user, login, logout } = useAuthentication();

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
      
      <main>
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
            toggleLoginModal={toggleLoginModal} // Cambié `openLoginModal` por `toggleLoginModal`
          />
        )}

        <Routes>
          <Route path="/" element={
            <>
              <section id="home" className="home">
                <h1>Bienvenidos a Giovannis Pizza</h1>
                <p>¡Las mejores pizzas!</p>
                {!isAdminRoute && !user && (
                  <ImageCarousel />
                )}
                <ServiceHours />
              </section>
            </>
          } />
          
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage toggleLoginModal={toggleLoginModal} />} />
          <Route path="/profile" element={<ProfileUser />} /> {/* Asegúrate de que ProfileUser esté importado */}
          <Route path="/administrador/*" element={
            <ProtectedRoute toggleLoginModal={toggleLoginModal}>
              <AdminInterface />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
