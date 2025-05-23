import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api'; 
import Header from './Components/Header';
import HeaderAdmin from './Components/HeaderAdmin';
import MapComponent from './Components/MapComponent';
import LocationList from './Components/LocationList';

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
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/my-places" element={<MyPlaces />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCUsLj0t6zzykl9q2CgjBCU-sXxyJnuv5s" libraries={['places']}>
      <Router>
        <AppWrapper />
      </Router>
    </LoadScript>
  );
}

export default App;
