import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api'; 
import Header from './Components/Header';
import HeaderAdmin from './Components/HeaderAdmin';
import MapComponent from './Components/MapComponent';
import LocationList from './Components/LocationList';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Home from './Pages/Home';
import Favorites from './Pages/Favorites';
import Recommendations from './Pages/Recommendations';
import History from './Pages/History';
import Login from './Pages/Login';
import Account from './Pages/Account';
import MyPlaces from './Pages/MyPlaces'; 
import Admin from './Pages/Admin'; 

// Обёртка для логики отображения Header
function AppWrapper() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {isAdminPage ? <HeaderAdmin /> : <Header />}

      <Routes>
        <Route path="/" element={<><MapComponent /><Home /><LocationList /></>} />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
        <Route path="/recommendations" element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/my-places" element={
          <ProtectedRoute>
            <MyPlaces />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCUsLj0t6zzykl9q2CgjBCU-sXxyJnuv5s" libraries={['places']}>
      <AuthProvider>
        <Router>
          <AppWrapper />
        </Router>
      </AuthProvider>
    </LoadScript>
  );
}

export default App;
