import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import Signup from "./components/Auth/Signup"
import Home from "./components/Home";
import Events from "./components/Events";
import ProgressBar from "./components/ProgressBar"

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path="/event/:eventId" element={<Events />} />
        <Route path="/tasks" element={<ProgressBar />} />
      </Routes>
    </>

  );
};

export default App;
