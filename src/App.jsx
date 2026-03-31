import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Admin from './pages/Admin';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';

// 1. Қорғаныс компоненті: Тіркелмеген адамды өткізбейді
const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token"); // Логин кезінде сақталған токен
  const userRole = localStorage.getItem("role"); // Пайдаланушы рөлі (ADMIN немесе USER)

  if (!token) {
    // Егер токен жоқ болса, логин бетіне жібереді
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userRole !== "ADMIN") {
    // Егер бет тек админге арналған болса, бірақ рөл сәйкес келмесе
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Ашық беттер (кез келген адам көре алады) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Жабық беттер (тек тіркелгендерге) */}
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/book/:id" element={
          <PrivateRoute>
            <BookDetails />
          </PrivateRoute>
        } />
        <Route path="/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        {/* Тек Админге арналған бет */}
        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}>
            <Admin />
          </PrivateRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;