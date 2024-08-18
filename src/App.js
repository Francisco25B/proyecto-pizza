import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ProfileUser from './components/ProfileUser';
import ProgresoPedido from './components/ProgresoPedido';
import { CartProvider } from './components/CartContext';
import { AuthProvider, useAuthentication } from './components/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Hook personalizado para obtener el estado del pedido
// Hook personalizado para obtener el id y el estado del pedido
const usePedidoEstado = (pedidoId) => {
  const [pedido, setPedido] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pedidoId) {
      setLoading(true);
      fetch(`https://backend-pizza-p9w9.onrender.com/api/pedidos/${pedidoId}`)
        .then(response => {
          console.log('Respuesta recibida:', response); // Para depuración
          if (!response.ok) {
            throw new Error('Error en la red o en el servidor');
          }
          return response.json();
        })
        .then(data => {
          console.log('Datos recibidos:', data); // Para depuración
          if (data && data.id !== undefined && data.estado_pedido !== undefined) {
            setPedido(data);
          } else {
            setPedido({ id: 'No disponible', estado_pedido: 'Estado no disponible' });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al obtener el estado del pedido:', err);
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [pedidoId]);

  return { pedido, loading, error };
};

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

  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);

  const { user, login, logout } = useAuthentication();
  const id = user ? user.id : null; // Obtén el ID del usuario

  const { pedido, loading, error } = usePedidoEstado(id);

  return (
    <div className={`App ${isAdminRoute ? 'admin-mode' : ''}`}>
      {!isAdminRoute && (
        <>
          <Header
            toggleLoginModal={() => setLoginModalVisible(!isLoginModalVisible)}
            notifications={[]} // Asegúrate de que las notificaciones se están pasando correctamente
          />
        </>
      )}

      <main>
        {isLoginModalVisible && (
          <LoginModal
            toggleLoginModal={() => setLoginModalVisible(!isLoginModalVisible)}
            openRegisterModal={() => setRegisterModalVisible(true)}
            onLoginSuccess={(userData) => {
              login(userData);
              setLoginModalVisible(false);
            }}
          />
        )}
        {isRegisterModalVisible && (
          <RegisterModal
            toggleRegisterModal={() => setRegisterModalVisible(!isRegisterModalVisible)}
            toggleLoginModal={() => setLoginModalVisible(true)}
            onRegisterSuccess={() => {
              setRegisterModalVisible(false);
              setLoginModalVisible(true);
            }}
          />
        )}

        <Routes>
          <Route path="/" element={
            <> 
              <section id="home" className="home">
                <h1>Bienvenidos a Giovannis Pizza</h1>
                <ImageCarousel />
                <p>¡Las mejores pizzas!</p>
                <ServiceHours />
              </section>
            </>
          } />
          
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage toggleLoginModal={() => setLoginModalVisible(true)} />} />
          <Route path="/profile" element={<ProfileUser />} />
          <Route path="/administrador" element={
            <ProtectedRoute toggleLoginModal={() => setLoginModalVisible(true)}>
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
