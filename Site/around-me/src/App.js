// App.js
import React from 'react';
import Header from './Components/Header';
import MapComponent from './Components/MapComponent';
import LocationList from './Components/LocationList';

function App() {
  return (
    <>
      <Header />  
      <MapComponent /> 
        <LocationList /> 
    </>
  );
}

export default App;
