import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api'; 
import Header from './Components/Header';
import MapComponent from './Components/MapComponent';
import LocationList from './Components/LocationList';


import Home from './Pages/Home';
import Favorites from './Pages/Favorites';
import Recommendations from './Pages/Recommendations';
import History from './Pages/History';
import Login from './Pages/Login';

function App() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCUsLj0t6zzykl9q2CgjBCU-sXxyJnuv5s" libraries={['places']}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<><MapComponent /><Home /><LocationList /></>} />
          
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </LoadScript>
  );
}

export default App;
